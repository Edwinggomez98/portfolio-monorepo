import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedQuoteEntity } from '../../adapters/output/persistence/entities/saved-quote.entity';
import { CreateSavedQuoteDto } from './saved-quotes.dto';

@Injectable()
export class SavedQuotesService {
  constructor(
    @InjectRepository(SavedQuoteEntity)
    private readonly repo: Repository<SavedQuoteEntity>,
  ) {}

  async create(dto: CreateSavedQuoteDto): Promise<SavedQuoteEntity> {
    const entity = this.repo.create({
      quoteNumber:   dto.quoteNumber,
      itemCount:     dto.itemsSnapshot.length,
      subtotal:      dto.subtotal,
      taxRate:       dto.taxRate,
      total:         dto.total,
      currency:      dto.currency,
      notes:         dto.notes ?? null,
      validUntil:    dto.validUntil ?? null,
      itemsSnapshot: dto.itemsSnapshot,
    });
    return this.repo.save(entity);
  }

  async findAll(): Promise<SavedQuoteEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<SavedQuoteEntity | null> {
    return this.repo.findOneBy({ id });
  }
}
