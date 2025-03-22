import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterCustomerUseCase } from '../../application/use-cases/register-customer.use-case';
import { RegisterCustomerDto } from '../dtos/register-customer.dto';
import { CustomerResponseDto } from '../dtos/customer-response.dto';
import { CustomerRepository } from '../../domain/ports/customer-repository.port';

@Controller('customers')
export class CustomerController {
  constructor(
    private readonly registerCustomerUseCase: RegisterCustomerUseCase,
    private readonly customerRepository: CustomerRepository,
  ) {}

  @Post()
  async registerCustomer(@Body() registerCustomerDto: RegisterCustomerDto): Promise<{ customerId: string }> {
    const customerId = await this.registerCustomerUseCase.execute(registerCustomerDto);
    return { customerId };
  }

  @Get(':id')
  async getCustomer(@Param('id') id: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return {
      id: customer.getId(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      email: customer.getEmail(),
      phoneNumber: customer.getPhoneNumber(),
      isEligibleForLeasing: customer.isEligibleForLeasing(),
    };
  }
} 