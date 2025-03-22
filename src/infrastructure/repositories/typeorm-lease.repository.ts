import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lease, LeaseStatus } from '../../domain/aggregates/lease.aggregate';
import { LeaseRepository } from '../../domain/ports/lease-repository.port';
import { LeaseEntity } from '../database/entities/lease.entity';
import { LeaseMapper } from '../mappers/lease.mapper';

@Injectable()
export class TypeOrmLeaseRepository implements LeaseRepository {
  constructor(
    @InjectRepository(LeaseEntity)
    private readonly leaseRepository: Repository<LeaseEntity>,
    private readonly leaseMapper: LeaseMapper,
  ) {}

  async findById(id: string): Promise<Lease | null> {
    const leaseEntity = await this.leaseRepository.findOne({
      where: { id },
      relations: ['customer', 'vehicle'],
    });
    if (!leaseEntity) {
      return null;
    }
    return this.leaseMapper.toDomain(leaseEntity);
  }

  async findByCustomerId(customerId: string): Promise<Lease[]> {
    const leaseEntities = await this.leaseRepository.find({
      where: { customerId },
      relations: ['customer', 'vehicle'],
    });
    return leaseEntities.map(entity => this.leaseMapper.toDomain(entity));
  }

  async findByVehicleId(vehicleId: string): Promise<Lease[]> {
    const leaseEntities = await this.leaseRepository.find({
      where: { vehicleId },
      relations: ['customer', 'vehicle'],
    });
    return leaseEntities.map(entity => this.leaseMapper.toDomain(entity));
  }

  async findActiveLeases(): Promise<Lease[]> {
    const leaseEntities = await this.leaseRepository.find({
      where: { status: LeaseStatus.ACTIVE },
      relations: ['customer', 'vehicle'],
    });
    return leaseEntities.map(entity => this.leaseMapper.toDomain(entity));
  }

  async save(lease: Lease): Promise<void> {
    const leaseEntity = this.leaseMapper.toPersistence(lease);
    await this.leaseRepository.save(leaseEntity);
  }
} 