import { InvalidOwnerIdException } from './exceptions';

export class OwnerId {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim() === '') {
      throw new InvalidOwnerIdException();
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(id: OwnerId): boolean {
    return this.value === id.getValue();
  }

  toString(): string {
    return this.value;
  }
}
