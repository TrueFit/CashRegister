import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ChangeCalculatorService } from './change-calculator.service';
import { Transaction } from './transaction.schema';

const mockTransactionModel = {
  save: jest.fn().mockResolvedValue(undefined),
};

function MockTransactionConstructor(data: any) {
  return { ...data, save: mockTransactionModel.save };
}

describe('TransactionsService', () => {
  let service: TransactionsService;
  let changeCalculatorService: ChangeCalculatorService;

  const mockChangeCalculatorService = {
    calculate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: ChangeCalculatorService,
          useValue: mockChangeCalculatorService,
        },
        {
          provide: getModelToken(Transaction.name),
          useValue: MockTransactionConstructor,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    changeCalculatorService = module.get<ChangeCalculatorService>(
      ChangeCalculatorService,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should process a single transaction row', async () => {
    mockChangeCalculatorService.calculate.mockReturnValue({
      change: 1.0,
      denominations: '1 dollar',
      strategy: 'greedy',
    });

    const result = await service.processTransactions([
      { amountOwed: 1.0, amountPaid: 2.0 },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      amountOwed: 1.0,
      amountPaid: 2.0,
      change: 1.0,
      denominations: '1 dollar',
      strategy: 'greedy',
    });
  });

  it('should process multiple rows', async () => {
    mockChangeCalculatorService.calculate
      .mockReturnValueOnce({
        change: 1.0,
        denominations: '1 dollar',
        strategy: 'greedy',
      })
      .mockReturnValueOnce({
        change: 0.25,
        denominations: '1 quarter',
        strategy: 'random',
      });

    const result = await service.processTransactions([
      { amountOwed: 1.0, amountPaid: 2.0 },
      { amountOwed: 0.75, amountPaid: 1.0 },
    ]);

    expect(result).toHaveLength(2);
    expect(mockChangeCalculatorService.calculate).toHaveBeenCalledTimes(2);
  });

  it('should throw BadRequestException when amountPaid < amountOwed', async () => {
    await expect(
      service.processTransactions([{ amountOwed: 5.0, amountPaid: 3.0 }]),
    ).rejects.toThrow(BadRequestException);
  });

  it('should call changeCalculatorService.calculate with correct args', async () => {
    mockChangeCalculatorService.calculate.mockReturnValue({
      change: 2.5,
      denominations: '2 dollars, 2 quarters',
      strategy: 'greedy',
    });

    await service.processTransactions([{ amountOwed: 2.5, amountPaid: 5.0 }]);

    expect(mockChangeCalculatorService.calculate).toHaveBeenCalledWith(2.5, 5.0);
  });

  it('should return empty array for empty input', async () => {
    const result = await service.processTransactions([]);
    expect(result).toEqual([]);
  });
});
