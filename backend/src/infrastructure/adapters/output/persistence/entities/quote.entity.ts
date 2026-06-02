import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { QuoteItemEntity } from './quote-item.entity';

export enum QuoteStatus {
  DRAFT = 'draft',
  SAVED = 'saved',
  COMPLETED = 'completed',
}

@Entity('quotes')
export class QuoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.quotes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 50, default: QuoteStatus.DRAFT })
  status: QuoteStatus;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    name: 'total_price',
    default: 0,
  })
  totalPrice: number;

  @OneToMany(() => QuoteItemEntity, (item) => item.quote, { cascade: true })
  items: QuoteItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
