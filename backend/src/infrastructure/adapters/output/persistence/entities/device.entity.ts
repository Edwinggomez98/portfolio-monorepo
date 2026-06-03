import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('devices')
export class DeviceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  brand: string;

  @Index()
  @Column({ type: 'varchar', length: 200 })
  model: string;

  @Column({ type: 'varchar', length: 20, default: 'smartphone' })
  type: string;

  @Column({ type: 'varchar', length: 4, nullable: true })
  year: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ram: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  storage: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  os: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  chipset: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  price: string | null;
}
