import { Test } from '@nestjs/testing';
import { CreateLeaseUseCase } from '../../../src/application/use-cases/create-lease.use-case';
import { CustomerRepository } from '../../../src/domain/ports/customer-repository.port';
import { VehicleRepository } from '../../../src/domain/ports/vehicle-repository.port';
import { LeaseRepository } from '../../../src/domain/ports/lease-repository.port';
import { Customer } from '../../../src/domain/entities/customer.entity';
import { Vehicle } from '../../../src/domain/entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../../../src/domain/value-objects/vehicle-identification-number.value-object';
import { Money } from '../../../src/domain/value-objects/money.value-object';
import { Lease } from '../../../src/domain/aggregates/lease.aggregate';

// Mock UUID generation to make tests deterministic
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('generated-uuid'),
}));

describe('CreateLeaseUseCase', () => {
  let createLeaseUseCase: CreateLeaseUseCase;
  let customerRepository: jest.Mocked<CustomerRepository>;
  let vehicleRepository: jest.Mocked<VehicleRepository>;
  let leaseRepository: jest.Mocked<LeaseRepository>;
  
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateLeaseUseCase,
        {
          provide: CustomerRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: VehicleRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: LeaseRepository,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    createLeaseUseCase = moduleRef.get<CreateLeaseUseCase>(CreateLeaseUseCase);
    customerRepository = moduleRef.get(CustomerRepository) as jest.Mocked<CustomerRepository>;
    vehicleRepository = moduleRef.get(VehicleRepository) as jest.Mocked<VehicleRepository>;
    leaseRepository = moduleRef.get(LeaseRepository) as jest.Mocked<LeaseRepository>;
  });

  it('should create a lease successfully', async () => {
    // Arrange
    const customer = new Customer(
      'cust-123',
      'John',
      'Doe',
      'john.doe@example.com',
      '555-123-4567',
      700
    );
    
    const vin = new VehicleIdentificationNumber('1HGCM82633A123456');
    const leaseRate = new Money(500, 'USD');
    
    const vehicle = new Vehicle(
      'veh-123',
      vin,
      'Toyota',
      'Camry',
      2023,
      leaseRate
    );
    
    customerRepository.findById.mockResolvedValue(customer);
    vehicleRepository.findById.mockResolvedValue(vehicle);
    
    const createLeaseDto = {
      customerId: 'cust-123',
      vehicleId: 'veh-123',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-01-01'),
      securityDepositAmount: 1000,
      securityDepositCurrency: 'USD',
    };

    // Act
    const result = await createLeaseUseCase.execute(createLeaseDto);

    // Assert
    expect(result).toBe('generated-uuid');
    expect(customerRepository.findById).toHaveBeenCalledWith('cust-123');
    expect(vehicleRepository.findById).toHaveBeenCalledWith('veh-123');
    expect(leaseRepository.save).toHaveBeenCalled();
    
    const savedLease = leaseRepository.save.mock.calls[0][0] as Lease;
    expect(savedLease.getId()).toBe('generated-uuid');
    expect(savedLease.getCustomer()).toBe(customer);
    expect(savedLease.getVehicle()).toBe(vehicle);
    expect(savedLease.getStartDate()).toEqual(new Date('2023-01-01'));
    expect(savedLease.getEndDate()).toEqual(new Date('2024-01-01'));
    expect(savedLease.getMonthlyPayment().getAmount()).toBe(500);
    expect(savedLease.getSecurityDeposit().getAmount()).toBe(1000);
  });

  it('should throw error when customer is not found', async () => {
    // Arrange
    customerRepository.findById.mockResolvedValue(null);
    
    const createLeaseDto = {
      customerId: 'non-existent',
      vehicleId: 'veh-123',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-01-01'),
      securityDepositAmount: 1000,
    };

    // Act & Assert
    await expect(createLeaseUseCase.execute(createLeaseDto))
      .rejects.toThrow('Customer not found');
    
    expect(customerRepository.findById).toHaveBeenCalledWith('non-existent');
    expect(vehicleRepository.findById).not.toHaveBeenCalled();
    expect(leaseRepository.save).not.toHaveBeenCalled();
  });

  it('should throw error when vehicle is not found', async () => {
    // Arrange
    const customer = new Customer(
      'cust-123',
      'John',
      'Doe',
      'john.doe@example.com',
      '555-123-4567',
      700
    );
    
    customerRepository.findById.mockResolvedValue(customer);
    vehicleRepository.findById.mockResolvedValue(null);
    
    const createLeaseDto = {
      customerId: 'cust-123',
      vehicleId: 'non-existent',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-01-01'),
      securityDepositAmount: 1000,
    };

    // Act & Assert
    await expect(createLeaseUseCase.execute(createLeaseDto))
      .rejects.toThrow('Vehicle not found');
    
    expect(customerRepository.findById).toHaveBeenCalledWith('cust-123');
    expect(vehicleRepository.findById).toHaveBeenCalledWith('non-existent');
    expect(leaseRepository.save).not.toHaveBeenCalled();
  });
}); 