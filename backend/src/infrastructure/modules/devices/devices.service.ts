import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { DeviceEntity } from '../../adapters/output/persistence/entities/device.entity';

export interface DeviceSearchQuery {
  q?: string;
  type?: string;
  brand?: string;
  year?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class DevicesService {
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

  async getTypes(): Promise<string[]> {
    const rows = await this.repo
      .createQueryBuilder('d')
      .select('DISTINCT d.type', 'type')
      .orderBy('d.type')
      .getRawMany<{ type: string }>();
    return rows.map(r => r.type);
  }

  async getBrands(): Promise<string[]> {
    const rows = await this.repo
      .createQueryBuilder('d')
      .select('DISTINCT d.brand', 'brand')
      .orderBy('d.brand')
      .getRawMany<{ brand: string }>();
    return rows.map(r => r.brand);
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async bulkInsert(devices: Partial<DeviceEntity>[]): Promise<void> {
    // Inserta en lotes de 500 para no saturar PostgreSQL
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
}
