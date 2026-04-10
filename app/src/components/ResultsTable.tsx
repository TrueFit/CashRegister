import type { ProcessResponse } from "../lib/schemas"

type ResultsTableProps = {
  response: ProcessResponse
}

export function ResultsTable({ response }: ResultsTableProps) {
  return (
    <div className="results-container">
      <div className="results-table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Input</th>
              <th>Output</th>
              <th>Strategy</th>
            </tr>
          </thead>
          <tbody>
            {response.results.map((result) => (
              <tr key={result.line} className={result.error ? "row-error" : ""}>
                <td className="line-num">{result.line}</td>
                <td className="input-col">{result.input}</td>
                <td className="output-col">
                  {result.error ? (
                    <span className="error-text">{result.error}</span>
                  ) : (
                    result.output
                  )}
                </td>
                <td className="strategy-col">
                  {result.strategy ? (
                    <span
                      className={`badge ${result.strategy === "random" ? "badge-random" : "badge-ok"}`}
                    >
                      {result.strategy}
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="results-summary">
        <div className="summary-stat">
          <span className="summary-dot dot-green" />
          {response.total_lines} processed
        </div>
        <div className="summary-stat">
          <span className="summary-dot dot-red" />
          {response.error_count} errors
        </div>
      </div>
    </div>
  )
}
