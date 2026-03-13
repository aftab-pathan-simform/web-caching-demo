import TimingBar from './TimingBar'

export default function PerformanceComparison({ results }) {
  if (!results || results.length === 0) {
    return (
      <div className="card">
        <h3>Performance Comparison</h3>
        <p style={{ color: '#9ca3af' }}>
          Run benchmarks to see timing comparisons between different caching strategies
        </p>
      </div>
    )
  }

  const maxDuration = Math.max(...results.map(r => r.duration || 0))
  
  const getColor = (strategy) => {
    const colors = {
      'cache-first': '#10b981',
      'network-first': '#f59e0b',
      'stale-while-revalidate': '#8b5cf6',
      'cache-only': '#06b6d4',
      'network-only': '#ef4444'
    }
    return colors[strategy] || '#2563eb'
  }

  const sortedResults = [...results].sort((a, b) => (a.duration || 0) - (b.duration || 0))
  const fastest = sortedResults[0]
  const slowest = sortedResults[sortedResults.length - 1]

  return (
    <div className="card">
      <h3>Performance Comparison</h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px', 
        marginBottom: '20px',
        padding: '12px',
        background: '#0b1220',
        borderRadius: '8px'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
            🏆 Fastest Strategy
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
            {fastest?.strategy || 'N/A'}
          </div>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>
            {fastest?.duration || 0}ms
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
            🐌 Slowest Strategy
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>
            {slowest?.strategy || 'N/A'}
          </div>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>
            {slowest?.duration || 0}ms
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h4 style={{ fontSize: '16px', marginBottom: '16px' }}>Timing Breakdown</h4>
        {sortedResults.map((result, index) => (
          <TimingBar
            key={index}
            label={result.strategy}
            duration={result.duration || 0}
            maxDuration={maxDuration}
            color={getColor(result.strategy)}
          />
        ))}
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '12px', 
        background: '#0b1220', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <strong>Performance Insight:</strong>
        <p style={{ marginTop: '8px', color: '#9ca3af' }}>
          {fastest && slowest && (
            <>
              <strong style={{ color: '#10b981' }}>{fastest.strategy}</strong> is{' '}
              <strong>{Math.round((slowest.duration / fastest.duration) * 10) / 10}x faster</strong> than{' '}
              <strong style={{ color: '#ef4444' }}>{slowest.strategy}</strong>{' '}
              (saved {slowest.duration - fastest.duration}ms)
            </>
          )}
        </p>
      </div>
    </div>
  )
}
