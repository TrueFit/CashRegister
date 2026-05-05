import type { ChangeEvent } from 'react';
import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Dices,
  Download,
  Sparkles,
  Upload,
} from 'lucide-react';
import { HistoryTableHeader } from '../components/HistoryTableHeader';
import { MoneyToken } from '../components/MoneyToken';
import { TransactionRows } from '../components/TransactionRows';
import type { CurrencyCode, CurrencyOption } from '../domain/currencies';
import { formatDenominationValue, formatMoney } from '../domain/currencies';
import type { ProcessedState, StoredTransaction } from '../domain/transactions';

const sampleInputUrl = new URL('../assets/sample-input.txt', import.meta.url).href;

type CalculatorPageProps = {
  amountOwed: string;
  amountPaid: string;
  amountPaidBaseEquivalent: number | null;
  amountPaidCurrency: CurrencyCode;
  baseCurrencyCode: CurrencyCode;
  currencies: CurrencyOption[];
  currentResult: StoredTransaction | null;
  displayedResultCurrency: CurrencyOption;
  minimumCount: number;
  output: string;
  processed: ProcessedState;
  randomCount: number;
  resultStrategyLabel: string;
  selectedBaseCurrency: CurrencyOption;
  selectedPaidCurrency: CurrencyOption;
  totalProcessed: number;
  transactionHistory: StoredTransaction[];
  trickNumber: number;
  onAmountOwedChange: (value: string) => void;
  onAmountPaidChange: (value: string) => void;
  onAmountPaidCurrencyChange: (currencyCode: CurrencyCode) => void;
  onCalculate: () => void;
  onDownloadOutput: () => void;
  onGenerateSampleTransaction: () => void;
  onLoadFlatFile: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRerollRandomTransaction: (transactionId: string) => void;
  onViewAllHistory: () => void;
  onViewTransactionDetails: (transaction: StoredTransaction) => void;
};

