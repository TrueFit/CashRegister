import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: false })
export class Transaction {
  @Prop({ required: true })
  amountOwed: number;

  @Prop({ required: true })
  amountPaid: number;

  @Prop({ required: true })
  change: number;

  @Prop({ required: true })
  denominations: string;

  @Prop({ required: true, enum: ['greedy', 'random'] })
  strategy: 'greedy' | 'random';

  @Prop({ required: true, default: () => new Date() })
  timestamp: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
