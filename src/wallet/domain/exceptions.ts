export class InsufficientFundsException extends Error {
  constructor() {
    super('Insufficient funds in wallet');
    this.name = 'InsufficientFundsException';
  }
}

export class NegativeAmountException extends Error {
  constructor() {
    super('Amount cannot be negative or zero');
    this.name = 'NegativeAmountException';
  }
}

export class WalletNotFoundException extends Error {
  constructor(id: string) {
    super(`Wallet with id ${id} not found`);
    this.name = 'WalletNotFoundException';
  }
}

export class DifferentCurrencyException extends Error {
  constructor() {
    super('Operations cannot be performed between different currencies');
    this.name = 'DifferentCurrencyException';
  }
}

export class InvalidWalletIdException extends Error {
  constructor() {
    super('Wallet ID cannot be empty or invalid');
    this.name = 'InvalidWalletIdException';
  }
}

export class InvalidOwnerIdException extends Error {
  constructor() {
    super('Owner ID cannot be empty or invalid');
    this.name = 'InvalidOwnerIdException';
  }
}
