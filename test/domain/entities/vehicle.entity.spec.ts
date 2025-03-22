import { Vehicle, VehicleStatus } from '../../../src/domain/entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../../../src/domain/value-objects/vehicle-identification-number.value-object';
import { Money } from '../../../src/domain/value-objects/money.value-object';

describe('Vehicle', () => {
  let vehicle: Vehicle;
  let vin: VehicleIdentificationNumber;
  let monthlyLeaseRate: Money;
  
  beforeEach(() => {
    vin = new VehicleIdentificationNumber('1HGCM82633A123456');
    monthlyLeaseRate = new Money(500, 'USD');
    
    vehicle = new Vehicle(
      'veh-123',
      vin,
      'Toyota',
      'Camry',
      2023,
      monthlyLeaseRate
    );
  });

  describe('getters', () => {
    it('should return vehicle id', () => {
      expect(vehicle.getId()).toBe('veh-123');
    });

    it('should return VIN', () => {
      expect(vehicle.getVin()).toBe(vin);
    });

    it('should return make', () => {
      expect(vehicle.getMake()).toBe('Toyota');
    });

    it('should return model', () => {
      expect(vehicle.getModel()).toBe('Camry');
    });

    it('should return year', () => {
      expect(vehicle.getYear()).toBe(2023);
    });

    it('should return monthly lease rate', () => {
      expect(vehicle.getMonthlyLeaseRate()).toBe(monthlyLeaseRate);
    });

    it('should return status as AVAILABLE by default', () => {
      expect(vehicle.getStatus()).toBe(VehicleStatus.AVAILABLE);
    });
  });

  describe('markAsLeased', () => {
    it('should change status to LEASED', () => {
      vehicle.markAsLeased();
      expect(vehicle.getStatus()).toBe(VehicleStatus.LEASED);
    });

    it('should throw error when vehicle is not available', () => {
      vehicle.markAsLeased();
      expect(() => vehicle.markAsLeased()).toThrow('Vehicle is not available for leasing');
      
      vehicle.markAsAvailable();
      vehicle.markAsInMaintenance();
      expect(() => vehicle.markAsLeased()).toThrow('Vehicle is not available for leasing');
    });
  });

  describe('markAsAvailable', () => {
    it('should change status to AVAILABLE', () => {
      vehicle.markAsLeased();
      vehicle.markAsAvailable();
      expect(vehicle.getStatus()).toBe(VehicleStatus.AVAILABLE);
      
      vehicle.markAsInMaintenance();
      vehicle.markAsAvailable();
      expect(vehicle.getStatus()).toBe(VehicleStatus.AVAILABLE);
    });
  });

  describe('markAsInMaintenance', () => {
    it('should change status to MAINTENANCE', () => {
      vehicle.markAsInMaintenance();
      expect(vehicle.getStatus()).toBe(VehicleStatus.MAINTENANCE);
      
      vehicle.markAsAvailable();
      vehicle.markAsInMaintenance();
      expect(vehicle.getStatus()).toBe(VehicleStatus.MAINTENANCE);
      
      vehicle.markAsLeased();
      vehicle.markAsInMaintenance();
      expect(vehicle.getStatus()).toBe(VehicleStatus.MAINTENANCE);
    });
  });
}); 