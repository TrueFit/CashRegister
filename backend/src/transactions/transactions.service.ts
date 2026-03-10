import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './transaction.schema';
import { TransactionRowDto } from './dto/transaction-row.dto';
import { ChangeCalculatorService } from './change-calculator.service';

export interface TransactionResult {
  amountOwed: number;
  amountPaid: number;
  change: number;
  denominations: string;
  strategy: string;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly changeCalculatorService: ChangeCalculatorService,
  ) {}

  async processTransactions(
    rows: TransactionRowDto[],
  ): Promise<TransactionResult[]> {
    const results: TransactionResult[] = [];

    for (const row of rows) {
      if (row.amountPaid < row.amountOwed) {
        throw new BadRequestException(
          `amountPaid (${row.amountPaid}) must be >= amountOwed (${row.amountOwed})`,
        );
      }

      const { change, denominations, strategy } =
        this.changeCalculatorService.calculate(row.amountOwed, row.amountPaid);

      const transaction = new this.transactionModel({
        amountOwed: row.amountOwed,
        amountPaid: row.amountPaid,
        change,
        denominations,
        strategy,
        timestamp: new Date(),
      });

      await transaction.save();

      results.push({
        amountOwed: row.amountOwed,
        amountPaid: row.amountPaid,
        change,
        denominations,
        strategy,
      });
    }

    return results;
  }
}
