import { Download, Trash2 } from 'lucide-react';
import { HistoryTableHeader } from '../components/HistoryTableHeader';
import { TransactionRows } from '../components/TransactionRows';
import type { StoredTransaction } from '../domain/transactions';

type HistoryPageProps = {
  minimumCount: number;
  output: string;
  randomCount: number;
  totalProcessed: number;
  transactionHistory: StoredTransaction[];
  onClearHistory: () => void;
  onDownloadOutput: () => void;
  onRerollRandomTransaction: (transactionId: string) => void;
  onViewTransactionDetails: (transaction: StoredTransaction) => void;
};

export function HistoryPage({
  minimumCount,
  output,
  randomCount,
  totalProcessed,
  transactionHistory,
  onClearHistory,
  onDownloadOutput,
  onRerollRandomTransaction,
  onViewTransactionDetails,
}: HistoryPageProps) {
  return (
    <>
      <header className="top-card">
        <div>
          <h1>Transaction History</h1>
          <p>All transactions are saved in this browser using local storage.</p>
        </div>
        <div className="history-actions">
          <button className="view-button" type="button" onClick={onDownloadOutput} disabled={!output}>
            Download
            <Download size={16} aria-hidden="true" />
          </button>
          <button
            className="view-button danger-button"
            type="button"
            onClick={onClearHistory}
            disabled={transactionHistory.length === 0}
          >
            Clear
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </header>

      <section className="surface-card history-card full-history-card" aria-label="All transactions">
        <div className="history-head">
          <h2>All Transactions</h2>
          <div className="mini-stats" aria-label="Processed transaction summary">
            <span>{totalProcessed} processed</span>
            <span>{minimumCount} normal</span>
            <span>{randomCount} random</span>
          </div>
        </div>

        <div className="history-table">
          <HistoryTableHeader />
          <TransactionRows
            emptyText="No transactions yet."
            results={transactionHistory}
            onRerollRandomTransaction={onRerollRandomTransaction}
            onViewTransactionDetails={onViewTransactionDetails}
          />
        </div>
      </section>
    </>
  );
}
