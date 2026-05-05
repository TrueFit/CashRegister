import { Dices, Eye } from 'lucide-react';
import { formatMoney } from '../domain/currencies';
import type { StoredTransaction } from '../domain/transactions';
import { formatHistoryDate, getTransactionCurrency } from '../domain/transactions';

type TransactionRowsProps = {
  emptyText: string;
  results: StoredTransaction[];
  onRerollRandomTransaction: (transactionId: string) => void;
  onViewTransactionDetails: (transaction: StoredTransaction) => void;
};

export function TransactionRows({
  emptyText,
  results,
  onRerollRandomTransaction,
  onViewTransactionDetails,
}: TransactionRowsProps) {
  return results.length > 0 ? (
    results.map((result) => {
      const transactionCurrency = getTransactionCurrency(result);

      return (
        <div className="history-row" key={result.id}>
          <span>{formatMoney(result.amountOwedCents, transactionCurrency)}</span>
          <span>{formatMoney(result.amountPaidCents, transactionCurrency)}</span>
          <span>{formatMoney(result.changeCents, transactionCurrency)}</span>
          <span className="history-result">
            {result.output}
            {result.strategy === 'random' ? (
              <button
                className="status-chip compact random reroll-chip"
                type="button"
                onClick={() => onRerollRandomTransaction(result.id)}
                title="Generate a new random change version"
              >
                Random
                <Dices size={14} aria-hidden="true" />
              </button>
            ) : (
              <em className="status-chip compact minimum">Normal</em>
            )}
            {result.changeShortfallCents > 0 ? (
              <em className="status-chip compact shortfall">
                Short {formatMoney(result.changeShortfallCents, transactionCurrency)}
              </em>
            ) : null}
          </span>
          <span>{formatHistoryDate(result.createdAt)}</span>
          <span className="history-actions-cell">
            <button
              className="view-button compact-view-button"
              type="button"
              onClick={() => onViewTransactionDetails(result)}
            >
              View
              <Eye size={15} aria-hidden="true" />
            </button>
          </span>
        </div>
      );
    })
  ) : (
    <div className="empty-history">{emptyText}</div>
  );
}
