import { VehicleIdentificationNumber } from '../value-objects/vehicle-identification-number.value-object';
import { Money } from '../value-objects/money.value-object';

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  LEASED = 'LEASED',
  MAINTENANCE = 'MAINTENANCE',
}

export class Vehicle {
  constructor(
    private readonly id: string,
    private readonly vin: VehicleIdentificationNumber,
    private readonly make: string,
    private readonly model: string,
    private readonly year: number,
    private readonly monthlyLeaseRate: Money,
    private status: VehicleStatus = VehicleStatus.AVAILABLE,
  ) {}

  getId(): string {
    return this.id;
  }

  getVin(): VehicleIdentificationNumber {
    return this.vin;
  }

  getMake(): string {
    return this.make;
  }

  getModel(): string {
    return this.model;
  }

  getYear(): number {
    return this.year;
  }

  getMonthlyLeaseRate(): Money {
    return this.monthlyLeaseRate;
  }

  getStatus(): VehicleStatus {
    return this.status;
  }

  markAsLeased(): void {
    if (this.status !== VehicleStatus.AVAILABLE) {
      throw new Error('Vehicle is not available for leasing');
    }
    this.status = VehicleStatus.LEASED;
  }

  markAsAvailable(): void {
    this.status = VehicleStatus.AVAILABLE;
  }

  markAsInMaintenance(): void {
    this.status = VehicleStatus.MAINTENANCE;
  }
} 