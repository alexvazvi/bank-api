import { Wallet } from '../../domain/wallet.entity';

export interface WalletRepositoryPort {
  findById(walletId: string): Promise<Wallet | null>;
  save(wallet: Wallet): Promise<void>;
  findAll(): Promise<Wallet[]>;
}
