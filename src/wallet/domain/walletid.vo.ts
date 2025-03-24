import { InvalidWalletIdException } from './exceptions';

export class WalletId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim() === '') {
      throw new InvalidWalletIdException();
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(id: WalletId): boolean {
    return this.value === id.getValue();
  }

  toString(): string {
    return this.value;
  }
}
