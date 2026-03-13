import ComparisonTable from '../components/ComparisonTable'

export default function Compare() {
  return (
    <section>
      <h2>Comparison</h2>
      <ComparisonTable />
      <div className="card">
        <h3>Recommended usage</h3>
        <ul>
          <li>Use Cache First for hashed static assets.</li>
          <li>Use Network First for dynamic APIs that must stay fresh.</li>
          <li>Use Stale While Revalidate for dashboards and content lists.</li>
          <li>Use Service Worker cache when offline support matters.</li>
          <li>Use HTTP headers to coordinate browser and CDN behavior.</li>
        </ul>
      </div>
    </section>
  )
}
