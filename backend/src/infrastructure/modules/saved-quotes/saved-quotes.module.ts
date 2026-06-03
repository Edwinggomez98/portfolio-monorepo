import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedQuoteEntity } from '../../adapters/output/persistence/entities/saved-quote.entity';
import { SavedQuotesService } from './saved-quotes.service';
import { SavedQuotesController } from './saved-quotes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SavedQuoteEntity])],
  providers: [SavedQuotesService],
  controllers: [SavedQuotesController],
})
export class SavedQuotesModule {}
