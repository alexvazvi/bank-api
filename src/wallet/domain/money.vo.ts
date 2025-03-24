import {
  DifferentCurrencyException,
  InsufficientFundsException,
  NegativeAmountException,
} from './exceptions';

export class Money {
  private readonly amount: number;
  private readonly currency: string;

  constructor(amount: number, currency: string = 'EUR') {
    if (amount < 0) {
      throw new NegativeAmountException();
    }
    this.amount = amount;
    this.currency = currency;
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  add(money: Money): Money {
    if (this.currency !== money.currency) {
      throw new DifferentCurrencyException();
    }
    return new Money(this.amount + money.getAmount(), this.currency);
  }

  subtract(money: Money): Money {
    if (this.currency !== money.currency) {
      throw new DifferentCurrencyException();
    }
    const newAmount = this.amount - money.getAmount();
    if (newAmount < 0) {
      throw new InsufficientFundsException();
    }
    return new Money(newAmount, this.currency);
  }

  isGreaterThanOrEqual(money: Money): boolean {
    if (this.currency !== money.currency) {
      throw new DifferentCurrencyException();
    }
    return this.amount >= money.getAmount();
  }

  equals(money: Money): boolean {
    return (
      this.amount === money.getAmount() && this.currency === money.getCurrency()
    );
  }
}
