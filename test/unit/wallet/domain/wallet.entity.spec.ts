import { Money } from '../../../../src/wallet/domain/money.vo';
import { Wallet } from '../../../../src/wallet/domain/wallet.entity';
import { WalletId } from '../../../../src/wallet/domain/walletid.vo';
import { OwnerId } from '../../../../src/wallet/domain/ownerid.vo';
import {
  InsufficientFundsException,
  NegativeAmountException,
} from '../../../../src/wallet/domain/exceptions';

describe('Wallet Entity', () => {
  let wallet: Wallet;

  beforeEach(() => {
    const walletId = new WalletId('wallet-123');
    const ownerId = new OwnerId('owner-123');
    const balance = new Money(100);

    wallet = new Wallet(walletId, balance, ownerId);
  });

  it('should create a wallet instance', () => {
    expect(wallet).toBeDefined();
    expect(wallet.getId()).toBeDefined();
    expect(wallet.getOwner()).toBeDefined();
    expect(wallet.getBalance()).toBeDefined();
  });

  it('should deposit money correctly', () => {
    const initialBalance = wallet.getBalance().getAmount();
    const depositAmount = new Money(50);

    wallet.deposit(depositAmount);

    expect(wallet.getBalance().getAmount()).toBe(
      initialBalance + depositAmount.getAmount(),
    );
  });

  it('should throw error when depositing negative amount', () => {
    const negativeAmount = new Money(0);

    expect(() => {
      wallet.deposit(negativeAmount);
    }).toThrow(NegativeAmountException);
  });

  it('should withdraw money correctly', () => {
    const initialBalance = wallet.getBalance().getAmount();
    const withdrawAmount = new Money(50);

    wallet.withdraw(withdrawAmount);

    expect(wallet.getBalance().getAmount()).toBe(
      initialBalance - withdrawAmount.getAmount(),
    );
  });

  it('should throw error when withdrawing negative amount', () => {
    const negativeAmount = new Money(0);

    expect(() => {
      wallet.withdraw(negativeAmount);
    }).toThrow(NegativeAmountException);
  });

  it('should throw error when withdrawing more than balance', () => {
    const excessiveAmount = new Money(wallet.getBalance().getAmount() + 1);

    expect(() => {
      wallet.withdraw(excessiveAmount);
    }).toThrow(InsufficientFundsException);
  });

  it('should return wallet creation date', () => {
    const createdAt = wallet.getCreatedAt();
    expect(createdAt).toBeInstanceOf(Date);
  });
});
