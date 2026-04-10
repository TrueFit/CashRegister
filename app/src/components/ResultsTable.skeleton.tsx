export function ResultsTableSkeleton() {
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
            {[1, 2, 3].map((i) => (
              <tr key={i}>
                <td>
                  <div className="skeleton" style={{ width: 20, height: 16 }} />
                </td>
                <td>
                  <div className="skeleton" style={{ width: 80, height: 16 }} />
                </td>
                <td>
                  <div className="skeleton" style={{ width: 200, height: 16 }} />
                </td>
                <td>
                  <div className="skeleton" style={{ width: 60, height: 20, borderRadius: 99 }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
