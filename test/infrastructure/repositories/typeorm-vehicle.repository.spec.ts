import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmVehicleRepository } from '../../../src/infrastructure/repositories/typeorm-vehicle.repository';
import { VehicleEntity } from '../../../src/infrastructure/database/entities/vehicle.entity';
import { VehicleMapper } from '../../../src/infrastructure/mappers/vehicle.mapper';
import { Vehicle, VehicleStatus } from '../../../src/domain/entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../../../src/domain/value-objects/vehicle-identification-number.value-object';
import { Money } from '../../../src/domain/value-objects/money.value-object';

describe('TypeOrmVehicleRepository', () => {
  let vehicleRepository: TypeOrmVehicleRepository;
  let typeOrmRepository: jest.Mocked<Repository<VehicleEntity>>;
  let vehicleMapper: jest.Mocked<VehicleMapper>;
  
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TypeOrmVehicleRepository,
        {
          provide: getRepositoryToken(VehicleEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: VehicleMapper,
          useValue: {
            toDomain: jest.fn(),
            toPersistence: jest.fn(),
          },
        },
      ],
    }).compile();

    vehicleRepository = moduleRef.get<TypeOrmVehicleRepository>(TypeOrmVehicleRepository);
    typeOrmRepository = moduleRef.get(getRepositoryToken(VehicleEntity)) as jest.Mocked<Repository<VehicleEntity>>;
    vehicleMapper = moduleRef.get(VehicleMapper) as jest.Mocked<VehicleMapper>;
  });

  describe('findById', () => {
    it('should return vehicle when found', async () => {
      // Arrange
      const vehicleEntity = new VehicleEntity();
      vehicleEntity.id = 'veh-123';
      
      const vehicle = new Vehicle(
        'veh-123',
        new VehicleIdentificationNumber('1HGCM82633A123456'),
        'Toyota',
        'Camry',
        2023,
        new Money(500, 'USD')
      );
      
      typeOrmRepository.findOne.mockResolvedValue(vehicleEntity);
      vehicleMapper.toDomain.mockReturnValue(vehicle);

      // Act
      const result = await vehicleRepository.findById('veh-123');

      // Assert
      expect(result).toBe(vehicle);
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: 'veh-123' } });
      expect(vehicleMapper.toDomain).toHaveBeenCalledWith(vehicleEntity);
    });

    it('should return null when vehicle not found', async () => {
      // Arrange
      typeOrmRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await vehicleRepository.findById('non-existent');

      // Assert
      expect(result).toBeNull();
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: 'non-existent' } });
      expect(vehicleMapper.toDomain).not.toHaveBeenCalled();
    });
  });

  describe('findAvailableVehicles', () => {
    it('should return available vehicles', async () => {
      // Arrange
      const vehicleEntity1 = new VehicleEntity();
      vehicleEntity1.id = 'veh-123';
      
      const vehicleEntity2 = new VehicleEntity();
      vehicleEntity2.id = 'veh-456';
      
      const vehicle1 = new Vehicle(
        'veh-123',
        new VehicleIdentificationNumber('1HGCM82633A123456'),
        'Toyota',
        'Camry',
        2023,
        new Money(500, 'USD')
      );
      
      const vehicle2 = new Vehicle(
        'veh-456',
        new VehicleIdentificationNumber('2HGCM82633A123457'),
        'Honda',
        'Accord',
        2022,
        new Money(450, 'USD')
      );
      
      typeOrmRepository.find.mockResolvedValue([vehicleEntity1, vehicleEntity2]);
      vehicleMapper.toDomain.mockReturnValueOnce(vehicle1).mockReturnValueOnce(vehicle2);

      // Act
      const result = await vehicleRepository.findAvailableVehicles();

      // Assert
      expect(result).toEqual([vehicle1, vehicle2]);
      expect(typeOrmRepository.find).toHaveBeenCalledWith({ where: { status: VehicleStatus.AVAILABLE } });
      expect(vehicleMapper.toDomain).toHaveBeenCalledTimes(2);
    });
  });

  describe('save', () => {
    it('should save vehicle entity', async () => {
      // Arrange
      const vehicle = new Vehicle(
        'veh-123',
        new VehicleIdentificationNumber('1HGCM82633A123456'),
        'Toyota',
        'Camry',
        2023,
        new Money(500, 'USD')
      );
      
      const vehicleEntity = new VehicleEntity();
      vehicleEntity.id = 'veh-123';
      
      vehicleMapper.toPersistence.mockReturnValue(vehicleEntity);

      // Act
      await vehicleRepository.save(vehicle);

      // Assert
      expect(vehicleMapper.toPersistence).toHaveBeenCalledWith(vehicle);
      expect(typeOrmRepository.save).toHaveBeenCalledWith(vehicleEntity);
    });
  });
}); 