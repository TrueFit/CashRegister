import { useState, useRef, useEffect } from 'react';
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
  const [lastInput, setLastInput] = useState<string>('');
  const [configChanged, setConfigChanged] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleFileContent = (content: string, uploadedFileName?: string) => {
    if (!content) {
      setResults([]);
      setError('');
      setLastInput('');
      setFileName('');
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
      setLastInput(content);
      setConfigChanged(false);
      setFileName(uploadedFileName || 'example-data.txt');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
      setLastInput('');
      setFileName('');
    }
  };

  const handleTryExample = () => {
    const exampleContent = `2.12,3.00
1.97,2.00
3.33,5.00`;
    handleFileContent(exampleContent);
  };

  const handleConfigChange = (newConfig: CalculatorConfig) => {
    setConfig(newConfig);
    if (results.length > 0) {
      setConfigChanged(true);
    }
  };

  const handleRecalculate = () => {
    if (lastInput) {
      handleFileContent(lastInput);
    }
  };

  const handleReset = () => {
    setResults([]);
    setError('');
    setLastInput('');
    setConfigChanged(false);
    setFileName('');
  };

  // Scroll to results when they change
  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [results]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cash Register Change Calculator</h1>
        <p className="subtitle">Calculate change with minimum or random denominations</p>
      </header>

      <main className="app-main">
        {/* Welcome - Only show when no results */}
        {results.length === 0 && (
          <>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '24px 28px',
              borderRadius: '12px',
              color: 'white',
              marginBottom: '24px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 600 }}>
                Cash Register Change Calculator
              </h2>
              <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.6', opacity: 0.95 }}>
                Calculates optimal change denominations with a twist: when the <strong>owed amount</strong> (in cents) is divisible by {config.randomDivisor}, it randomly generates denominations!
              </p>
            </div>

            <div className="card">
              <h2 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Try the Example</h2>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Click the button to calculate change for these sample transactions:
              </p>
              <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.8' }}>
                  <div><strong>2.12,3.00</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>→ $0.88 change (212¢ not ÷ by 3)</span></div>
                  <div><strong>1.97,2.00</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>→ $0.03 change (197¢ not ÷ by 3)</span></div>
                  <div><strong>3.33,5.00</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>→ $1.67 change (333¢ <strong style={{ color: '#f59e0b' }}>÷ by 3!</strong> 🎲)</span></div>
                </div>
              </div>
              <button
                onClick={handleTryExample}
                className="button button-primary"
                style={{ fontSize: '15px', padding: '12px 32px' }}
              >
                Calculate Example
              </button>
            </div>

            <div className="card">
              <h2 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Or Upload Your Own File</h2>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Format: <code style={{ background: 'var(--bg)', padding: '2px 6px', borderRadius: '4px' }}>owed,paid</code> (one transaction per line)
              </p>
              <FileUpload onFileContent={handleFileContent} error={error} />
            </div>
          </>
        )}

        {/* Actions bar after results */}
        {results.length > 0 && (
          <>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={handleTryExample} className="button button-secondary">
                Load Example
              </button>
              <button onClick={handleReset} className="button button-secondary">
                Clear All
              </button>
              {configChanged && (
                <button onClick={handleRecalculate} className="button button-primary">
                  ⟳ Recalculate
                </button>
              )}
            </div>

            <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px', color: 'var(--text-primary)' }}>
                Upload Different File
              </div>
              <FileUpload onFileContent={handleFileContent} error={error} />
            </div>
          </>
        )}

        {/* Configuration - Always visible */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 className="card-title">🎲 Random Twist Configuration</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Configure when random denominations should be used instead of minimum change
          </p>
          <div style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg)', borderRadius: '8px' }}>
              <input
                type="checkbox"
                id="random-enabled"
                checked={config.randomEnabled}
                onChange={(e) => handleConfigChange({ ...config, randomEnabled: e.target.checked })}
              />
              <label htmlFor="random-enabled" style={{ cursor: 'pointer', flex: 1, fontSize: '14px' }}>
                Enable random denominations twist
              </label>
            </div>

            {config.randomEnabled && (
              <div style={{ paddingLeft: '8px' }}>
                <label className="input-label" style={{ marginBottom: '8px', fontSize: '14px' }}>
                  Random Divisor
                </label>
                <input
                  type="number"
                  className="input"
                  value={config.randomDivisor}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      handleConfigChange({ ...config, randomDivisor: 3 });
                    } else {
                      const num = parseInt(value);
                      if (num > 0) {
                        handleConfigChange({ ...config, randomDivisor: num });
                      }
                    }
                  }}
                  style={{ maxWidth: '120px' }}
                />
                <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  When owed amount (in cents) is divisible by {config.randomDivisor}, denominations will be randomized
                </p>
              </div>
            )}

            {configChanged && (
              <div style={{ padding: '12px', background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: '8px', fontSize: '13px' }}>
                ⚠️ Settings changed! Click "⟳ Recalculate" above to update results.
              </div>
            )}
          </div>
        </div>

        {/* Results Display */}
        {results.length > 0 && (
          <div className="card" ref={resultsRef} style={{ scrollMarginTop: '20px' }}>
            <ResultsDisplay
              results={results}
              currency={USD}
              config={config}
              fileName={fileName}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
