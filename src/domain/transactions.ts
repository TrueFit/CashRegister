import { ChangeResult } from './changeRules';
import {
  CurrencyCode,
  CurrencyOption,
  DEFAULT_BASE_CURRENCY_CODE,
  DEFAULT_CURRENCIES,
} from './currencies';

export type StoredTransaction = ChangeResult & {
  id: string;
  createdAt: string;
  currencyCode?: CurrencyCode;
  currencySymbol?: string;
};

export type ProcessedState =
  | { status: 'idle'; results: StoredTransaction[]; error: null }
  | { status: 'ready'; results: StoredTransaction[]; error: null }
  | { status: 'error'; results: StoredTransaction[]; error: string };

export function formatHistoryDate(value: string): string {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function makeTransactionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function storeTransaction(
  result: ChangeResult,
  currency: Pick<CurrencyOption, 'code' | 'symbol'>,
): StoredTransaction {
  return {
    ...result,
    id: makeTransactionId(),
    createdAt: new Date().toISOString(),
    currencyCode: currency.code,
    currencySymbol: currency.symbol,
  };
}

export function withChangeTotals(transaction: StoredTransaction): StoredTransaction {
  const returnedChangeCents =
    typeof transaction.returnedChangeCents === 'number'
      ? transaction.returnedChangeCents
      : transaction.changeCents;
  const changeShortfallCents =
    typeof transaction.changeShortfallCents === 'number'
      ? transaction.changeShortfallCents
      : Math.max(transaction.changeCents - returnedChangeCents, 0);

  return {
    ...transaction,
    returnedChangeCents,
    changeShortfallCents,
    currencyCode: transaction.currencyCode ?? DEFAULT_BASE_CURRENCY_CODE,
    currencySymbol: transaction.currencySymbol ?? DEFAULT_CURRENCIES[0].symbol,
  };
}

export function isStoredTransaction(value: unknown): value is StoredTransaction {
  if (!value || typeof value !== 'object') return false;

  const transaction = value as Partial<StoredTransaction>;
  return (
    typeof transaction.id === 'string' &&
    typeof transaction.createdAt === 'string' &&
    typeof transaction.lineNumber === 'number' &&
    typeof transaction.amountOwedCents === 'number' &&
    typeof transaction.amountPaidCents === 'number' &&
    typeof transaction.changeCents === 'number' &&
    (typeof transaction.returnedChangeCents === 'number' ||
      transaction.returnedChangeCents === undefined) &&
    (typeof transaction.changeShortfallCents === 'number' ||
      transaction.changeShortfallCents === undefined) &&
    typeof transaction.output === 'string' &&
    typeof transaction.strategy === 'string' &&
    Array.isArray(transaction.breakdown) &&
    (typeof transaction.currencyCode === 'string' || transaction.currencyCode === undefined) &&
    (typeof transaction.currencySymbol === 'string' || transaction.currencySymbol === undefined)
  );
}

export function getTransactionCurrency(transaction: StoredTransaction): CurrencyOption {
  return {
    code: transaction.currencyCode ?? DEFAULT_BASE_CURRENCY_CODE,
    label: transaction.currencyCode ?? DEFAULT_BASE_CURRENCY_CODE,
    symbol: transaction.currencySymbol ?? DEFAULT_CURRENCIES[0].symbol,
    usdRate: 1,
    editable: false,
  };
}
