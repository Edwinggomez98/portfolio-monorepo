/**
 * Seed script: lee assets/data/devices.json y puebla la tabla `devices`.
 * Uso: npx ts-node -r tsconfig-paths/register src/infrastructure/seeds/seed-devices.ts
 *
 * Solo inserta si la tabla está vacía (idempotente).
 */
import 'reflect-metadata';
import * as path from 'path';
import * as fs from 'fs';
import { DataSource } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DeviceEntity } from '../adapters/output/persistence/entities/device.entity';

// Ruta al JSON generado en el frontend
const JSON_PATH = path.resolve(
  __dirname,
  '../../../../frontend/src/assets/data/devices.json',
);

interface RawDevice {
  b: string; m: string; t: string; y: string;
  r: string; s: string; o: string; c: string; p: string;
}

const TYPE_MAP: Record<string, string> = {
  s: 'smartphone', t: 'tablet', l: 'laptop', w: 'smartwatch',
};

async function main() {
  // Carga .env manualmente sin NestJS bootstrap
  const dotenv = await import('dotenv');
  dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

  const useSsl = process.env.DB_SSL === 'true';
  const ds = new DataSource({
    type: 'postgres',
    host:     process.env.DB_HOST     ?? 'localhost',
    port:     Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME     ?? 'portfolio_db',
    entities: [DeviceEntity],
    synchronize: false,
    ...(useSsl && { ssl: { rejectUnauthorized: false } }),
  });

  await ds.initialize();
  const repo = ds.getRepository(DeviceEntity);

  const existing = await repo.count();
  if (existing > 0) {
    console.log(`La tabla devices ya tiene ${existing} registros. Seed omitido.`);
    await ds.destroy();
    return;
  }

  const raw: RawDevice[] = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
  console.log(`Cargando ${raw.length} dispositivos…`);

  const entities: Partial<DeviceEntity>[] = raw.map(d => ({
    brand:   d.b,
    model:   d.m,
    type:    TYPE_MAP[d.t] ?? 'smartphone',
    year:    d.y || null,
    ram:     d.r || null,
    storage: d.s || null,
    os:      d.o || null,
    chipset: d.c || null,
    price:   d.p || null,
  }));

  const BATCH = 500;
  for (let i = 0; i < entities.length; i += BATCH) {
    await repo
      .createQueryBuilder()
      .insert()
      .into(DeviceEntity)
      .values(entities.slice(i, i + BATCH))
      .execute();
    process.stdout.write(`\r  ${Math.min(i + BATCH, entities.length)} / ${entities.length}`);
  }

  console.log(`\nSeed completado: ${entities.length} dispositivos insertados.`);
  await ds.destroy();
}

main().catch(err => { console.error(err); process.exit(1); });
