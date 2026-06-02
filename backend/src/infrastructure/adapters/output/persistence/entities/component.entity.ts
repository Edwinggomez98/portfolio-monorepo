import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { QuoteItemEntity } from './quote-item.entity';

@Entity('components')
export class ComponentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CategoryEntity, (category) => category.components, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Column({ type: 'varchar', length: 100 })
  brand: string;

  @Column({ type: 'varchar', length: 255 })
  model: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'integer', default: 0 })
  stock: number;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  // Columnas de compatibilidad crítica (indexadas para filtros rápidos)
  @Index()
  @Column({ type: 'varchar', length: 50, nullable: true })
  socket: string | null;

  @Index()
  @Column({ type: 'varchar', length: 20, name: 'ram_type', nullable: true })
  ramType: string | null;

  @Index()
  @Column({ type: 'varchar', length: 50, name: 'form_factor', nullable: true })
  formFactor: string | null;

  @Column({ type: 'integer', name: 'power_wattage', nullable: true })
  powerWattage: number | null;

  // Especificaciones secundarias como JSON flexible
  @Column({ type: 'jsonb', nullable: true, default: {} })
  specifications: Record<string, unknown>;

  @OneToMany(() => QuoteItemEntity, (item) => item.component)
  quoteItems: QuoteItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
