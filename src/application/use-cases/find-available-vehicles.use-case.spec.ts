import { Test } from '@nestjs/testing';
import { FindAvailableVehiclesUseCase } from './find-available-vehicles.use-case';
import { VehicleRepository } from '../../domain/ports/vehicle-repository.port';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../../domain/value-objects/vehicle-identification-number.value-object';
import { Money } from '../../domain/value-objects/money.value-object';

describe('FindAvailableVehiclesUseCase', () => {
  let findAvailableVehiclesUseCase: FindAvailableVehiclesUseCase;
  let vehicleRepository: VehicleRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        FindAvailableVehiclesUseCase,
        {
          provide: VehicleRepository,
          useValue: {
            findAvailable: jest.fn(),
          },
        },
      ],
    }).compile();

    findAvailableVehiclesUseCase = moduleRef.get<FindAvailableVehiclesUseCase>(FindAvailableVehiclesUseCase);
    vehicleRepository = moduleRef.get<VehicleRepository>(VehicleRepository);
  });

  it('should find all available vehicles', async () => {
    const vin1 = new VehicleIdentificationNumber('1HGCM82633A123456');
    const price1 = new Money(25000, 'USD');
    const vehicle1 = new Vehicle('1', vin1, 'Toyota', 'Camry', 2023, price1, true);

    const vin2 = new VehicleIdentificationNumber('5YJSA1E11GF123456');
    const price2 = new Money(35000, 'USD');
    const vehicle2 = new Vehicle('2', vin2, 'Honda', 'Accord', 2022, price2, true);

    const availableVehicles = [vehicle1, vehicle2];
    
    jest.spyOn(vehicleRepository, 'findAvailable').mockResolvedValue(availableVehicles);

    const result = await findAvailableVehiclesUseCase.execute();

    expect(vehicleRepository.findAvailable).toHaveBeenCalled();
    expect(result).toEqual(availableVehicles);
    expect(result.length).toBe(2);
  });

  it('should return empty array when no vehicles are available', async () => {
    jest.spyOn(vehicleRepository, 'findAvailable').mockResolvedValue([]);

    const result = await findAvailableVehiclesUseCase.execute();

    expect(vehicleRepository.findAvailable).toHaveBeenCalled();
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
}); 