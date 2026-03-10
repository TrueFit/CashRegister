import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { TransactionsService } from './transactions.service';
import { TransactionRowDto } from './dto/transaction-row.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const content = file.buffer.toString('utf-8');
    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      throw new BadRequestException('CSV file is empty');
    }

    // Detect and skip header row
    const firstLine = lines[0].toLowerCase();
    const dataLines =
      firstLine.includes('amount_owed') || firstLine.includes('amountowed')
        ? lines.slice(1)
        : lines;

    if (dataLines.length === 0) {
      throw new BadRequestException('CSV file has no data rows');
    }

    const rows: TransactionRowDto[] = [];

    for (let i = 0; i < dataLines.length; i++) {
      const parts = dataLines[i].split(',');
      if (parts.length < 2) {
        throw new BadRequestException(
          `Invalid CSV row at line ${i + 1}: "${dataLines[i]}"`,
        );
      }

      const [rawOwed, rawPaid] = parts;
      const dto = plainToInstance(TransactionRowDto, {
        amountOwed: rawOwed.trim(),
        amountPaid: rawPaid.trim(),
      });

      const errors = await validate(dto);
      if (errors.length > 0) {
        const messages = errors
          .map((e) => Object.values(e.constraints || {}).join(', '))
          .join('; ');
        throw new BadRequestException(
          `Validation error at row ${i + 1}: ${messages}`,
        );
      }

      rows.push(dto);
    }

    return this.transactionsService.processTransactions(rows);
  }
}
