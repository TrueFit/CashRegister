import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    uploadFile(file: Express.Multer.File): Promise<import("./transactions.service").TransactionResult[]>;
}
