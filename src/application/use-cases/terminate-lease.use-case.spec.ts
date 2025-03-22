import { Test } from '@nestjs/testing';
import { TerminateLeaseUseCase } from './terminate-lease.use-case';
import { LeaseRepository } from '../../domain/ports/lease-repository.port';
import { Lease } from '../../domain/aggregates/lease.aggregate';
import { Customer } from '../../domain/entities/customer.entity';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../../domain/value-objects/vehicle-identification-number.value-object';
import { Money } from '../../domain/value-objects/money.value-object';

describe('TerminateLeaseUseCase', () => {
  let terminateLeaseUseCase: TerminateLeaseUseCase;
  let leaseRepository: LeaseRepository;
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
    leaseRepository = moduleRef.get<LeaseRepository>(LeaseRepository);

    const customer = new Customer('1', 'John', 'Doe', 'john@example.com', '1234567890', true);
    const vin = new VehicleIdentificationNumber('1HGCM82633A123456');
    const price = new Money(25000, 'USD');
    const vehicle = new Vehicle('1', vin, 'Toyota', 'Camry', 2023, price, false);
    
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const monthlyPayment = new Money(500, 'USD');
    
    lease = new Lease('lease-1', customer, vehicle, startDate, endDate, monthlyPayment);
  });

  it('should terminate a lease', async () => {
    jest.spyOn(leaseRepository, 'findById').mockResolvedValue(lease);
    jest.spyOn(leaseRepository, 'save').mockResolvedValue(lease);

    await terminateLeaseUseCase.execute('lease-1');

    expect(leaseRepository.findById).toHaveBeenCalledWith('lease-1');
    expect(lease.isActive()).toBe(false);
    expect(leaseRepository.save).toHaveBeenCalledWith(lease);
  });

  it('should throw an error if lease is not found', async () => {
    jest.spyOn(leaseRepository, 'findById').mockResolvedValue(null);

    await expect(terminateLeaseUseCase.execute('non-existent-id')).rejects.toThrow('Lease not found');
  });
}); 