import * as https from 'https';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceEntity } from '../../adapters/output/persistence/entities/device.entity';

export interface DeviceSearchQuery {
  q?: string;
  type?: string;
  brand?: string;
  year?: string;
  limit?: number;
  offset?: number;
}

interface DummyJsonProduct {
  id: number;
  title: string;
  brand?: string;
  price: number;
  category: string;
  description?: string;
  tags?: string[];
  ram?: string;
  storage?: string;
}

interface DummyJsonResponse {
  products: DummyJsonProduct[];
  total: number;
}

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name);

  constructor(
    @InjectRepository(DeviceEntity)
    private readonly repo: Repository<DeviceEntity>,
  ) {}

  async search(query: DeviceSearchQuery): Promise<{ data: DeviceEntity[]; total: number }> {
    const { q, type, brand, year, limit = 50, offset = 0 } = query;

    const qb = this.repo.createQueryBuilder('d');

    if (q?.trim()) {
      qb.andWhere(
        '(d.brand ILIKE :q OR d.model ILIKE :q)',
        { q: `%${q.trim()}%` },
      );
    }
    if (type && type !== 'all') qb.andWhere('d.type = :type', { type });
    if (brand) qb.andWhere('d.brand ILIKE :brand', { brand: `%${brand}%` });
    if (year) qb.andWhere('d.year = :year', { year });

    qb.orderBy('d.year', 'DESC').addOrderBy('d.brand', 'ASC').addOrderBy('d.model', 'ASC');
    qb.take(limit).skip(offset);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async getTypes(brand?: string): Promise<string[]> {
    const qb = this.repo
      .createQueryBuilder('d')
      .select('DISTINCT d.type', 'type')
      .orderBy('d.type');
    if (brand) qb.where('d.brand ILIKE :brand', { brand });
    const rows = await qb.getRawMany<{ type: string }>();
    return rows.map(r => r.type);
  }

  async getBrands(type?: string): Promise<string[]> {
    const qb = this.repo
      .createQueryBuilder('d')
      .select('DISTINCT d.brand', 'brand')
      .orderBy('d.brand');
    if (type) qb.where('d.type = :type', { type });
    const rows = await qb.getRawMany<{ brand: string }>();
    return rows.map(r => r.brand);
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async bulkInsert(devices: Partial<DeviceEntity>[]): Promise<void> {
    const BATCH = 500;
    for (let i = 0; i < devices.length; i += BATCH) {
      await this.repo
        .createQueryBuilder()
        .insert()
        .into(DeviceEntity)
        .values(devices.slice(i, i + BATCH))
        .execute();
    }
  }

  private httpsGet(url: string): Promise<string> {
    const isProd = process.env.NODE_ENV === 'production';
    return new Promise((resolve, reject) => {
      const parsed = new URL(url);
      const req = https.get(
        {
          hostname: parsed.hostname,
          path: parsed.pathname + parsed.search,
          rejectUnauthorized: isProd,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk: Buffer) => (data += chunk.toString()));
          res.on('end', () => resolve(data));
        },
      );
      req.on('error', reject);
    });
  }

  async syncFromExternalApi(): Promise<{ inserted: number; skipped: number; categories: string[] }> {
    const CATEGORY_TYPE_MAP: Record<string, string> = {
      smartphones:         'smartphone',
      laptops:             'laptop',
      tablets:             'tablet',
      'mobile-accessories': 'accessory',
    };

    let inserted = 0;
    let skipped  = 0;

    for (const [category, deviceType] of Object.entries(CATEGORY_TYPE_MAP)) {
      const url = `https://dummyjson.com/products/category/${category}?limit=100`;
      this.logger.log(`Fetching ${category} from ${url}`);

      const raw  = await this.httpsGet(url);
      const json = JSON.parse(raw) as DummyJsonResponse;

      for (const p of json.products ?? []) {
        const titleWords  = (p.title ?? '').trim().split(/\s+/);
        const brandRaw    = p.brand?.trim() || titleWords[0] || 'Unknown';
        const modelRaw    = titleWords
          .join(' ')
          .replace(new RegExp(`^${brandRaw}\\s*`, 'i'), '')
          .trim() || p.title;

        const exists = await this.repo.findOne({ where: { brand: brandRaw, model: modelRaw } });
        if (exists) { skipped++; continue; }

        await this.repo.save(
          this.repo.create({
            brand:   brandRaw,
            model:   modelRaw || p.title,
            type:    deviceType,
            price:   p.price ? `$${p.price}` : null,
            year:    null,
            ram:     null,
            storage: null,
            os:      null,
            chipset: null,
          }),
        );
        inserted++;
      }
    }

    this.logger.log(`Sync done: ${inserted} inserted, ${skipped} skipped`);
    return { inserted, skipped, categories: Object.keys(CATEGORY_TYPE_MAP) };
  }
}
