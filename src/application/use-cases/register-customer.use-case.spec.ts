import { Test } from '@nestjs/testing';
import { RegisterCustomerUseCase } from './register-customer.use-case';
import { CustomerRepository } from '../../domain/ports/customer-repository.port';
import { Customer } from '../../domain/entities/customer.entity';

describe('RegisterCustomerUseCase', () => {
  let registerCustomerUseCase: RegisterCustomerUseCase;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterCustomerUseCase,
        {
          provide: CustomerRepository,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    registerCustomerUseCase = moduleRef.get<RegisterCustomerUseCase>(RegisterCustomerUseCase);
    customerRepository = moduleRef.get<CustomerRepository>(CustomerRepository);
  });

  it('should register a new customer', async () => {
    const customerData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
    };

    const savedCustomer = new Customer(
      'generated-id',
      customerData.firstName,
      customerData.lastName,
      customerData.email,
      customerData.phoneNumber,
      true,
    );

    jest.spyOn(customerRepository, 'save').mockResolvedValue(savedCustomer);

    const result = await registerCustomerUseCase.execute(customerData);

    expect(customerRepository.save).toHaveBeenCalled();
    expect(result).toBe('generated-id');
  });
}); 