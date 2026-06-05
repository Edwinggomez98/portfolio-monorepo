import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildTypeOrmConfig } from './database.config';
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
      useFactory: (config: ConfigService) => buildTypeOrmConfig(config),
    }),
    DevicesModule,
    SavedQuotesModule,
  ],
})
export class AppModule {}
