import { Injectable } from '@nestjs/common';
import { Vehicle, VehicleStatus } from '../../domain/entities/vehicle.entity';
import { VehicleEntity } from '../database/entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../../domain/value-objects/vehicle-identification-number.value-object';
import { Money } from '../../domain/value-objects/money.value-object';

@Injectable()
export class VehicleMapper {
  toDomain(entity: VehicleEntity): Vehicle {
    const vin = new VehicleIdentificationNumber(entity.vin);
    const monthlyLeaseRate = new Money(
      entity.monthlyLeaseRateAmount,
      entity.monthlyLeaseRateCurrency,
    );

    return new Vehicle(
      entity.id,
      vin,
      entity.make,
      entity.model,
      entity.year,
      monthlyLeaseRate,
      entity.status,
    );
  }

  toPersistence(domain: Vehicle): VehicleEntity {
    const entity = new VehicleEntity();
    entity.id = domain.getId();
    entity.vin = domain.getVin().getValue();
    entity.make = domain.getMake();
    entity.model = domain.getModel();
    entity.year = domain.getYear();
    entity.monthlyLeaseRateAmount = domain.getMonthlyLeaseRate().getAmount();
    entity.monthlyLeaseRateCurrency = domain.getMonthlyLeaseRate().getCurrency();
    entity.status = domain.getStatus();
    return entity;
  }
} 