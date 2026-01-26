import type { ChangeResult, CurrencySystem, CalculatorConfig } from '../core/types';
import { formatChange } from '../utils/formatters';
import { generateOutputFile, downloadFile } from '../utils/fileGenerator';
import './ResultsDisplay.css';

interface ResultsDisplayProps {
  results: ChangeResult[];
  currency: CurrencySystem;
  config: CalculatorConfig;
  fileName: string;
}

export function ResultsDisplay({ results, currency, config, fileName }: ResultsDisplayProps) {
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

  const randomCount = results.filter(r => r.isRandom).length;
  const minimumCount = results.filter(r => !r.isRandom).length;

  return (
    <div className="results-container">
      {/* Success Badge */}
      <div style={{
        background: '#f0fdf4',
        border: '1px solid #86efac',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '20px' }}>✅</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
            {fileName} • {results.length} transaction{results.length !== 1 ? 's' : ''} processed
          </div>
        </div>
      </div>

      <div className="results-header">
        <div>
          <h2 className="card-title">Results</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {minimumCount} minimum change, {randomCount} random denominations
          </p>
        </div>
        <div className="results-actions">
          <button onClick={handleCopy} className="button button-secondary">
            Copy to Clipboard
          </button>
          <button onClick={handleDownload} className="button button-primary">
            Download Results
          </button>
        </div>
      </div>

      {config.randomEnabled && (
        <div style={{ marginBottom: '16px', padding: '12px', background: randomCount > 0 ? '#fffbeb' : '#f0f9ff', border: `1px solid ${randomCount > 0 ? '#fbbf24' : '#3b82f6'}`, borderRadius: '8px', fontSize: '14px' }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>🎲 The Twist:</strong> When owed amount (in cents) is divisible by <strong>{config.randomDivisor}</strong>, denominations are randomized
          </div>
          {randomCount > 0 ? (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {results.map((r, i) => r.isRandom && (
                <div key={i} style={{ marginTop: '4px' }}>
                  → <strong>Row {i + 1}:</strong> ${r.owed.toFixed(2)} = {Math.round(r.owed * 100)}¢ ÷ {config.randomDivisor} = {Math.round(r.owed * 100) / config.randomDivisor} ✓
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              None of the owed amounts are divisible by {config.randomDivisor}, so all use minimum change
            </div>
          )}
        </div>
      )}

      <div className="results-table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th>Owed</th>
              <th>Paid</th>
              <th>Change</th>
              <th>Denominations</th>
              <th style={{ textAlign: 'center' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr key={idx} className={result.isRandom ? 'random-row' : ''}>
                <td className="text-monospace">${result.owed.toFixed(2)}</td>
                <td className="text-monospace">${result.paid.toFixed(2)}</td>
                <td className="text-monospace">
                  ${(result.changeInCents / 100).toFixed(2)}
                </td>
                <td className="denominations-cell">
                  {formatChange(result.denominations, currency)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {result.isRandom ? (
                    <span style={{ fontSize: '20px' }} title="Random denominations">🎲</span>
                  ) : (
                    <span style={{ fontSize: '18px' }} title="Minimum change">💰</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="results-footer">
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>💰</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{minimumCount}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Minimum Change</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>🎲</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{randomCount}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Random Twist</div>
          </div>
        </div>
      </div>
    </div>
  );
}
