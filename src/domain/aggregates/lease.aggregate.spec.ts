import { Lease, LeaseStatus } from './lease.aggregate';
import { Customer } from '../entities/customer.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { VehicleIdentificationNumber } from '../value-objects/vehicle-identification-number.value-object';
import { Money } from '../value-objects/money.value-object';

describe('Lease', () => {
  let customer: Customer;
  let vehicle: Vehicle;

  beforeEach(() => {
    customer = new Customer('1', 'John', 'Doe', 'john@example.com', '1234567890', 800);
    const vin = new VehicleIdentificationNumber('1HGCM82633A123456');
    const price = new Money(25000, 'USD');
    vehicle = new Vehicle('1', vin, 'Toyota', 'Camry', 2023, price, true);
  });

  it('should create a valid Lease', () => {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days later
    const monthlyPayment = new Money(500, 'USD');
    
    const lease = new Lease('1', customer, vehicle, startDate, endDate, monthlyPayment, new Money(700, 'USD'), LeaseStatus.ACTIVE);
    
    expect(lease.getId()).toBe('1');
    expect(lease.getCustomer()).toBe(customer);
    expect(lease.getVehicle()).toBe(vehicle);
    expect(lease.getStartDate()).toBe(startDate);
    expect(lease.getEndDate()).toBe(endDate);
    expect(lease.getMonthlyPayment()).toBe(monthlyPayment);
    expect(lease.getStatus()).toBe(LeaseStatus.ACTIVE);
    expect(vehicle.isAvailable()).toBe(false);
  });

  it('should terminate a lease', () => {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const monthlyPayment = new Money(500, 'USD');
    
    const lease = new Lease('1', customer, vehicle, startDate, endDate, monthlyPayment, new Money(700, 'USD'), LeaseStatus.ACTIVE);
    lease.terminate(new Date());
    
    expect(lease.getStatus()).toBe(LeaseStatus.TERMINATED);
    expect(vehicle.isAvailable()).toBe(true);
  });
}); 