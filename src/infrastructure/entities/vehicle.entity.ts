import { Entity, Column, PrimaryColumn } from 'typeorm';
import { VehicleStatus } from '../../domain/entities/vehicle.entity';

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

  @Column()
  monthlyLeaseRateAmount: number;

  @Column()
  monthlyLeaseRateCurrency: string;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE
  })
  status: VehicleStatus;

  // For backward compatibility with existing code
  get available(): boolean {
    return this.status === VehicleStatus.AVAILABLE;
  }

  set available(value: boolean) {
    this.status = value ? VehicleStatus.AVAILABLE : VehicleStatus.UNAVAILABLE;
  }
} 