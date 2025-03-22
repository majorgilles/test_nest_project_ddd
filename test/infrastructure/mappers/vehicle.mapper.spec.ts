import { VehicleMapper } from '../../../src/infrastructure/mappers/vehicle.mapper';
import { Vehicle, VehicleStatus } from '../../../src/domain/entities/vehicle.entity';
import { VehicleEntity } from '../../../src/infrastructure/database/entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../../../src/domain/value-objects/vehicle-identification-number.value-object';
import { Money } from '../../../src/domain/value-objects/money.value-object';

describe('VehicleMapper', () => {
  let vehicleMapper: VehicleMapper;
  
  beforeEach(() => {
    vehicleMapper = new VehicleMapper();
  });

  describe('toDomain', () => {
    it('should map VehicleEntity to Vehicle domain object', () => {
      // Arrange
      const vehicleEntity = new VehicleEntity();
      vehicleEntity.id = 'veh-123';
      vehicleEntity.vin = '1HGCM82633A123456';
      vehicleEntity.make = 'Toyota';
      vehicleEntity.model = 'Camry';
      vehicleEntity.year = 2023;
      vehicleEntity.monthlyLeaseRateAmount = 500;
      vehicleEntity.monthlyLeaseRateCurrency = 'USD';
      vehicleEntity.status = VehicleStatus.AVAILABLE;

      // Act
      const vehicle = vehicleMapper.toDomain(vehicleEntity);

      // Assert
      expect(vehicle).toBeInstanceOf(Vehicle);
      expect(vehicle.getId()).toBe('veh-123');
      expect(vehicle.getVin()).toBeInstanceOf(VehicleIdentificationNumber);
      expect(vehicle.getVin().getValue()).toBe('1HGCM82633A123456');
      expect(vehicle.getMake()).toBe('Toyota');
      expect(vehicle.getModel()).toBe('Camry');
      expect(vehicle.getYear()).toBe(2023);
      expect(vehicle.getMonthlyLeaseRate()).toBeInstanceOf(Money);
      expect(vehicle.getMonthlyLeaseRate().getAmount()).toBe(500);
      expect(vehicle.getMonthlyLeaseRate().getCurrency()).toBe('USD');
      expect(vehicle.getStatus()).toBe(VehicleStatus.AVAILABLE);
    });
  });

  describe('toPersistence', () => {
    it('should map Vehicle domain object to VehicleEntity', () => {
      // Arrange
      const vin = new VehicleIdentificationNumber('1HGCM82633A123456');
      const monthlyLeaseRate = new Money(500, 'USD');
      
      const vehicle = new Vehicle(
        'veh-123',
        vin,
        'Toyota',
        'Camry',
        2023,
        monthlyLeaseRate,
        VehicleStatus.LEASED
      );

      // Act
      const vehicleEntity = vehicleMapper.toPersistence(vehicle);

      // Assert
      expect(vehicleEntity).toBeInstanceOf(VehicleEntity);
      expect(vehicleEntity.id).toBe('veh-123');
      expect(vehicleEntity.vin).toBe('1HGCM82633A123456');
      expect(vehicleEntity.make).toBe('Toyota');
      expect(vehicleEntity.model).toBe('Camry');
      expect(vehicleEntity.year).toBe(2023);
      expect(vehicleEntity.monthlyLeaseRateAmount).toBe(500);
      expect(vehicleEntity.monthlyLeaseRateCurrency).toBe('USD');
      expect(vehicleEntity.status).toBe(VehicleStatus.LEASED);
    });
  });
}); 