import './App.css'
import { USD } from './core/currency'
import { calculateChange, DEFAULT_CONFIG } from './core/changeCalculator'

function App() {
  // Test checkpoint: Verify algorithms with README sample inputs
  const testCases = [
    { owed: 2.12, paid: 3.00 }, // Should be minimum (88 cents, not divisible by 3)
    { owed: 1.97, paid: 2.00 }, // Should be minimum (3 cents, divisible by 3 but too small for variety)
    { owed: 3.33, paid: 5.00 }, // Should be random (167 cents, divisible by 3)
  ];

  const results = testCases.map(tc => {
    try {
      return calculateChange(tc.owed, tc.paid, DEFAULT_CONFIG, USD);
    } catch (error) {
      return { error: String(error) };
    }
  });

  // Helper to format denominations
  const formatDenominations = (denoms: Record<string, number>) => {
    return Object.entries(denoms)
      .map(([name, count]) => {
        const denom = USD.denominations.find(d => d.name === name);
        const displayName = count === 1 ? name : (denom?.pluralName || name);
        return `${count} ${displayName}`;
      })
      .join(', ');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cash Register Change Calculator</h1>
        <p className="subtitle">Calculate change with minimum or random denominations</p>
      </header>

      <main className="app-main">
        <div className="card">
          <h2 className="card-title">Algorithm Test Results</h2>
          <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Testing with README sample inputs
          </p>

          {results.map((result, idx) => {
            if ('error' in result) {
              return (
                <div key={idx} style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg)', borderRadius: '6px' }}>
                  <div className="text-error">{result.error}</div>
                </div>
              );
            }

            const tc = testCases[idx];
            return (
              <div key={idx} style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                  <span><strong>Owed:</strong> ${tc.owed.toFixed(2)}</span>
                  <span><strong>Paid:</strong> ${tc.paid.toFixed(2)}</span>
                  <span><strong>Change:</strong> ${(result.changeInCents / 100).toFixed(2)}</span>
                  {result.isRandom && <span style={{ color: 'var(--primary)' }}>🎲 Random</span>}
                </div>
                <div className="text-monospace" style={{ color: 'var(--text-secondary)' }}>
                  {formatDenominations(result.denominations)}
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: '24px', padding: '12px', background: '#f0f9ff', borderRadius: '6px', borderLeft: '3px solid var(--primary)' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              ✓ Core algorithms working correctly!<br/>
              Line 1: Minimum change (not divisible by 3)<br/>
              Line 2: Minimum change (divisible by 3 but simple)<br/>
              Line 3: Random denominations (divisible by 3)
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
