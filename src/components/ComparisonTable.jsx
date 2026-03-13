const rows = [
  ['Browser Cache', 'Fast', 'Medium', 'Low', 'Static assets'],
  ['CDN Cache', 'Very Fast', 'Low', 'Low', 'Public global content'],
  ['Service Worker Cache', 'Very Fast', 'High', 'High', 'Offline-first apps'],
  ['Memory Cache', 'Fastest', 'Low', 'Very Low', 'SPA repeated reads'],
  ['Disk Cache', 'Fast', 'Medium', 'Medium', 'Reload persistence'],
  ['HTTP Cache Headers', 'Depends', 'Depends', 'Depends', 'Server cache control']
]

export default function ComparisonTable() {
  return (
    <div className="card">
      <h3>Techniques Comparison</h3>
      <table className="compare-table">
        <thead>
          <tr>
            <th>Technique</th>
            <th>Speed</th>
            <th>Freshness</th>
            <th>Offline</th>
            <th>Typical Use</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell) => <td key={cell}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
