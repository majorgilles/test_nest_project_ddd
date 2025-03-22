import { Test } from '@nestjs/testing';
import { RegisterCustomerUseCase } from '../../../src/application/use-cases/register-customer.use-case';
import { CustomerRepository } from '../../../src/domain/ports/customer-repository.port';
import { Customer } from '../../../src/domain/entities/customer.entity';

// Mock UUID generation to make tests deterministic
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('generated-uuid'),
}));

describe('RegisterCustomerUseCase', () => {
  let registerCustomerUseCase: RegisterCustomerUseCase;
  let customerRepository: jest.Mocked<CustomerRepository>;
  
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterCustomerUseCase,
        {
          provide: CustomerRepository,
          useValue: {
            findByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    registerCustomerUseCase = moduleRef.get<RegisterCustomerUseCase>(RegisterCustomerUseCase);
    customerRepository = moduleRef.get(CustomerRepository) as jest.Mocked<CustomerRepository>;
  });

  it('should register a customer successfully', async () => {
    // Arrange
    customerRepository.findByEmail.mockResolvedValue(null);
    
    const registerCustomerDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '555-123-4567',
      creditScore: 700,
    };

    // Act
    const result = await registerCustomerUseCase.execute(registerCustomerDto);

    // Assert
    expect(result).toBe('generated-uuid');
    expect(customerRepository.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
    expect(customerRepository.save).toHaveBeenCalled();
    
    const savedCustomer = customerRepository.save.mock.calls[0][0] as Customer;
    expect(savedCustomer.getId()).toBe('generated-uuid');
    expect(savedCustomer.getFirstName()).toBe('John');
    expect(savedCustomer.getLastName()).toBe('Doe');
    expect(savedCustomer.getEmail()).toBe('john.doe@example.com');
    expect(savedCustomer.getPhoneNumber()).toBe('555-123-4567');
    expect(savedCustomer.getCreditScore()).toBe(700);
  });

  it('should throw error when customer with email already exists', async () => {
    // Arrange
    const existingCustomer = new Customer(
      'existing-id',
      'Existing',
      'User',
      'john.doe@example.com',
      '555-987-6543',
      650
    );
    
    customerRepository.findByEmail.mockResolvedValue(existingCustomer);
    
    const registerCustomerDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '555-123-4567',
      creditScore: 700,
    };

    // Act & Assert
    await expect(registerCustomerUseCase.execute(registerCustomerDto))
      .rejects.toThrow('Customer with this email already exists');
    
    expect(customerRepository.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
    expect(customerRepository.save).not.toHaveBeenCalled();
  });
}); 