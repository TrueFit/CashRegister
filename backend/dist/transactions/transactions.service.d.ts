import { Model } from 'mongoose';
import { TransactionDocument } from './transaction.schema';
import { TransactionRowDto } from './dto/transaction-row.dto';
import { ChangeCalculatorService } from './change-calculator.service';
export interface TransactionResult {
    amountOwed: number;
    amountPaid: number;
    change: number;
    denominations: string;
    strategy: string;
}
export declare class TransactionsService {
    private readonly transactionModel;
    private readonly changeCalculatorService;
    constructor(transactionModel: Model<TransactionDocument>, changeCalculatorService: ChangeCalculatorService);
    processTransactions(rows: TransactionRowDto[]): Promise<TransactionResult[]>;
}
