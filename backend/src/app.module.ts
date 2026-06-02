import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/adapters/output/persistence/entities/user.entity';
import { CategoryEntity } from './infrastructure/adapters/output/persistence/entities/category.entity';
import { ComponentEntity } from './infrastructure/adapters/output/persistence/entities/component.entity';
import { QuoteEntity } from './infrastructure/adapters/output/persistence/entities/quote.entity';
import { QuoteItemEntity } from './infrastructure/adapters/output/persistence/entities/quote-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME', 'portfolio_db'),
        entities: [
          UserEntity,
          CategoryEntity,
          ComponentEntity,
          QuoteEntity,
          QuoteItemEntity,
        ],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
  ],
})
export class AppModule {}
