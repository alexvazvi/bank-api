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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('wallets')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new wallet' })
  @ApiBody({ type: CreateWalletDto })
  @ApiResponse({
    status: 201,
    description: 'Wallet created successfully',
    type: WalletResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or negative amount',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
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
  @ApiOperation({ summary: 'Get a wallet by its ID' })
  @ApiParam({ name: 'id', description: 'ID of the wallet to find' })
  @ApiResponse({
    status: 200,
    description: 'Wallet found',
    type: WalletResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Wallet not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
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
  @ApiOperation({ summary: 'Get all wallets' })
  @ApiResponse({
    status: 200,
    description: 'List of wallets',
    type: [WalletResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getAllWallets() {
    const wallets = await this.walletService.getAllWallets();
    return wallets.map((wallet) => WalletResponseDto.fromDomain(wallet));
  }

  @Post(':id/deposit')
  @ApiOperation({ summary: 'Deposit money into a wallet' })
  @ApiParam({ name: 'id', description: 'ID of the wallet to deposit into' })
  @ApiBody({ type: DepositDto })
  @ApiResponse({
    status: 200,
    description: 'Deposit completed successfully',
    type: WalletResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Negative or invalid amount',
  })
  @ApiResponse({
    status: 404,
    description: 'Wallet not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
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
  @ApiOperation({ summary: 'Withdraw money from a wallet' })
  @ApiParam({ name: 'id', description: 'ID of the wallet to withdraw from' })
  @ApiBody({ type: WithdrawDto })
  @ApiResponse({
    status: 200,
    description: 'Withdrawal completed successfully',
    type: WalletResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Negative amount, invalid amount, or insufficient funds',
  })
  @ApiResponse({
    status: 404,
    description: 'Wallet not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
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
