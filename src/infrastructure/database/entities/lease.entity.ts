import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LeaseStatus } from '../../../domain/aggregates/lease.aggregate';
import { CustomerEntity } from './customer.entity';
import { VehicleEntity } from './vehicle.entity';

@Entity('leases')
export class LeaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  customerId: string;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customerId' })
  customer: CustomerEntity;

  @Column()
  vehicleId: string;

  @ManyToOne(() => VehicleEntity)
  @JoinColumn({ name: 'vehicleId' })
  vehicle: VehicleEntity;

  @Column('date')
  startDate: Date;

  @Column('date')
  endDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  monthlyPaymentAmount: number;

  @Column()
  monthlyPaymentCurrency: string;

  @Column('decimal', { precision: 10, scale: 2 })
  securityDepositAmount: number;

  @Column()
  securityDepositCurrency: string;

  @Column({
    type: 'enum',
    enum: LeaseStatus,
    default: LeaseStatus.ACTIVE,
  })
  status: LeaseStatus;

  @Column('date', { nullable: true })
  terminationDate: Date | null;
} 