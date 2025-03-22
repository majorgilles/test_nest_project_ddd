import { VehicleIdentificationNumber } from '../value-objects/vehicle-identification-number.value-object';
import { Money } from '../value-objects/money.value-object';

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  MAINTENANCE = 'MAINTENANCE'
}

export class Vehicle {
  private id: string;
  private vin: VehicleIdentificationNumber;
  private make: string;
  private model: string;
  private year: number;
  private price: Money;
  private status: VehicleStatus;

  constructor(
    id: string,
    vin: VehicleIdentificationNumber,
    make: string,
    model: string,
    year: number,
    price: Money,
    statusOrAvailable: VehicleStatus | boolean = VehicleStatus.AVAILABLE
  ) {
    this.id = id;
    this.vin = vin;
    this.make = make;
    this.model = model;
    this.year = year;
    this.price = price;
    
    if (typeof statusOrAvailable === 'boolean') {
      this.status = statusOrAvailable ? VehicleStatus.AVAILABLE : VehicleStatus.UNAVAILABLE;
    } else {
      this.status = statusOrAvailable;
    }
  }

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

  getPrice(): Money {
    return this.price;
  }

  getStatus(): VehicleStatus {
    return this.status;
  }

  isAvailable(): boolean {
    return this.status === VehicleStatus.AVAILABLE;
  }

  markAsAvailable(): void {
    this.status = VehicleStatus.AVAILABLE;
  }

  markAsUnavailable(): void {
    this.status = VehicleStatus.UNAVAILABLE;
  }

  markAsInMaintenance(): void {
    this.status = VehicleStatus.MAINTENANCE;
  }
} 