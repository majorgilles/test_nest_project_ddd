import { Vehicle } from '../entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../value-objects/vehicle-identification-number.value-object';

export interface VehicleRepository {
  findById(id: string): Promise<Vehicle | null>;
  findByVin(vin: VehicleIdentificationNumber): Promise<Vehicle | null>;
  findAvailableVehicles(): Promise<Vehicle[]>;
  save(vehicle: Vehicle): Promise<void>;
} 