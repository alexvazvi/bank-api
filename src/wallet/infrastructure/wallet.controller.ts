import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { WalletService } from '../application/wallet.service';
import {
  CreateWalletDto,
  DepositDto,
  WalletResponseDto,
  WithdrawDto,
} from './wallet.dto';
import {
  InsufficientFundsException,
  NegativeAmountException,
  WalletNotFoundException,
} from '../domain/exceptions';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  async createWallet(@Body() createWalletDto: CreateWalletDto) {
    try {
      const wallet = await this.walletService.createWallet(
        createWalletDto.owner,
        createWalletDto.initialBalance,
      );
      return WalletResponseDto.fromDomain(wallet);
    } catch (error) {
      if (error instanceof NegativeAmountException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof Error) {
        throw new HttpException(
          `Error creating wallet: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'Error creating wallet',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get(':id')
  async getWallet(@Param('id') id: string) {
    try {
      const wallet = await this.walletService.getWalletById(id);
      return WalletResponseDto.fromDomain(wallet);
    } catch (error) {
      if (error instanceof WalletNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error retrieving wallet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllWallets() {
    const wallets = await this.walletService.getAllWallets();
    return wallets.map((wallet) => WalletResponseDto.fromDomain(wallet));
  }

  @Post(':id/deposit')
  async deposit(@Param('id') id: string, @Body() depositDto: DepositDto) {
    try {
      const wallet = await this.walletService.deposit(id, depositDto.amount);
      return WalletResponseDto.fromDomain(wallet);
    } catch (error) {
      if (error instanceof WalletNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof NegativeAmountException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Error depositing to wallet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id/withdraw')
  async withdraw(@Param('id') id: string, @Body() withdrawDto: WithdrawDto) {
    try {
      const wallet = await this.walletService.withdraw(id, withdrawDto.amount);
      return WalletResponseDto.fromDomain(wallet);
    } catch (error) {
      if (error instanceof WalletNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof NegativeAmountException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      if (error instanceof InsufficientFundsException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Error withdrawing from wallet',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
