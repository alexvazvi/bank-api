import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Wallet } from '../domain/wallet.entity';
import { WalletRepositoryPort } from './ports/wallet.repository.port';
import {
  WalletNotFoundException,
  InsufficientFundsException,
  NegativeAmountException,
} from '../domain/exceptions';
import { WalletId } from '../domain/walletid.vo';
import { Money } from '../domain/money.vo';
import { OwnerId } from '../domain/ownerid.vo';

@Injectable()
export class WalletService {
  constructor(
    @Inject('WalletRepositoryPort')
    private readonly walletRepository: WalletRepositoryPort,
  ) {}

  async createWallet(
    owner: string,
    initialBalance: number = 0,
  ): Promise<Wallet> {
    try {
      const wallet = new Wallet(
        new WalletId(uuidv4()),
        new Money(initialBalance),
        new OwnerId(owner),
      );
      await this.walletRepository.save(wallet);
      return wallet;
    } catch (error) {
      if (error instanceof NegativeAmountException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new Error(`Error creating wallet: ${error.message}`);
      } else {
        throw new Error('Error creating wallet');
      }
    }
  }

  async getWalletById(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findById(id);
    if (!wallet) {
      throw new WalletNotFoundException(id);
    }
    return wallet;
  }

  async getAllWallets(): Promise<Wallet[]> {
    return this.walletRepository.findAll();
  }

  async deposit(walletId: string, amount: number): Promise<Wallet> {
    try {
      const wallet = await this.getWalletById(walletId);
      wallet.deposit(new Money(amount));
      await this.walletRepository.save(wallet);
      return wallet;
    } catch (error) {
      if (
        error instanceof WalletNotFoundException ||
        error instanceof NegativeAmountException
      ) {
        throw error;
      }
      if (error instanceof Error) {
        throw new Error(`Error depositing to wallet: ${error.message}`);
      } else {
        throw new Error('Error depositing to wallet');
      }
    }
  }

  async withdraw(walletId: string, amount: number): Promise<Wallet> {
    try {
      const wallet = await this.getWalletById(walletId);
      wallet.deposit(new Money(amount));
      await this.walletRepository.save(wallet);
      return wallet;
    } catch (error) {
      if (
        error instanceof WalletNotFoundException ||
        error instanceof NegativeAmountException ||
        error instanceof InsufficientFundsException
      ) {
        throw error;
      }
      if (error instanceof Error) {
        throw new Error(`Error withdrawing from wallet: ${error.message}`);
      } else {
        throw new Error('Error withdrawing from wallet');
      }
    }
  }
}
