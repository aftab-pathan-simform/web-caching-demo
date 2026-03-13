export default function BenchmarkResult({ result }) {
  if (!result) return null

  const getStatusColor = (source) => {
    if (source.includes('cache')) return '#10b981'
    if (source.includes('network')) return '#f59e0b'
    return '#9ca3af'
  }

  const getStatusIcon = (source) => {
    if (source.includes('memory cache')) return '⚡'
    if (source.includes('disk cache')) return '💾'
    if (source.includes('stale')) return '🔄'
    if (source.includes('network')) return '🌐'
    return '📦'
  }

  return (
    <div style={{
      padding: '12px',
      background: '#1f2937',
      borderRadius: '8px',
      marginBottom: '8px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span style={{ fontWeight: 'bold' }}>{result.strategy}</span>
        <span style={{ 
          padding: '4px 8px', 
          background: '#0b1220', 
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: result.duration < 100 ? '#10b981' : result.duration < 500 ? '#f59e0b' : '#ef4444'
        }}>
          {result.duration}ms
        </span>
      </div>
      <div style={{ 
        fontSize: '13px', 
        color: getStatusColor(result.source)
      }}>
        {getStatusIcon(result.source)} {result.source}
      </div>
      {result.error && (
        <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
          ❌ {result.error}
        </div>
      )}
    </div>
  )
}
