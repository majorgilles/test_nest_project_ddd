import { Customer } from '../entities/customer.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Money } from '../value-objects/money.value-object';

export enum LeaseStatus {
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED',
  EXPIRED = 'EXPIRED',
}

export class Lease {
  private status: LeaseStatus;
  private terminationDate?: Date;

  constructor(
    private readonly id: string,
    private readonly customer: Customer,
    private readonly vehicle: Vehicle,
    private readonly startDate: Date,
    private readonly endDate: Date,
    private readonly monthlyPayment: Money,
    private readonly securityDeposit: Money,
    status?: LeaseStatus,
  ) {
    if (!customer.isEligibleForLeasing()) {
      throw new Error('Customer is not eligible for leasing');
    }

    if (startDate >= endDate) {
      throw new Error('Lease end date must be after start date');
    }

    this.status = status || LeaseStatus.ACTIVE;
    this.vehicle.markAsLeased();
  }

  getId(): string {
    return this.id;
  }

  getCustomer(): Customer {
    return this.customer;
  }

  getVehicle(): Vehicle {
    return this.vehicle;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getMonthlyPayment(): Money {
    return this.monthlyPayment;
  }

  getSecurityDeposit(): Money {
    return this.securityDeposit;
  }

  getStatus(): LeaseStatus {
    return this.status;
  }

  getTerminationDate(): Date | undefined {
    return this.terminationDate;
  }

  terminate(terminationDate: Date): void {
    if (this.status !== LeaseStatus.ACTIVE) {
      throw new Error('Only active leases can be terminated');
    }

    if (terminationDate < this.startDate) {
      throw new Error('Termination date cannot be before lease start date');
    }

    this.status = LeaseStatus.TERMINATED;
    this.terminationDate = terminationDate;
    this.vehicle.markAsAvailable();
  }

  expire(): void {
    if (this.status !== LeaseStatus.ACTIVE) {
      throw new Error('Only active leases can expire');
    }

    this.status = LeaseStatus.EXPIRED;
    this.vehicle.markAsAvailable();
  }

  calculateRemainingPayments(currentDate: Date): number {
    if (this.status !== LeaseStatus.ACTIVE) {
      return 0;
    }

    const endDate = this.terminationDate || this.endDate;
    const monthsRemaining = this.calculateMonthsBetween(currentDate, endDate);
    return Math.max(0, monthsRemaining);
  }

  private calculateMonthsBetween(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (end.getFullYear() - start.getFullYear()) * 12 + 
           (end.getMonth() - start.getMonth());
  }
} 