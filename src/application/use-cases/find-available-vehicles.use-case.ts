import { Injectable } from '@nestjs/common';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleRepository } from '../../domain/ports/vehicle-repository.port';

@Injectable()
export class FindAvailableVehiclesUseCase {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(): Promise<Vehicle[]> {
    return this.vehicleRepository.findAvailableVehicles();
  }
} 