import { Lease, LeaseStatus } from '../../../src/domain/aggregates/lease.aggregate';
import { Customer } from '../../../src/domain/entities/customer.entity';
import { Vehicle, VehicleStatus } from '../../../src/domain/entities/vehicle.entity';
import { Money } from '../../../src/domain/value-objects/money.value-object';
import { VehicleIdentificationNumber } from '../../../src/domain/value-objects/vehicle-identification-number.value-object';

describe('Lease', () => {
  let lease: Lease;
  let customer: Customer;
  let vehicle: Vehicle;
  let monthlyPayment: Money;
  let securityDeposit: Money;
  let startDate: Date;
  let endDate: Date;
  
  beforeEach(() => {
    customer = new Customer(
      'cust-123',
      'John',
      'Doe',
      'john.doe@example.com',
      '555-123-4567',
      700
    );
    
    const vin = new VehicleIdentificationNumber('1HGCM82633A123456');
    const leaseRate = new Money(500, 'USD');
    
    vehicle = new Vehicle(
      'veh-123',
      vin,
      'Toyota',
      'Camry',
      2023,
      leaseRate
    );
    
    monthlyPayment = new Money(500, 'USD');
    securityDeposit = new Money(1000, 'USD');
    
    startDate = new Date('2023-01-01');
    endDate = new Date('2024-01-01');
    
    lease = new Lease(
      'lease-123',
      customer,
      vehicle,
      startDate,
      endDate,
      monthlyPayment,
      securityDeposit
    );
  });

  describe('constructor', () => {
    it('should create a lease with ACTIVE status by default', () => {
      expect(lease.getStatus()).toBe(LeaseStatus.ACTIVE);
    });

    it('should mark vehicle as leased', () => {
      expect(vehicle.getStatus()).toBe(VehicleStatus.LEASED);
    });

    it('should throw error when customer is not eligible for leasing', () => {
      const ineligibleCustomer = new Customer(
        'cust-456',
        'Jane',
        'Doe',
        'jane.doe@example.com',
        '555-987-6543',
        600
      );
      
      expect(() => new Lease(
        'lease-456',
        ineligibleCustomer,
        vehicle,
        startDate,
        endDate,
        monthlyPayment,
        securityDeposit
      )).toThrow('Customer is not eligible for leasing');
    });

    it('should throw error when end date is before or equal to start date', () => {
      const sameDate = new Date('2023-01-01');
      expect(() => new Lease(
        'lease-456',
        customer,
        vehicle,
        sameDate,
        sameDate,
        monthlyPayment,
        securityDeposit
      )).toThrow('Lease end date must be after start date');
      
      const earlierDate = new Date('2022-12-31');
      expect(() => new Lease(
        'lease-456',
        customer,
        vehicle,
        sameDate,
        earlierDate,
        monthlyPayment,
        securityDeposit
      )).toThrow('Lease end date must be after start date');
    });
  });

  describe('getters', () => {
    it('should return lease id', () => {
      expect(lease.getId()).toBe('lease-123');
    });

    it('should return customer', () => {
      expect(lease.getCustomer()).toBe(customer);
    });

    it('should return vehicle', () => {
      expect(lease.getVehicle()).toBe(vehicle);
    });

    it('should return start date', () => {
      expect(lease.getStartDate()).toBe(startDate);
    });

    it('should return end date', () => {
      expect(lease.getEndDate()).toBe(endDate);
    });

    it('should return monthly payment', () => {
      expect(lease.getMonthlyPayment()).toBe(monthlyPayment);
    });

    it('should return security deposit', () => {
      expect(lease.getSecurityDeposit()).toBe(securityDeposit);
    });

    it('should return null for termination date when not terminated', () => {
      expect(lease.getTerminationDate()).toBeNull();
    });
  });

  describe('terminate', () => {
    it('should change status to TERMINATED', () => {
      const terminationDate = new Date('2023-06-01');
      lease.terminate(terminationDate);
      
      expect(lease.getStatus()).toBe(LeaseStatus.TERMINATED);
      expect(lease.getTerminationDate()).toBe(terminationDate);
    });

    it('should mark vehicle as available', () => {
      lease.terminate(new Date('2023-06-01'));
      expect(vehicle.getStatus()).toBe(VehicleStatus.AVAILABLE);
    });

    it('should throw error when lease is not active', () => {
      lease.terminate(new Date('2023-06-01'));
      
      expect(() => lease.terminate(new Date('2023-07-01')))
        .toThrow('Only active leases can be terminated');
    });

    it('should throw error when termination date is before start date', () => {
      const invalidDate = new Date('2022-12-31');
      
      expect(() => lease.terminate(invalidDate))
        .toThrow('Termination date cannot be before lease start date');
    });
  });

  describe('expire', () => {
    it('should change status to EXPIRED', () => {
      lease.expire();
      
      expect(lease.getStatus()).toBe(LeaseStatus.EXPIRED);
    });

    it('should mark vehicle as available', () => {
      lease.expire();
      expect(vehicle.getStatus()).toBe(VehicleStatus.AVAILABLE);
    });

    it('should throw error when lease is not active', () => {
      lease.expire();
      
      expect(() => lease.expire())
        .toThrow('Only active leases can expire');
    });
  });

  describe('calculateRemainingPayments', () => {
    it('should calculate remaining months correctly', () => {
      const currentDate = new Date('2023-06-15');
      // From June 15 to Jan 1 = 6 months (Jul, Aug, Sep, Oct, Nov, Dec)
      expect(lease.calculateRemainingPayments(currentDate)).toBe(6);
    });

    it('should return 0 when lease is not active', () => {
      lease.terminate(new Date('2023-06-01'));
      
      const currentDate = new Date('2023-06-15');
      expect(lease.calculateRemainingPayments(currentDate)).toBe(0);
    });

    it('should return 0 when current date is after end date', () => {
      const currentDate = new Date('2024-02-01');
      expect(lease.calculateRemainingPayments(currentDate)).toBe(0);
    });

    it('should use termination date instead of end date when terminated', () => {
      const terminationDate = new Date('2023-06-01');
      lease.terminate(terminationDate);
      
      const currentDate = new Date('2023-05-15');
      // From May 15 to June 1 = 0 months (less than a month)
      expect(lease.calculateRemainingPayments(currentDate)).toBe(0);
    });
  });
}); 