import { Injectable } from '@nestjs/common';
import { Lease, LeaseStatus } from '../../domain/aggregates/lease.aggregate';
import { LeaseEntity } from '../database/entities/lease.entity';
import { CustomerMapper } from './customer.mapper';
import { VehicleMapper } from './vehicle.mapper';
import { Money } from '../../domain/value-objects/money.value-object';

@Injectable()
export class LeaseMapper {
  constructor(
    private readonly customerMapper: CustomerMapper,
    private readonly vehicleMapper: VehicleMapper,
  ) {}

  toDomain(entity: LeaseEntity): Lease {
    const customer = this.customerMapper.toDomain(entity.customer);
    const vehicle = this.vehicleMapper.toDomain(entity.vehicle);
    
    const monthlyPayment = new Money(
      entity.monthlyPaymentAmount,
      entity.monthlyPaymentCurrency,
    );
    
    const securityDeposit = new Money(
      entity.securityDepositAmount,
      entity.securityDepositCurrency,
    );

    return new Lease(
      entity.id,
      customer,
      vehicle,
      entity.startDate,
      entity.endDate,
      monthlyPayment,
      securityDeposit,
      entity.status,
    );
  }

  toPersistence(domain: Lease): LeaseEntity {
    const entity = new LeaseEntity();
    entity.id = domain.getId();
    entity.customerId = domain.getCustomer().getId();
    entity.vehicleId = domain.getVehicle().getId();
    entity.startDate = domain.getStartDate();
    entity.endDate = domain.getEndDate();
    entity.monthlyPaymentAmount = domain.getMonthlyPayment().getAmount();
    entity.monthlyPaymentCurrency = domain.getMonthlyPayment().getCurrency();
    entity.securityDepositAmount = domain.getSecurityDeposit().getAmount();
    entity.securityDepositCurrency = domain.getSecurityDeposit().getCurrency();
    entity.status = domain.getStatus();
    entity.terminationDate = domain.getTerminationDate() || null;
    return entity;
  }
} 