import { VehicleIdentificationNumber } from '../../../src/domain/value-objects/vehicle-identification-number.value-object';

describe('VehicleIdentificationNumber', () => {
  describe('constructor', () => {
    it('should create a VIN instance with valid value', () => {
      const vin = new VehicleIdentificationNumber('1HGCM82633A123456');
      expect(vin.getValue()).toBe('1HGCM82633A123456');
    });

    it('should throw error when VIN is empty', () => {
      expect(() => new VehicleIdentificationNumber('')).toThrow('VIN must be exactly 17 characters');
    });

    it('should throw error when VIN is not 17 characters', () => {
      expect(() => new VehicleIdentificationNumber('1HGCM82633A12345')).toThrow('VIN must be exactly 17 characters');
      expect(() => new VehicleIdentificationNumber('1HGCM82633A1234567')).toThrow('VIN must be exactly 17 characters');
    });
  });

  describe('equals', () => {
    it('should return true when VINs are equal', () => {
      const vin1 = new VehicleIdentificationNumber('1HGCM82633A123456');
      const vin2 = new VehicleIdentificationNumber('1HGCM82633A123456');
      
      expect(vin1.equals(vin2)).toBe(true);
    });

    it('should return false when VINs are different', () => {
      const vin1 = new VehicleIdentificationNumber('1HGCM82633A123456');
      const vin2 = new VehicleIdentificationNumber('2HGCM82633A123456');
      
      expect(vin1.equals(vin2)).toBe(false);
    });
  });
}); 