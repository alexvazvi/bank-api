import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Wallet } from '../domain/wallet.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({
    description: 'Identificador del propietario de la wallet',
    example: 'owner-123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  owner: string;

  @ApiProperty({
    description: 'Saldo inicial de la wallet',
    example: 100,
    default: 0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  initialBalance?: number = 0;
}

export class DepositDto {
  @ApiProperty({
    description: 'Cantidad a depositar en la wallet',
    example: 50,
    minimum: 0.01,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class WithdrawDto {
  @ApiProperty({
    description: 'Cantidad a retirar de la wallet',
    example: 25,
    minimum: 0.01,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}

export class WalletResponseDto {
  @ApiProperty({
    description: 'Identificador único de la wallet',
    example: 'wallet-123',
  })
  id: string;

  @ApiProperty({
    description: 'Identificador del propietario de la wallet',
    example: 'owner-123',
  })
  owner: string;

  @ApiProperty({
    description: 'Saldo actual de la wallet',
    example: 150,
  })
  balance: number;

  @ApiProperty({
    description: 'Fecha de creación de la wallet',
    example: '2025-03-25T08:00:00.000Z',
  })
  createdAt: Date;

  constructor(id: string, owner: string, balance: number, createdAt: Date) {
    this.id = id;
    this.owner = owner;
    this.balance = balance;
    this.createdAt = createdAt;
  }

  static fromDomain(wallet: Wallet): WalletResponseDto {
    return new WalletResponseDto(
      wallet.getId().getValue(),
      wallet.getOwner().getValue(),
      wallet.getBalance().getAmount(),
      wallet.getCreatedAt(),
    );
  }
}
