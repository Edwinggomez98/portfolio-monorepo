import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuoteEntity } from './quote.entity';
import { ComponentEntity } from './component.entity';

@Entity('quote_items')
export class QuoteItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => QuoteEntity, (quote) => quote.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quote_id' })
  quote: QuoteEntity;

  @ManyToOne(() => ComponentEntity, (component) => component.quoteItems, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'component_id' })
  component: ComponentEntity;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  // Precio al momento de cotizar (snapshot histórico)
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    name: 'unit_price',
  })
  unitPrice: number;
}
