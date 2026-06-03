import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Guarda metadata de una cotización generada.
 * No almacena datos del cliente (privacidad).
 */
@Entity('saved_quotes')
export class SavedQuoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Número de cotización legible, ej: QT-20240603-001 */
  @Column({ type: 'varchar', length: 30, name: 'quote_number' })
  quoteNumber: string;

  /** Cantidad total de ítems en la cotización */
  @Column({ type: 'int', name: 'item_count', default: 0 })
  itemCount: number;

  /** Subtotal antes de impuestos */
  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    name: 'subtotal',
    default: 0,
  })
  subtotal: number;

  /** Porcentaje de IVA aplicado */
  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    name: 'tax_rate',
    default: 0,
  })
  taxRate: number;

  /** Total final con impuestos */
  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    name: 'total',
    default: 0,
  })
  total: number;

  /** Moneda usada: USD, EUR, VES */
  @Column({ type: 'varchar', length: 5, default: 'USD' })
  currency: string;

  /** Notas adicionales del cotizador (opcional) */
  @Column({ type: 'text', nullable: true })
  notes: string | null;

  /** Fecha de validez de la cotización */
  @Column({ type: 'date', name: 'valid_until', nullable: true })
  validUntil: string | null;

  /** Items como snapshot JSON: [{description, qty, unitPrice, total}] */
  @Column({ type: 'jsonb', name: 'items_snapshot' })
  itemsSnapshot: object[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
