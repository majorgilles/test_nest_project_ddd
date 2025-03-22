import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerRepository } from '../../domain/ports/customer-repository.port';
import { CustomerEntity } from '../database/entities/customer.entity';
import { CustomerMapper } from '../mappers/customer.mapper';

@Injectable()
export class TypeOrmCustomerRepository implements CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    private readonly customerMapper: CustomerMapper,
  ) {}

  async findById(id: string): Promise<Customer | null> {
    const customerEntity = await this.customerRepository.findOne({ where: { id } });
    if (!customerEntity) {
      return null;
    }
    return this.customerMapper.toDomain(customerEntity);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customerEntity = await this.customerRepository.findOne({ where: { email } });
    if (!customerEntity) {
      return null;
    }
    return this.customerMapper.toDomain(customerEntity);
  }

  async save(customer: Customer): Promise<void> {
    const customerEntity = this.customerMapper.toPersistence(customer);
    await this.customerRepository.save(customerEntity);
  }
} 