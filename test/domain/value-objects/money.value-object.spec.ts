import { Money } from '../../../src/domain/value-objects/money.value-object';

describe('Money', () => {
  describe('constructor', () => {
    it('should create a Money instance with amount and currency', () => {
      const money = new Money(100, 'USD');
      expect(money.getAmount()).toBe(100);
      expect(money.getCurrency()).toBe('USD');
    });

    it('should use USD as default currency', () => {
      const money = new Money(100);
      expect(money.getCurrency()).toBe('USD');
    });

    it('should throw error when amount is negative', () => {
      expect(() => new Money(-100)).toThrow('Money amount cannot be negative');
    });
  });

  describe('add', () => {
    it('should add two money objects with same currency', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'USD');
      const result = money1.add(money2);
      
      expect(result.getAmount()).toBe(150);
      expect(result.getCurrency()).toBe('USD');
    });

    it('should throw error when adding money with different currencies', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'EUR');
      
      expect(() => money1.add(money2)).toThrow('Cannot add money with different currencies');
    });
  });

  describe('subtract', () => {
    it('should subtract two money objects with same currency', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'USD');
      const result = money1.subtract(money2);
      
      expect(result.getAmount()).toBe(50);
      expect(result.getCurrency()).toBe('USD');
    });

    it('should throw error when subtracting money with different currencies', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'EUR');
      
      expect(() => money1.subtract(money2)).toThrow('Cannot subtract money with different currencies');
    });

    it('should throw error when result would be negative', () => {
      const money1 = new Money(50, 'USD');
      const money2 = new Money(100, 'USD');
      
      expect(() => money1.subtract(money2)).toThrow('Result cannot be negative');
    });
  });

  describe('equals', () => {
    it('should return true when money objects are equal', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(100, 'USD');
      
      expect(money1.equals(money2)).toBe(true);
    });

    it('should return false when amounts are different', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'USD');
      
      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false when currencies are different', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(100, 'EUR');
      
      expect(money1.equals(money2)).toBe(false);
    });
  });
}); 