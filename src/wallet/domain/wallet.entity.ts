import {
  InsufficientFundsException,
  NegativeAmountException,
} from './exceptions';
import { WalletId } from './walletid.vo';
import { Money } from './money.vo';
import { OwnerId } from './ownerid.vo';

export class Wallet {
  private readonly id: WalletId;
  private balance: Money;
  private readonly owner: OwnerId;
  private readonly createdAt: Date;
  constructor(
    id: WalletId,
    balance: Money,
    owner: OwnerId,
    createdAt: Date = new Date(),
  ) {
    this.id = id;
    this.balance = balance;
    this.owner = owner;
    this.createdAt = createdAt;
  }

  getId(): WalletId {
    return this.id;
  }

  getBalance(): Money {
    return this.balance;
  }

  getOwner(): OwnerId {
    return this.owner;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  deposit(amount: Money): void {
    if (amount.getAmount() <= 0) {
      throw new NegativeAmountException();
    }
    this.balance = this.balance.add(amount);
  }

  withdraw(amount: Money): void {
    if (amount.getAmount() <= 0) {
      throw new NegativeAmountException();
    }

    if (!this.balance.isGreaterThanOrEqual(amount)) {
      throw new InsufficientFundsException();
    }

    this.balance = this.balance.subtract(amount);
  }
}
