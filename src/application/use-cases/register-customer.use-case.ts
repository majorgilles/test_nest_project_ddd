import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepository } from '../../domain/ports/customer-repository.port';

export class RegisterCustomerDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  creditScore: number;
}

@Injectable()
export class RegisterCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(dto: RegisterCustomerDto): Promise<string> {
    // Check if customer with email already exists
    const existingCustomer = await this.customerRepository.findByEmail(dto.email);
    if (existingCustomer) {
      throw new Error('Customer with this email already exists');
    }

    // Create new customer
    const customerId = uuidv4();
    const customer = new Customer(
      customerId,
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.phoneNumber,
      dto.creditScore,
    );

    // Save customer
    await this.customerRepository.save(customer);

    return customerId;
  }
} 