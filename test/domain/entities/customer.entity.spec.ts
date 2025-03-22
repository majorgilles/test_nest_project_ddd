import { Customer } from '../../../src/domain/entities/customer.entity';

describe('Customer', () => {
  let customer: Customer;
  
  beforeEach(() => {
    customer = new Customer(
      'cust-123',
      'John',
      'Doe',
      'john.doe@example.com',
      '555-123-4567',
      700
    );
  });

  describe('getters', () => {
    it('should return customer id', () => {
      expect(customer.getId()).toBe('cust-123');
    });

    it('should return full name', () => {
      expect(customer.getFullName()).toBe('John Doe');
    });

    it('should return first name', () => {
      expect(customer.getFirstName()).toBe('John');
    });

    it('should return last name', () => {
      expect(customer.getLastName()).toBe('Doe');
    });

    it('should return email', () => {
      expect(customer.getEmail()).toBe('john.doe@example.com');
    });

    it('should return phone number', () => {
      expect(customer.getPhoneNumber()).toBe('555-123-4567');
    });

    it('should return credit score', () => {
      expect(customer.getCreditScore()).toBe(700);
    });
  });

  describe('isEligibleForLeasing', () => {
    it('should return true when credit score is 650 or above', () => {
      const eligibleCustomer = new Customer(
        'cust-123',
        'John',
        'Doe',
        'john.doe@example.com',
        '555-123-4567',
        650
      );
      
      expect(eligibleCustomer.isEligibleForLeasing()).toBe(true);
    });

    it('should return false when credit score is below 650', () => {
      const ineligibleCustomer = new Customer(
        'cust-123',
        'John',
        'Doe',
        'john.doe@example.com',
        '555-123-4567',
        649
      );
      
      expect(ineligibleCustomer.isEligibleForLeasing()).toBe(false);
    });
  });
}); 