export function CalculatorPage({
  amountOwed,
  amountPaid,
  amountPaidBaseEquivalent,
  amountPaidCurrency,
  baseCurrencyCode,
  currencies,
  currentResult,
  displayedResultCurrency,
  minimumCount,
  output,
  processed,
  randomCount,
  resultStrategyLabel,
  selectedBaseCurrency,
  selectedPaidCurrency,
  totalProcessed,
  transactionHistory,
  trickNumber,
  onAmountOwedChange,
  onAmountPaidChange,
  onAmountPaidCurrencyChange,
  onCalculate,
  onDownloadOutput,
  onGenerateSampleTransaction,
  onLoadFlatFile,
  onRerollRandomTransaction,
  onViewAllHistory,
  onViewTransactionDetails,
}: CalculatorPageProps) {
  return (
    <>
      <header className="top-card">
        <div>
          <h1>Hello, Cashier!</h1>
          <p>Enter the amount owed and the amount paid to calculate change.</p>
        </div>
      </header>

      <section className="calculator-grid" aria-label="Cash register calculator">
        <div className="left-stack">
          <section className="surface-card transaction-card">
            <h2>Transaction</h2>

            <label className="amount-field">
              <span>Amount Owed</span>
              <div className="input-shell">
                <span aria-hidden="true">{selectedBaseCurrency.symbol}</span>
                <input
                  aria-label="Amount Owed"
                  inputMode="decimal"
                  value={amountOwed}
                  onChange={(event) => onAmountOwedChange(event.target.value)}
                />
              </div>
            </label>

            <label className="amount-field">
              <span>Amount Paid</span>
              <div className="input-shell paid-input-shell">
                <span aria-hidden="true">{selectedPaidCurrency.symbol}</span>
                <input
                  aria-label="Amount Paid"
                  inputMode="decimal"
                  value={amountPaid}
                  onChange={(event) => onAmountPaidChange(event.target.value)}
                />
                <select
                  aria-label="Amount Paid Currency"
                  className="currency-select"
                  value={amountPaidCurrency}
                  onChange={(event) => onAmountPaidCurrencyChange(event.target.value)}
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
              {amountPaidCurrency !== baseCurrencyCode && amountPaidBaseEquivalent !== null ? (
                <small className="currency-equivalent">
                  Equivalent in {selectedBaseCurrency.code}:{' '}
                  {formatMoney(amountPaidBaseEquivalent, selectedBaseCurrency)}
                </small>
              ) : null}
            </label>

            <button className="calculate-button" type="button" onClick={onCalculate}>
              <Calculator size={20} aria-hidden="true" />
              Calculate Change
            </button>

            <div className="secondary-actions">
              <label className="file-loader">
                <Upload size={18} aria-hidden="true" />
                Load from File
                <input type="file" accept=".txt,.csv,text/plain" onChange={onLoadFlatFile} />
              </label>
              <button className="ghost-button" type="button" onClick={onGenerateSampleTransaction}>
                <Dices size={18} aria-hidden="true" />
                Sample
              </button>
            </div>

            <p className="sample-download-text">
              Need a flat-file example?{' '}
              <a href={sampleInputUrl} download="sample-input.txt">
                Download sample input
              </a>
            </p>
          </section>

          <section className="twist-card">
            <div>
              <div className="twist-title">
                <Sparkles size={18} aria-hidden="true" />
                <h2>Twist Rule</h2>
              </div>
              <p>
                If the owed amount in cents is divisible by {trickNumber}, the system returns
                random denominations.
              </p>
            </div>
            <div className="dice-art" aria-hidden="true">
              <Dices size={54} />
            </div>
          </section>
        </div>

        <section className="surface-card result-card">
          <div className="result-head">
            <h2>Change to Return</h2>
            <div className="money-art" aria-hidden="true">
              <span>{displayedResultCurrency.symbol}</span>
            </div>
          </div>

          {processed.status === 'error' ? (
            <div className="error-state" role="alert">
              <AlertCircle size={20} aria-hidden="true" />
              {processed.error}
            </div>
          ) : !currentResult ? (
            <div className="result-empty">No transaction calculated yet.</div>
          ) : (
            <>
              <div className="change-total">
                {formatMoney(currentResult.changeCents, displayedResultCurrency)}
              </div>
              {currentResult.strategy === 'random' ? (
                <button
                  className="status-chip random reroll-chip"
                  type="button"
                  onClick={() => onRerollRandomTransaction(currentResult.id)}
                  title="Generate a new random change version"
                >
                  {resultStrategyLabel}
                  <Dices size={14} aria-hidden="true" />
                </button>
              ) : (
                <div className={`status-chip ${currentResult.strategy}`}>{resultStrategyLabel}</div>
              )}

              <div className="denomination-list" aria-label="Change denomination breakdown">
                {currentResult.breakdown.length > 0 ? (
                  <>
                    <div className="denomination-row denomination-head">
                      <span>Type</span>
                      <span>Value</span>
                      <span>Qty</span>
                      <span>Total</span>
                    </div>
                    {currentResult.breakdown.map((item) => (
                      <div className="denomination-row" key={`${item.cents}-${item.singular}`}>
                        <div className="denomination-type">
                          <MoneyToken denomination={item} />
                          <strong>{item.count === 1 ? item.singular : item.plural}</strong>
                        </div>
                        <span>{formatDenominationValue(item.cents, displayedResultCurrency)}</span>
                        <b>{item.count}</b>
                        <strong className="row-total">
                          {formatMoney(item.totalCents, displayedResultCurrency)}
                        </strong>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="empty-breakdown">
                    {currentResult.changeCents === 0
                      ? 'No denominations needed.'
                      : 'No available denominations can be returned.'}
                  </div>
                )}
              </div>

              {currentResult.changeShortfallCents > 0 ? (
                <div className="shortfall-strip" role="status">
                  <AlertCircle size={18} aria-hidden="true" />
                  Missing {formatMoney(currentResult.changeShortfallCents, displayedResultCurrency)}{' '}
                  because available denominations cannot make exact change.
                </div>
              ) : null}

              <div className="total-strip">
                <span>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  Returned Change
                </span>
                <strong>{formatMoney(currentResult.returnedChangeCents, displayedResultCurrency)}</strong>
              </div>
            </>
          )}
        </section>
      </section>

      <section className="surface-card history-card" aria-label="Recent transactions">
        <div className="history-head">
          <h2>Recent Transactions</h2>
          <div className="history-actions">
            <div className="mini-stats" aria-label="Processed transaction summary">
              <span>{totalProcessed} processed</span>
              <span>{minimumCount} normal</span>
              <span>{randomCount} random</span>
            </div>
            <button className="view-button" type="button" onClick={onDownloadOutput} disabled={!output}>
              Download
              <Download size={16} aria-hidden="true" />
            </button>
            <button className="view-button" type="button" onClick={onViewAllHistory}>
              View All
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="history-table">
          <HistoryTableHeader />
          <TransactionRows
            emptyText={processed.status === 'error' ? 'Fix the transaction and calculate again.' : 'No transactions yet.'}
            results={transactionHistory.slice(0, 8)}
            onRerollRandomTransaction={onRerollRandomTransaction}
            onViewTransactionDetails={onViewTransactionDetails}
          />
        </div>
      </section>
    </>
  );
}
