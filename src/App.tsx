import { useState } from 'react';
import './App.css';
import { USD } from './core/currency';
import { calculateChange, DEFAULT_CONFIG } from './core/changeCalculator';
import type { CalculatorConfig, ChangeResult } from './core/types';
import { parseInputFile } from './utils/fileParser';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';

function App() {
  const [config, setConfig] = useState<CalculatorConfig>(DEFAULT_CONFIG);
  const [results, setResults] = useState<ChangeResult[]>([]);
  const [error, setError] = useState<string>('');

  const handleFileContent = (content: string) => {
    if (!content) {
      setResults([]);
      setError('');
      return;
    }

    try {
      // Parse input file
      const inputLines = parseInputFile(content);

      // Calculate change for each line
      const calculatedResults = inputLines.map(line =>
        calculateChange(line.owed, line.paid, config, USD)
      );

      setResults(calculatedResults);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cash Register Change Calculator</h1>
        <p className="subtitle">Calculate change with minimum or random denominations</p>
      </header>

      <main className="app-main">
        {/* Info Banner */}
        {results.length === 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '24px',
            borderRadius: '12px',
            color: 'white',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>
              How it works
            </h3>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', opacity: 0.95 }}>
              Upload a text file with transactions in the format: <code style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>owed,paid</code> per line.
              The calculator will return the optimal change denominations, with a twist when amounts are divisible by your chosen number.
            </p>
          </div>
        )}

        {/* Config Panel */}
        <div className="card">
          <h2 className="card-title">Configuration</h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg)', borderRadius: '8px' }}>
              <input
                type="checkbox"
                id="random-enabled"
                checked={config.randomEnabled}
                onChange={(e) => setConfig({ ...config, randomEnabled: e.target.checked })}
              />
              <label htmlFor="random-enabled" style={{ cursor: 'pointer', flex: 1, fontSize: '15px', fontWeight: 500 }}>
                Enable random denominations
              </label>
            </div>

            {config.randomEnabled && (
              <div style={{ paddingLeft: '8px' }}>
                <label className="input-label" style={{ marginBottom: '8px' }}>
                  Random Divisor
                </label>
                <input
                  type="number"
                  className="input"
                  value={config.randomDivisor}
                  onChange={(e) => setConfig({ ...config, randomDivisor: parseInt(e.target.value) || 3 })}
                  min="1"
                  style={{ maxWidth: '120px' }}
                />
                <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  When owed amount is divisible by {config.randomDivisor}, denominations will be randomized
                </p>
              </div>
            )}
          </div>
        </div>

        {/* File Upload */}
        <div className="card">
          <h2 className="card-title">Upload Input File</h2>
          <FileUpload onFileContent={handleFileContent} error={error} />
        </div>

        {/* Results Display */}
        {results.length > 0 && (
          <div className="card">
            <ResultsDisplay results={results} currency={USD} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
