import type { ChangeResult, CurrencySystem } from '../core/types';
import { formatChange } from '../utils/formatters';
import { generateOutputFile, downloadFile } from '../utils/fileGenerator';
import './ResultsDisplay.css';

interface ResultsDisplayProps {
  results: ChangeResult[];
  currency: CurrencySystem;
}

export function ResultsDisplay({ results, currency }: ResultsDisplayProps) {
  const handleDownload = () => {
    const outputLines = results.map(result =>
      formatChange(result.denominations, currency)
    );
    const blob = generateOutputFile(outputLines);
    downloadFile(blob, 'change-output.txt');
  };

  const handleCopy = () => {
    const outputLines = results.map(result =>
      formatChange(result.denominations, currency)
    );
    navigator.clipboard.writeText(outputLines.join('\n'));
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h2 className="card-title">Results ({results.length} transactions)</h2>
        <div className="results-actions">
          <button onClick={handleCopy} className="button button-secondary">
            Copy to Clipboard
          </button>
          <button onClick={handleDownload} className="button button-primary">
            Download Results
          </button>
        </div>
      </div>

      <div className="results-table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th>Owed</th>
              <th>Paid</th>
              <th>Change</th>
              <th>Denominations</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr key={idx} className={result.isRandom ? 'random-row' : ''}>
                <td className="text-monospace">${result.owed.toFixed(2)}</td>
                <td className="text-monospace">${result.paid.toFixed(2)}</td>
                <td className="text-monospace">
                  ${(result.changeInCents / 100).toFixed(2)}
                  {result.isRandom && (
                    <span className="random-badge" title="Random denominations">
                      🎲
                    </span>
                  )}
                </td>
                <td className="denominations-cell">
                  {formatChange(result.denominations, currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="results-footer">
        <p className="results-summary">
          {results.filter(r => r.isRandom).length} random, {results.filter(r => !r.isRandom).length} minimum
        </p>
      </div>
    </div>
  );
}
