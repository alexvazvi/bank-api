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
