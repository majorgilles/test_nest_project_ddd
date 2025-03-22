import { Test } from '@nestjs/testing';
import { FindAvailableVehiclesUseCase } from '../../../src/application/use-cases/find-available-vehicles.use-case';
import { VehicleRepository } from '../../../src/domain/ports/vehicle-repository.port';
import { Vehicle, VehicleStatus } from '../../../src/domain/entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../../../src/domain/value-objects/vehicle-identification-number.value-object';
import { Money } from '../../../src/domain/value-objects/money.value-object';

describe('FindAvailableVehiclesUseCase', () => {
  let findAvailableVehiclesUseCase: FindAvailableVehiclesUseCase;
  let vehicleRepository: jest.Mocked<VehicleRepository>;
  
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindAvailableVehiclesUseCase,
        {
          provide: VehicleRepository,
          useValue: {
            findAvailableVehicles: jest.fn(),
          },
        },
      ],
    }).compile();

    findAvailableVehiclesUseCase = moduleRef.get<FindAvailableVehiclesUseCase>(FindAvailableVehiclesUseCase);
    vehicleRepository = moduleRef.get(VehicleRepository) as jest.Mocked<VehicleRepository>;
  });

  it('should return available vehicles', async () => {
    // Arrange
    const vin1 = new VehicleIdentificationNumber('1HGCM82633A123456');
    const vin2 = new VehicleIdentificationNumber('2HGCM82633A123457');
    
    const vehicle1 = new Vehicle(
      'veh-123',
      vin1,
      'Toyota',
      'Camry',
      2023,
      new Money(500, 'USD')
    );
    
    const vehicle2 = new Vehicle(
      'veh-456',
      vin2,
      'Honda',
      'Accord',
      2022,
      new Money(450, 'USD')
    );
    
    const availableVehicles = [vehicle1, vehicle2];
    vehicleRepository.findAvailableVehicles.mockResolvedValue(availableVehicles);

    // Act
    const result = await findAvailableVehiclesUseCase.execute();

    // Assert
    expect(result).toEqual(availableVehicles);
    expect(vehicleRepository.findAvailableVehicles).toHaveBeenCalled();
  });

  it('should return empty array when no vehicles are available', async () => {
    // Arrange
    vehicleRepository.findAvailableVehicles.mockResolvedValue([]);

    // Act
    const result = await findAvailableVehiclesUseCase.execute();

    // Assert
    expect(result).toEqual([]);
    expect(vehicleRepository.findAvailableVehicles).toHaveBeenCalled();
  });
}); 