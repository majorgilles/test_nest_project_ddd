import { VehicleIdentificationNumber } from './vehicle-identification-number.value-object';

describe('VehicleIdentificationNumber', () => {
  it('should create a valid VIN', () => {
    const vin = new VehicleIdentificationNumber('1HGCM82633A123456');
    expect(vin.getValue()).toBe('1HGCM82633A123456');
  });

  it('should throw an error if VIN is invalid', () => {
    expect(() => new VehicleIdentificationNumber('')).toThrow('VIN is required');
    expect(() => new VehicleIdentificationNumber('123')).toThrow('VIN must be exactly 17 characters');
  });
}); 