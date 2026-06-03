import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from './infrastructure/adapters/output/persistence/entities/device.entity';
import { SavedQuoteEntity } from './infrastructure/adapters/output/persistence/entities/saved-quote.entity';
import { DevicesModule } from './infrastructure/modules/devices/devices.module';
import { SavedQuotesModule } from './infrastructure/modules/saved-quotes/saved-quotes.module';

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
        host:     config.get('DB_HOST',     'localhost'),
        port:     config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME',     'portfolio_db'),
        entities:    [DeviceEntity, SavedQuoteEntity],
        synchronize: config.get('NODE_ENV') !== 'production',
        logging:     config.get('NODE_ENV') === 'development',
      }),
    }),
    DevicesModule,
    SavedQuotesModule,
  ],
})
export class AppModule {}
