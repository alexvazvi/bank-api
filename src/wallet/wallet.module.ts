import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletTypeormEntity } from './infrastructure/persistence/wallet-typeorm.entity';
import { WalletTypeormRepository } from './infrastructure/persistence/wallet-typeorm.repository';
import { WalletController } from './infrastructure/wallet.controller';
import { WalletService } from './application/wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([WalletTypeormEntity])],
  controllers: [WalletController],
  providers: [
    WalletService,
    {
      provide: 'WalletRepositoryPort',
      useClass: WalletTypeormRepository,
    },
  ],
})
export class WalletModule {}
