import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Wallet } from '../domain/wallet.entity';

export class CreateWalletDto {
  @IsNotEmpty()
  @IsString()
  owner: string;

  @IsNumber()
  @Min(0)
  initialBalance?: number = 0;
}

export class DepositDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class WithdrawDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class WalletResponseDto {
  id: string;
  owner: string;
  balance: number;
  createdAt: Date;

  constructor(id: string, owner: string, balance: number, createdAt: Date) {
    this.id = id;
    this.owner = owner;
    this.balance = balance;
    this.createdAt = createdAt;
  }

  static fromDomain(wallet: Wallet): WalletResponseDto {
    return new WalletResponseDto(
      wallet.getId(),
      wallet.getOwner(),
      wallet.getBalance(),
      wallet.getCreatedAt(),
    );
  }
}
