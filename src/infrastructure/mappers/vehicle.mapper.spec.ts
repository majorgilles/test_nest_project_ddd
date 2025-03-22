import { VehicleMapper } from './vehicle.mapper';
import { Vehicle, VehicleStatus } from '../../domain/entities/vehicle.entity';
import { VehicleEntity } from '../entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../../domain/value-objects/vehicle-identification-number.value-object';
import { Money } from '../../domain/value-objects/money.value-object';

describe('VehicleMapper', () => {
  const mapper = new VehicleMapper();

  it('should map from domain to persistence', () => {
    const vin = new VehicleIdentificationNumber('1HGCM82633A123456');
    const price = new Money(25000, 'USD');
    const vehicle = new Vehicle('1', vin, 'Toyota', 'Camry', 2023, price, true);

    const entity = mapper.toPersistence(vehicle);

    expect(entity).toBeInstanceOf(VehicleEntity);
    expect(entity.id).toBe('1');
    expect(entity.vin).toBe('1HGCM82633A123456');
    expect(entity.make).toBe('Toyota');
    expect(entity.model).toBe('Camry');
    expect(entity.year).toBe(2023);
    expect(entity.monthlyLeaseRateAmount).toBe(25000);
    expect(entity.monthlyLeaseRateCurrency).toBe('USD');
    expect(entity.status).toBe(VehicleStatus.AVAILABLE);
  });

  it('should map from persistence to domain', () => {
    const entity = new VehicleEntity();
    entity.id = '1';
    entity.vin = '1HGCM82633A123456';
    entity.make = 'Toyota';
    entity.model = 'Camry';
    entity.year = 2023;
    entity.monthlyLeaseRateAmount = 25000;
    entity.monthlyLeaseRateCurrency = 'USD';
    entity.available = true;

    const vehicle = mapper.toDomain(entity);

    expect(vehicle).toBeInstanceOf(Vehicle);
    expect(vehicle.getId()).toBe('1');
    expect(vehicle.getVin().getValue()).toBe('1HGCM82633A123456');
    expect(vehicle.getMake()).toBe('Toyota');
    expect(vehicle.getModel()).toBe('Camry');
    expect(vehicle.getYear()).toBe(2023);
    expect(vehicle.getPrice().getAmount()).toBe(25000);
    expect(vehicle.getPrice().getCurrency()).toBe('USD');
    expect(vehicle.isAvailable()).toBe(true);
  });
}); 