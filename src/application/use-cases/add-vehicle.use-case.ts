import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleRepository } from '../../domain/ports/vehicle-repository.port';
import { VehicleIdentificationNumber } from '../../domain/value-objects/vehicle-identification-number.value-object';
import { Money } from '../../domain/value-objects/money.value-object';

export class AddVehicleDto {
  vin: string;
  make: string;
  model: string;
  year: number;
  monthlyLeaseRateAmount: number;
  monthlyLeaseRateCurrency?: string;
}

@Injectable()
export class AddVehicleUseCase {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
  ) {}

  async execute(dto: AddVehicleDto): Promise<string> {
    // Create VIN value object
    const vin = new VehicleIdentificationNumber(dto.vin);

    // Check if vehicle with VIN already exists
    const existingVehicle = await this.vehicleRepository.findByVin(vin);
    if (existingVehicle) {
      throw new Error('Vehicle with this VIN already exists');
    }

    // Create monthly lease rate
    const monthlyLeaseRate = new Money(
      dto.monthlyLeaseRateAmount,
      dto.monthlyLeaseRateCurrency || 'USD',
    );

    // Create vehicle
    const vehicleId = uuidv4();
    const vehicle = new Vehicle(
      vehicleId,
      vin,
      dto.make,
      dto.model,
      dto.year,
      monthlyLeaseRate,
    );

    // Save vehicle
    await this.vehicleRepository.save(vehicle);

    return vehicleId;
  }
} 