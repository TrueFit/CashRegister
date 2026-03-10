import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Transaction, TransactionSchema } from './transaction.schema';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { ChangeCalculatorService } from './change-calculator.service';
import { GreedyChangeStrategy } from './strategies/greedy-change.strategy';
import { RandomChangeStrategy } from './strategies/random-change.strategy';
import { DENOMINATIONS_TOKEN, CURRENCY_DENOMINATIONS, USD_DENOMINATIONS } from '../config/currency.config';
import {
  CHANGE_CALCULATOR_CONFIG,
  DEFAULT_CHANGE_CALCULATOR_CONFIG,
} from '../config/change-calculator.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    ChangeCalculatorService,
    GreedyChangeStrategy,
    RandomChangeStrategy,
    {
      provide: DENOMINATIONS_TOKEN,
      useFactory: (configService: ConfigService) => {
        const currency = configService.get<string>('CURRENCY', 'USD');
        return CURRENCY_DENOMINATIONS[currency] ?? USD_DENOMINATIONS;
      },
      inject: [ConfigService],
    },
    {
      provide: CHANGE_CALCULATOR_CONFIG,
      useFactory: (configService: ConfigService) => {
        const divisor = parseInt(
          configService.get<string>('CHANGE_DIVISOR', '3'),
          10,
        );
        return { divisor: isNaN(divisor) ? 3 : divisor };
      },
      inject: [ConfigService],
    },
  ],
})
export class TransactionsModule {}
