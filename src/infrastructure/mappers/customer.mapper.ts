import { Injectable } from '@nestjs/common';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerEntity } from '../database/entities/customer.entity';

@Injectable()
export class CustomerMapper {
  toDomain(entity: CustomerEntity): Customer {
    return new Customer(
      entity.id,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.phoneNumber,
      entity.creditScore,
    );
  }

  toPersistence(domain: Customer): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = domain.getId();
    entity.firstName = domain.getFirstName();
    entity.lastName = domain.getLastName();
    entity.email = domain.getEmail();
    entity.phoneNumber = domain.getPhoneNumber();
    entity.creditScore = domain.getCreditScore();
    return entity;
  }
} 