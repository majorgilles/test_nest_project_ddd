import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Lease } from '../../domain/aggregates/lease.aggregate';
import { CustomerRepository } from '../../domain/ports/customer-repository.port';
import { VehicleRepository } from '../../domain/ports/vehicle-repository.port';
import { LeaseRepository } from '../../domain/ports/lease-repository.port';
import { Money } from '../../domain/value-objects/money.value-object';

export class CreateLeaseDto {
  customerId: string;
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  securityDepositAmount: number;
  securityDepositCurrency?: string;
}

@Injectable()
export class CreateLeaseUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly vehicleRepository: VehicleRepository,
    private readonly leaseRepository: LeaseRepository,
  ) {}

  async execute(dto: CreateLeaseDto): Promise<string> {
    // Fetch customer and vehicle
    const customer = await this.customerRepository.findById(dto.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const vehicle = await this.vehicleRepository.findById(dto.vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Create security deposit
    const securityDeposit = new Money(
      dto.securityDepositAmount,
      dto.securityDepositCurrency || 'USD',
    );

    // Create lease
    const leaseId = uuidv4();
    const lease = new Lease(
      leaseId,
      customer,
      vehicle,
      new Date(dto.startDate),
      new Date(dto.endDate),
      vehicle.getMonthlyLeaseRate(),
      securityDeposit,
    );

    // Save lease
    await this.leaseRepository.save(lease);

    return leaseId;
  }
} 