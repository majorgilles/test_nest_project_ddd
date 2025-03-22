export class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: string = 'USD',
  ) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    if (!currency) {
      throw new Error('Currency is required');
    }
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  add(money: Money): Money {
    if (this.currency !== money.getCurrency()) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + money.getAmount(), this.currency);
  }

  subtract(money: Money): Money {
    if (this.currency !== money.getCurrency()) {
      throw new Error('Cannot subtract money with different currencies');
    }
    const result = this.amount - money.getAmount();
    if (result < 0) {
      throw new Error('Result cannot be negative');
    }
    return new Money(result, this.currency);
  }

  equals(money: Money): boolean {
    return this.amount === money.getAmount() && this.currency === money.getCurrency();
  }
} 