import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DeviceEntity } from './infrastructure/adapters/output/persistence/entities/device.entity';
import { SavedQuoteEntity } from './infrastructure/adapters/output/persistence/entities/saved-quote.entity';

const ENTITIES = [DeviceEntity, SavedQuoteEntity];

const SSL_OPTIONS = { rejectUnauthorized: false } as const;

function isLocalHost(host: string): boolean {
  return host === 'localhost' || host === '127.0.0.1';
}

function ensureSslMode(url: string): string {
  const cleaned = url.replace(/[&?]channel_binding=require/g, '');
  if (cleaned.includes('sslmode=')) return cleaned;
  return `${cleaned}${cleaned.includes('?') ? '&' : '?'}sslmode=require`;
}

export function buildTypeOrmConfig(config: ConfigService): TypeOrmModuleOptions {
  const isProd = config.get('NODE_ENV') === 'production';
  const databaseUrl = config.get<string>('DATABASE_URL');

  if (databaseUrl) {
    const url = ensureSslMode(databaseUrl);
    return {
      type: 'postgres',
      url,
      entities: ENTITIES,
      synchronize: !isProd,
      logging: !isProd,
      ssl: SSL_OPTIONS,
    };
  }

  const host = config.get('DB_HOST', 'localhost');
  const useSsl =
    config.get('DB_SSL') === 'true' ||
    !isLocalHost(host) ||
    host.includes('neon.tech');

  return {
    type: 'postgres',
    host,
    port:     config.get<number>('DB_PORT', 5432),
    username: config.get('DB_USERNAME', 'postgres'),
    password: config.get('DB_PASSWORD', 'postgres'),
    database: config.get('DB_NAME', 'portfolio_db'),
    entities: ENTITIES,
    synchronize: !isProd,
    logging: !isProd,
    ...(useSsl && { ssl: SSL_OPTIONS }),
  };
}
