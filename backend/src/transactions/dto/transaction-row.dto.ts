import { IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionRowDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'amountOwed must be a number' })
  @IsPositive({ message: 'amountOwed must be a positive number' })
  amountOwed: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'amountPaid must be a number' })
  @Min(0, { message: 'amountPaid must be non-negative' })
  amountPaid: number;
}
