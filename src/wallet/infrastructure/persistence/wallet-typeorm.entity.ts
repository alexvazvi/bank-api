import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { Wallet } from '../../domain/wallet.entity';

@Entity('wallets')
export class WalletTypeormEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  balance: number;

  @Column({ type: 'varchar' })
  owner: string;

  @CreateDateColumn()
  createdAt: Date;

  static fromDomain(wallet: Wallet): WalletTypeormEntity {
    const entity = new WalletTypeormEntity();
    entity.id = wallet.getId();
    entity.balance = wallet.getBalance();
    entity.owner = wallet.getOwner();
    entity.createdAt = wallet.getCreatedAt();
    return entity;
  }

  toDomain(): Wallet {
    return new Wallet(
      this.id,
      Number(this.balance),
      this.owner,
      this.createdAt,
    );
  }
}
