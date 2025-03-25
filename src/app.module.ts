import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from './wallet/wallet.module';
import { WalletTypeormEntity } from './wallet/infrastructure/persistence/wallet-typeorm.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'bank',
      entities: [WalletTypeormEntity],
      synchronize: true,
    }),
    WalletModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
