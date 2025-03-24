import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { Wallet } from '../../domain/wallet.entity';
import { WalletId } from '../../domain/walletid.vo';
import { Money } from '../../domain/money.vo';
import { OwnerId } from '../../domain/ownerid.vo';

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
    entity.id = wallet.getId().getValue();
    entity.balance = wallet.getBalance().getAmount();
    entity.owner = wallet.getOwner().getValue();
    entity.createdAt = wallet.getCreatedAt();
    return entity;
  }

  toDomain(): Wallet {
    return new Wallet(
      new WalletId(this.id),
      new Money(Number(this.balance)),
      new OwnerId(this.owner),
      this.createdAt,
    );
  }
}
