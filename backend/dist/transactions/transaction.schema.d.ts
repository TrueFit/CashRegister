import { HydratedDocument } from 'mongoose';
export type TransactionDocument = HydratedDocument<Transaction>;
export declare class Transaction {
    amountOwed: number;
    amountPaid: number;
    change: number;
    denominations: string;
    strategy: 'greedy' | 'random';
    timestamp: Date;
}
export declare const TransactionSchema: import("mongoose").Schema<Transaction, import("mongoose").Model<Transaction, any, any, any, import("mongoose").Document<unknown, any, Transaction, any, {}> & Transaction & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Transaction, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Transaction>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Transaction> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
