import { Entity, Column, PrimaryColumn } from 'typeorm';
import { VehicleStatus } from '../../../domain/entities/vehicle.entity';

@Entity('vehicles')
export class VehicleEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  vin: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column('decimal', { precision: 10, scale: 2 })
  monthlyLeaseRateAmount: number;

  @Column()
  monthlyLeaseRateCurrency: string;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE,
  })
  status: VehicleStatus;
} 