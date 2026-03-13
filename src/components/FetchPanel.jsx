import { useState } from 'react'
import useMemoryCache from '../hooks/useMemoryCache'
import useFetchWithStrategy from '../hooks/useFetchWithStrategy'
import RequestLog from './RequestLog'
import { allEndpoints } from '../data/apiEndpoints'
import { clearAllDiskCache } from '../utils/httpCache'

const strategies = [
  'cache-first',
  'network-first',
  'stale-while-revalidate',
  'cache-only',
  'network-only'
]

export default function FetchPanel() {
  const memoryCache = useMemoryCache()
  const { run, loading, log } = useFetchWithStrategy(memoryCache)
  const [selectedEndpoint, setSelectedEndpoint] = useState(allEndpoints[0])
  const [strategy, setStrategy] = useState(strategies[0])
  const [networkDelay, setNetworkDelay] = useState(1200)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFetch = async () => {
    setError('')
    try {
      const response = await run({ 
        url: selectedEndpoint.url, 
        strategy, 
        networkDelay: Number(networkDelay) 
      })
      setResult(response)
    } catch (err) {
      setError(err.message)
      setResult(null)
    }
  }

  const handleClearAll = () => {
    console.log('Clearing all caches from FetchPanel')
    memoryCache.clear()
    const cleared = clearAllDiskCache()
    console.log(`Cleared ${cleared} disk cache entries`)
    setResult(null)
    setError('')
  }

  return (
    <div className="grid-2">
      <div className="card">
        <h3>Interactive Strategy Simulator</h3>

        <label>API Endpoint</label>
        <select 
          value={selectedEndpoint.id} 
          onChange={(e) => setSelectedEndpoint(allEndpoints.find(ep => ep.id === e.target.value))}
        >
          <optgroup label="Local APIs (Fast)">
            {allEndpoints.filter(ep => ep.url.startsWith('/')).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.description}
              </option>
            ))}
          </optgroup>
          <optgroup label="Real External APIs">
            {allEndpoints.filter(ep => !ep.url.startsWith('/')).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.description}
              </option>
            ))}
          </optgroup>
        </select>

        {selectedEndpoint.bestStrategy && (
          <div style={{ 
            marginTop: '8px', 
            padding: '8px', 
            background: '#0b1220', 
            borderRadius: '4px',
            fontSize: '13px',
            color: '#9ca3af'
          }}>
            💡 Recommended: <strong style={{ color: '#60a5fa' }}>{selectedEndpoint.bestStrategy}</strong>
          </div>
        )}

        <label>Caching Strategy</label>
        <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
          {strategies.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>

        <label>Simulated network delay (ms)</label>
        <input
          type="number"
          value={networkDelay}
          onChange={(e) => setNetworkDelay(e.target.value)}
          min="0"
          max="5000"
          step="100"
        />

        <div className="button-row">
          <button onClick={handleFetch} disabled={loading}>
            {loading ? '⏳ Loading...' : '🚀 Fetch Data'}
          </button>
          <button onClick={() => memoryCache.clear()}>
            🗑️ Clear Memory
          </button>
          <button onClick={handleClearAll}>
            🧹 Clear All Cache
          </button>
        </div>

        {error && <p className="error">❌ {error}</p>}

        {result && (
          <div className="result-box">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: '1px solid #243041'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Source</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#60a5fa' }}>
                  {result.source}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Duration</div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold',
                  color: result.duration < 100 ? '#10b981' : result.duration < 500 ? '#f59e0b' : '#ef4444'
                }}>
                  {result.duration ?? 0} ms
                </div>
              </div>
            </div>
            
            <details>
              <summary style={{ cursor: 'pointer', marginBottom: '8px', color: '#60a5fa' }}>
                📄 View Response Data
              </summary>
              <pre style={{ 
                maxHeight: '300px', 
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      <RequestLog items={log} />
    </div>
  )
}
