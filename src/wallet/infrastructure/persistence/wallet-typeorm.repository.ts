import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../domain/wallet.entity';
import { WalletRepositoryPort } from '../../application/ports/wallet.repository.port';
import { WalletTypeormEntity } from './wallet-typeorm.entity';

@Injectable()
export class WalletTypeormRepository implements WalletRepositoryPort {
  constructor(
    @InjectRepository(WalletTypeormEntity)
    private walletRepository: Repository<WalletTypeormEntity>,
  ) {}

  async findById(id: string): Promise<Wallet | null> {
    const walletEntity = await this.walletRepository.findOne({ where: { id } });
    return walletEntity ? walletEntity.toDomain() : null;
  }

  async save(wallet: Wallet): Promise<void> {
    const walletEntity = WalletTypeormEntity.fromDomain(wallet);
    await this.walletRepository.save(walletEntity);
  }

  async findAll(): Promise<Wallet[]> {
    const walletEntities = await this.walletRepository.find();
    return walletEntities.map((entity) => entity.toDomain());
  }
}
