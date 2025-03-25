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
  @ApiOperation({ summary: 'Crear una nueva wallet' })
  @ApiBody({ type: CreateWalletDto })
  @ApiResponse({
    status: 201,
    description: 'Wallet creada correctamente',
    type: WalletResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación o cantidad negativa',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
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
  @ApiOperation({ summary: 'Obtener una wallet por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la wallet a buscar' })
  @ApiResponse({
    status: 200,
    description: 'Wallet encontrada',
    type: WalletResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Wallet no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
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
  @ApiOperation({ summary: 'Obtener todas las wallets' })
  @ApiResponse({
    status: 200,
    description: 'Lista de wallets',
    type: [WalletResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async getAllWallets() {
    const wallets = await this.walletService.getAllWallets();
    return wallets.map((wallet) => WalletResponseDto.fromDomain(wallet));
  }

  @Post(':id/deposit')
  @ApiOperation({ summary: 'Depositar dinero en una wallet' })
  @ApiParam({ name: 'id', description: 'ID de la wallet donde depositar' })
  @ApiBody({ type: DepositDto })
  @ApiResponse({
    status: 200,
    description: 'Depósito realizado correctamente',
    type: WalletResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cantidad negativa o inválida',
  })
  @ApiResponse({
    status: 404,
    description: 'Wallet no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
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
  @ApiOperation({ summary: 'Retirar dinero de una wallet' })
  @ApiParam({ name: 'id', description: 'ID de la wallet de donde retirar' })
  @ApiBody({ type: WithdrawDto })
  @ApiResponse({
    status: 200,
    description: 'Retiro realizado correctamente',
    type: WalletResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Cantidad negativa, inválida o fondos insuficientes',
  })
  @ApiResponse({
    status: 404,
    description: 'Wallet no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
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
