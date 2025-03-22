import { Customer } from './customer.entity';

describe('Customer', () => {
  it('should create a valid Customer', () => {
    const customer = new Customer('1', 'John', 'Doe', 'john@example.com', '1234567890', 123);
    
    expect(customer.getId()).toBe('1');
    expect(customer.getFirstName()).toBe('John');
    expect(customer.getLastName()).toBe('Doe');
    expect(customer.getEmail()).toBe('john@example.com');
    expect(customer.getPhoneNumber()).toBe('1234567890');
    expect(customer.isEligibleForLeasing()).toBe(true);
  });

  it('should update customer eligibility', () => {
    const customer = new Customer('1', 'John', 'Doe', 'john@example.com', '1234567890', 123);
    
    customer.updateEligibility(false);
    expect(customer.isEligibleForLeasing()).toBe(false);
  });
}); 