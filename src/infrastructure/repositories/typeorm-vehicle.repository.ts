import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../entities/vehicle.entity';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleRepository } from '../../domain/ports/vehicle-repository.port';
import { VehicleIdentificationNumber } from '../../domain/value-objects/vehicle-identification-number.value-object';
import { VehicleMapper } from '../mappers/vehicle.mapper';

@Injectable()
export class TypeOrmVehicleRepository implements VehicleRepository {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
    private readonly vehicleMapper: VehicleMapper,
  ) {}

  async findById(id: string): Promise<Vehicle | null> {
    const vehicleEntity = await this.vehicleRepository.findOne({ where: { id } });
    if (!vehicleEntity) {
      return null;
    }
    return this.vehicleMapper.toDomain(vehicleEntity);
  }

  async findByVin(vin: VehicleIdentificationNumber): Promise<Vehicle | null> {
    const vehicleEntity = await this.vehicleRepository.findOne({ 
      where: { vin: vin.getValue() } 
    });
    if (!vehicleEntity) {
      return null;
    }
    return this.vehicleMapper.toDomain(vehicleEntity);
  }

  async findAvailableVehicles(): Promise<Vehicle[]> {
    const vehicleEntities = await this.vehicleRepository.find({ 
      where: { status: VehicleStatus.AVAILABLE } 
    });
    return vehicleEntities.map(entity => this.vehicleMapper.toDomain(entity));
  }

  async save(vehicle: Vehicle): Promise<void> {
    const vehicleEntity = this.vehicleMapper.toPersistence(vehicle);
    await this.vehicleRepository.save(vehicleEntity);
  }
} 