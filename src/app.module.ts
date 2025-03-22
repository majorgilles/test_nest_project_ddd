import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { LeaseController } from './presentation/controllers/lease.controller';
import { VehicleController } from './presentation/controllers/vehicle.controller';
import { CustomerController } from './presentation/controllers/customer.controller';

// Use Cases
import { CreateLeaseUseCase } from './application/use-cases/create-lease.use-case';
import { TerminateLeaseUseCase } from './application/use-cases/terminate-lease.use-case';
import { FindAvailableVehiclesUseCase } from './application/use-cases/find-available-vehicles.use-case';
import { RegisterCustomerUseCase } from './application/use-cases/register-customer.use-case';
import { AddVehicleUseCase } from './application/use-cases/add-vehicle.use-case';

// Repositories
import { TypeOrmVehicleRepository } from './infrastructure/repositories/typeorm-vehicle.repository';
import { TypeOrmCustomerRepository } from './infrastructure/repositories/typeorm-customer.repository';
import { TypeOrmLeaseRepository } from './infrastructure/repositories/typeorm-lease.repository';

// Entities
import { VehicleEntity } from './infrastructure/database/entities/vehicle.entity';
import { CustomerEntity } from './infrastructure/database/entities/customer.entity';
import { LeaseEntity } from './infrastructure/database/entities/lease.entity';

// Mappers
import { VehicleMapper } from './infrastructure/mappers/vehicle.mapper';
import { CustomerMapper } from './infrastructure/mappers/customer.mapper';
import { LeaseMapper } from './infrastructure/mappers/lease.mapper';

// Ports (for DI tokens)
import { VehicleRepository } from './domain/ports/vehicle-repository.port';
import { CustomerRepository } from './domain/ports/customer-repository.port';
import { LeaseRepository } from './domain/ports/lease-repository.port';
import { CreditCheckService } from './domain/ports/credit-check-service.port';
import { PaymentGateway } from './domain/ports/payment-gateway.port';

// External service adapters
import { ExperianCreditCheckAdapter } from './infrastructure/adapters/experian-credit-check.adapter';
import { StripePaymentGatewayAdapter } from './infrastructure/adapters/stripe-payment-gateway.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [VehicleEntity, CustomerEntity, LeaseEntity],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    TypeOrmModule.forFeature([VehicleEntity, CustomerEntity, LeaseEntity]),
  ],
  controllers: [
    LeaseController,
    VehicleController,
    CustomerController,
  ],
  providers: [
    // Use Cases
    CreateLeaseUseCase,
    TerminateLeaseUseCase,
    FindAvailableVehiclesUseCase,
    RegisterCustomerUseCase,
    AddVehicleUseCase,
    
    // Mappers
    VehicleMapper,
    CustomerMapper,
    LeaseMapper,
    
    // Repository implementations
    {
      provide: VehicleRepository,
      useClass: TypeOrmVehicleRepository,
    },
    {
      provide: CustomerRepository,
      useClass: TypeOrmCustomerRepository,
    },
    {
      provide: LeaseRepository,
      useClass: TypeOrmLeaseRepository,
    },
    
    // External service adapters
    {
      provide: CreditCheckService,
      useClass: ExperianCreditCheckAdapter,
    },
    {
      provide: PaymentGateway,
      useClass: StripePaymentGatewayAdapter,
    },
  ],
})
export class AppModule {} 