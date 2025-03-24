import {
  InsufficientFundsException,
  NegativeAmountException,
} from './exceptions';

export class Wallet {
  constructor(
    private readonly id: string,
    private balance: number,
    private readonly owner: string,
    private readonly createdAt: Date = new Date(),
  ) {
    this.validateBalance(balance);
  }

  private validateBalance(balance: number): void {
    if (balance < 0) {
      throw new NegativeAmountException();
    }
  }

  getId(): string {
    return this.id;
  }

  getBalance(): number {
    return this.balance;
  }

  getOwner(): string {
    return this.owner;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  deposit(amount: number): void {
    if (amount <= 0) {
      throw new NegativeAmountException();
    }
    this.balance += amount;
  }

  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new NegativeAmountException();
    }
    if (amount > this.balance) {
      throw new InsufficientFundsException();
    }
    this.balance -= amount;
  }
}
