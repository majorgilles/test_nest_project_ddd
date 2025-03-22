import { Injectable } from '@nestjs/common';
import { Vehicle, VehicleStatus } from '../../domain/entities/vehicle.entity';
import { VehicleEntity } from '../entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../../domain/value-objects/vehicle-identification-number.value-object';
import { Money } from '../../domain/value-objects/money.value-object';

@Injectable()
export class VehicleMapper {
  toPersistence(domainEntity: Vehicle): VehicleEntity {
    const entity = new VehicleEntity();
    entity.id = domainEntity.getId();
    entity.vin = domainEntity.getVin().getValue();
    entity.make = domainEntity.getMake();
    entity.model = domainEntity.getModel();
    entity.year = domainEntity.getYear();
    entity.monthlyLeaseRateAmount = domainEntity.getPrice().getAmount();
    entity.monthlyLeaseRateCurrency = domainEntity.getPrice().getCurrency();
    entity.status = domainEntity.getStatus();
    return entity;
  }

  toDomain(persistenceEntity: VehicleEntity): Vehicle {
    const vin = new VehicleIdentificationNumber(persistenceEntity.vin);
    const price = new Money(
      persistenceEntity.monthlyLeaseRateAmount,
      persistenceEntity.monthlyLeaseRateCurrency
    );
    
    return new Vehicle(
      persistenceEntity.id,
      vin,
      persistenceEntity.make,
      persistenceEntity.model,
      persistenceEntity.year,
      price,
      persistenceEntity.status
    );
  }
} 