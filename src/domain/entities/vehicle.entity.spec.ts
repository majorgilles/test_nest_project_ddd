import { Vehicle } from './vehicle.entity';
import { VehicleIdentificationNumber } from '../value-objects/vehicle-identification-number.value-object';
import { Money } from '../value-objects/money.value-object';

describe('Vehicle', () => {
  it('should create a valid Vehicle', () => {
    const vin = new VehicleIdentificationNumber('1HGCM82633A123456');
    const price = new Money(25000, 'USD');
    const vehicle = new Vehicle('1', vin, 'Toyota', 'Camry', 2023, price, true);
    
    expect(vehicle.getId()).toBe('1');
    expect(vehicle.getVin()).toBe(vin);
    expect(vehicle.getMake()).toBe('Toyota');
    expect(vehicle.getModel()).toBe('Camry');
    expect(vehicle.getYear()).toBe(2023);
    expect(vehicle.getPrice()).toBe(price);
    expect(vehicle.isAvailable()).toBe(true);
  });

  it('should mark vehicle as unavailable', () => {
    const vin = new VehicleIdentificationNumber('1HGCM82633A123456');
    const price = new Money(25000, 'USD');
    const vehicle = new Vehicle('1', vin, 'Toyota', 'Camry', 2023, price, true);
    
    vehicle.markAsUnavailable();
    expect(vehicle.isAvailable()).toBe(false);
  });

  it('should mark vehicle as available', () => {
    const vin = new VehicleIdentificationNumber('1HGCM82633A123456');
    const price = new Money(25000, 'USD');
    const vehicle = new Vehicle('1', vin, 'Toyota', 'Camry', 2023, price, false);
    
    vehicle.markAsAvailable();
    expect(vehicle.isAvailable()).toBe(true);
  });
}); 