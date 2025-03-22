import { Money } from './money.value-object';

describe('Money', () => {
  it('should create a valid Money object', () => {
    const money = new Money(100, 'USD');
    expect(money.getAmount()).toBe(100);
    expect(money.getCurrency()).toBe('USD');
  });

  it('should throw an error if amount is negative', () => {
    expect(() => new Money(-100, 'USD')).toThrow('Money amount cannot be negative');
  });

  it('should throw an error if currency is invalid', () => {
    expect(() => new Money(100, '')).toThrow('Currency is required');
  });
}); 