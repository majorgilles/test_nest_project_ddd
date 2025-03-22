import { Test } from '@nestjs/testing';
import { TerminateLeaseUseCase } from '../../../src/application/use-cases/terminate-lease.use-case';
import { LeaseRepository } from '../../../src/domain/ports/lease-repository.port';
import { Lease, LeaseStatus } from '../../../src/domain/aggregates/lease.aggregate';
import { Customer } from '../../../src/domain/entities/customer.entity';
import { Vehicle, VehicleStatus } from '../../../src/domain/entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../../../src/domain/value-objects/vehicle-identification-number.value-object';
import { Money } from '../../../src/domain/value-objects/money.value-object';

describe('TerminateLeaseUseCase', () => {
  let terminateLeaseUseCase: TerminateLeaseUseCase;
  let leaseRepository: jest.Mocked<LeaseRepository>;
  let lease: Lease;
  
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TerminateLeaseUseCase,
        {
          provide: LeaseRepository,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    terminateLeaseUseCase = moduleRef.get<TerminateLeaseUseCase>(TerminateLeaseUseCase);
    leaseRepository = moduleRef.get(LeaseRepository) as jest.Mocked<LeaseRepository>;
    
    // Create a test lease
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
    
    const monthlyPayment = new Money(500, 'USD');
    const securityDeposit = new Money(1000, 'USD');
    
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2024-01-01');
    
    lease = new Lease(
      'lease-123',
      customer,
      vehicle,
      startDate,
      endDate,
      monthlyPayment,
      securityDeposit
    );
  });

  it('should terminate a lease successfully', async () => {
    // Arrange
    leaseRepository.findById.mockResolvedValue(lease);
    
    const terminateLeaseDto = {
      leaseId: 'lease-123',
      terminationDate: new Date('2023-06-01'),
      reason: 'Customer request',
    };

    // Act
    await terminateLeaseUseCase.execute(terminateLeaseDto);

    // Assert
    expect(leaseRepository.findById).toHaveBeenCalledWith('lease-123');
    expect(leaseRepository.save).toHaveBeenCalled();
    
    const savedLease = leaseRepository.save.mock.calls[0][0] as Lease;
    expect(savedLease.getStatus()).toBe(LeaseStatus.TERMINATED);
    expect(savedLease.getTerminationDate()).toEqual(new Date('2023-06-01'));
    expect(savedLease.getVehicle().getStatus()).toBe(VehicleStatus.AVAILABLE);
  });

  it('should throw error when lease is not found', async () => {
    // Arrange
    leaseRepository.findById.mockResolvedValue(null);
    
    const terminateLeaseDto = {
      leaseId: 'non-existent',
      terminationDate: new Date('2023-06-01'),
      reason: 'Customer request',
    };

    // Act & Assert
    await expect(terminateLeaseUseCase.execute(terminateLeaseDto))
      .rejects.toThrow('Lease not found');
    
    expect(leaseRepository.findById).toHaveBeenCalledWith('non-existent');
    expect(leaseRepository.save).not.toHaveBeenCalled();
  });
}); 