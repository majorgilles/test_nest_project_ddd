import { Test } from '@nestjs/testing';
import { AddVehicleUseCase } from '../../../src/application/use-cases/add-vehicle.use-case';
import { VehicleRepository } from '../../../src/domain/ports/vehicle-repository.port';
import { Vehicle } from '../../../src/domain/entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../../../src/domain/value-objects/vehicle-identification-number.value-object';

// Mock UUID generation to make tests deterministic
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('generated-uuid'),
}));

describe('AddVehicleUseCase', () => {
  let addVehicleUseCase: AddVehicleUseCase;
  let vehicleRepository: jest.Mocked<VehicleRepository>;
  
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AddVehicleUseCase,
        {
          provide: VehicleRepository,
          useValue: {
            findByVin: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    addVehicleUseCase = moduleRef.get<AddVehicleUseCase>(AddVehicleUseCase);
    vehicleRepository = moduleRef.get(VehicleRepository) as jest.Mocked<VehicleRepository>;
  });

  it('should add a vehicle successfully', async () => {
    // Arrange
    vehicleRepository.findByVin.mockResolvedValue(null);
    
    const addVehicleDto = {
      vin: '1HGCM82633A123456',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      monthlyLeaseRateAmount: 500,
      monthlyLeaseRateCurrency: 'USD',
    };

    // Act
    const result = await addVehicleUseCase.execute(addVehicleDto);

    // Assert
    expect(result).toBe('generated-uuid');
    expect(vehicleRepository.findByVin).toHaveBeenCalled();
    expect(vehicleRepository.save).toHaveBeenCalled();
    
    const savedVehicle = vehicleRepository.save.mock.calls[0][0] as Vehicle;
    expect(savedVehicle.getId()).toBe('generated-uuid');
    expect(savedVehicle.getVin().getValue()).toBe('1HGCM82633A123456');
    expect(savedVehicle.getMake()).toBe('Toyota');
    expect(savedVehicle.getModel()).toBe('Camry');
    expect(savedVehicle.getYear()).toBe(2023);
    expect(savedVehicle.getMonthlyLeaseRate().getAmount()).toBe(500);
    expect(savedVehicle.getMonthlyLeaseRate().getCurrency()).toBe('USD');
  });

  it('should throw error when vehicle with VIN already exists', async () => {
    // Arrange
    const vin = new VehicleIdentificationNumber('1HGCM82633A123456');
    const existingVehicle = new Vehicle(
      'existing-id',
      vin,
      'Honda',
      'Accord',
      2022,
      { getAmount: () => 450, getCurrency: () => 'USD' } as any
    );
    
    vehicleRepository.findByVin.mockResolvedValue(existingVehicle);
    
    const addVehicleDto = {
      vin: '1HGCM82633A123456',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      monthlyLeaseRateAmount: 500,
    };

    // Act & Assert
    await expect(addVehicleUseCase.execute(addVehicleDto))
      .rejects.toThrow('Vehicle with this VIN already exists');
    
    expect(vehicleRepository.findByVin).toHaveBeenCalled();
    expect(vehicleRepository.save).not.toHaveBeenCalled();
  });
}); 