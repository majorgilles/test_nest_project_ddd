export class VehicleIdentificationNumber {
  constructor(private readonly value: string) {
    this.validate(value);
  }

  private validate(vin: string): void {
    if (!vin || vin.length !== 17) {
      throw new Error('VIN must be exactly 17 characters');
    }
    // Additional VIN validation logic could be added here
  }

  getValue(): string {
    return this.value;
  }

  equals(vin: VehicleIdentificationNumber): boolean {
    return this.value === vin.getValue();
  }
} 