import { Test } from '@nestjs/testing';
import { TypeOrmVehicleRepository } from './typeorm-vehicle.repository';
import { VehicleEntity } from '../entities/vehicle.entity';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleMapper } from '../mappers/vehicle.mapper';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleIdentificationNumber } from '../../domain/value-objects/vehicle-identification-number.value-object';
import { Money } from '../../domain/value-objects/money.value-object';

describe('TypeOrmVehicleRepository', () => {
  let vehicleRepository: TypeOrmVehicleRepository;
  let typeOrmRepository: Repository<VehicleEntity>;
  let vehicleMapper: VehicleMapper;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TypeOrmVehicleRepository,
        VehicleMapper,
        {
          provide: getRepositoryToken(VehicleEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    vehicleRepository = moduleRef.get<TypeOrmVehicleRepository>(TypeOrmVehicleRepository);
    typeOrmRepository = moduleRef.get<Repository<VehicleEntity>>(getRepositoryToken(VehicleEntity));
    vehicleMapper = moduleRef.get<VehicleMapper>(VehicleMapper);
  });

  it('should find available vehicles', async () => {
    const vehicleEntities = [
      {
        id: '1',
        vin: '1HGCM82633A123456',
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        price: 25000,
        currency: 'USD',
        available: true,
      },
    ];

    jest.spyOn(typeOrmRepository, 'find').mockResolvedValue(vehicleEntities);
    
    const result = await vehicleRepository.findAvailable();
    
    expect(typeOrmRepository.find).toHaveBeenCalledWith({ where: { available: true } });
    expect(result.length).toBe(1);
    expect(result[0]).toBeInstanceOf(Vehicle);
  });

  it('should find a vehicle by id', async () => {
    const vehicleEntity = {
      id: '1',
      vin: '1HGCM82633A123456',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      price: 25000,
      currency: 'USD',
      available: true,
    };

    jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(vehicleEntity);
    
    const result = await vehicleRepository.findById('1');
    
    expect(typeOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toBeInstanceOf(Vehicle);
  });

  it('should save a vehicle', async () => {
    const vin = new VehicleIdentificationNumber('1HGCM82633A123456');
    const price = new Money(25000, 'USD');
    const vehicle = new Vehicle('1', vin, 'Toyota', 'Camry', 2023, price, true);
    
    const vehicleEntity = {
      id: '1',
      vin: '1HGCM82633A123456',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      price: 25000,
      currency: 'USD',
      available: true,
    };

    jest.spyOn(vehicleMapper, 'toPersistence').mockReturnValue(vehicleEntity as VehicleEntity);
    jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(vehicleEntity as VehicleEntity);
    jest.spyOn(vehicleMapper, 'toDomain').mockReturnValue(vehicle);
    
    const result = await vehicleRepository.save(vehicle);
    
    expect(vehicleMapper.toPersistence).toHaveBeenCalledWith(vehicle);
    expect(typeOrmRepository.save).toHaveBeenCalledWith(vehicleEntity);
    expect(vehicleMapper.toDomain).toHaveBeenCalledWith(vehicleEntity);
    expect(result).toBe(vehicle);
  });
}); 