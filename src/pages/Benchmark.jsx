import { useState } from 'react'
import useMemoryCache from '../hooks/useMemoryCache'
import useFetchWithStrategy from '../hooks/useFetchWithStrategy'
import PerformanceComparison from '../components/PerformanceComparison'
import BenchmarkResult from '../components/BenchmarkResult'
import { allEndpoints } from '../data/apiEndpoints'
import { clearAllDiskCache, getAllDiskCacheKeys } from '../utils/httpCache'

const allStrategies = [
  'cache-first',
  'network-first',
  'stale-while-revalidate',
  'cache-only',
  'network-only'
]

export default function Benchmark() {
  const memoryCache = useMemoryCache()
  const { run } = useFetchWithStrategy(memoryCache)
  const [selectedEndpoint, setSelectedEndpoint] = useState(allEndpoints[0])
  const [networkDelay, setNetworkDelay] = useState(800)
  const [benchmarkResults, setBenchmarkResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [cacheStatus, setCacheStatus] = useState({ memory: 0, disk: 0 })

  const updateCacheStatus = () => {
    const status = {
      memory: memoryCache.entries().length,
      disk: getAllDiskCacheKeys().length
    }
    setCacheStatus(status)
    console.log('Cache status updated:', status)
    return status
  }

  const runBenchmark = async () => {
    console.log('=== BENCHMARK START ===')
    console.log(`Endpoint: ${selectedEndpoint.name} (${selectedEndpoint.url})`)
    console.log(`Network Delay: ${networkDelay}ms`)
    
    setIsRunning(true)
    setProgress(0)
    const results = []

    // Clear all caches first for fair comparison
    console.log('Clearing memory cache...')
    memoryCache.clear()
    
    console.log('Clearing disk cache...')
    const clearedCount = clearAllDiskCache()
    console.log(`Cleared ${clearedCount} disk cache entries`)
    
    console.log('All caches cleared. Starting benchmark...')

    for (let i = 0; i < allStrategies.length; i++) {
      const strategy = allStrategies[i]
      setProgress(((i + 1) / allStrategies.length) * 100)

      console.log(`\n--- Testing Strategy ${i + 1}/${allStrategies.length}: ${strategy} ---`)

      try {
        const result = await run({
          url: selectedEndpoint.url,
          strategy,
          networkDelay: Number(networkDelay)
        })

        console.log(`✅ ${strategy} completed:`, {
          duration: result.duration,
          source: result.source
        })

        results.push({
          strategy,
          duration: result.duration,
          source: result.source,
          success: true
        })
      } catch (error) {
        console.error(`❌ ${strategy} failed:`, error.message)
        
        results.push({
          strategy,
          duration: 0,
          source: 'error',
          error: error.message,
          success: false
        })
      }

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('\n=== BENCHMARK COMPLETE ===')
    console.log('Results:', results)
    setBenchmarkResults(results)
    setIsRunning(false)
    updateCacheStatus()
  }

  const runSecondPass = async () => {
    console.log('\n=== SECOND PASS START (Warm Cache) ===')
    console.log('Memory cache entries:', memoryCache.entries().length)
    console.log('Disk cache entries:', getAllDiskCacheKeys().length)
    
    setIsRunning(true)
    setProgress(0)
    const results = []

    // Don't clear cache for second pass - test with warm cache
    for (let i = 0; i < allStrategies.length; i++) {
      const strategy = allStrategies[i]
      setProgress(((i + 1) / allStrategies.length) * 100)

      console.log(`\n--- Testing Strategy ${i + 1}/${allStrategies.length}: ${strategy} (2nd pass) ---`)

      try {
        const result = await run({
          url: selectedEndpoint.url,
          strategy,
          networkDelay: Number(networkDelay)
        })

        console.log(`✅ ${strategy} (2nd pass) completed:`, {
          duration: result.duration,
          source: result.source
        })

        results.push({
          strategy: `${strategy} (2nd pass)`,
          duration: result.duration,
          source: result.source,
          success: true
        })
      } catch (error) {
        console.error(`❌ ${strategy} (2nd pass) failed:`, error.message)
        
        results.push({
          strategy: `${strategy} (2nd pass)`,
          duration: 0,
          source: 'error',
          error: error.message,
          success: false
        })
      }

      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('\n=== SECOND PASS COMPLETE ===')
    console.log('Results:', results)
    setBenchmarkResults([...benchmarkResults, ...results])
    setIsRunning(false)
    updateCacheStatus()
  }

  const clearAndReset = () => {
    console.log('=== CLEARING ALL CACHES ===')
    
    console.log('Clearing memory cache...')
    memoryCache.clear()
    
    console.log('Clearing disk cache...')
    const clearedCount = clearAllDiskCache()
    console.log(`Cleared ${clearedCount} disk cache entries`)
    
    console.log('Resetting results...')
    setBenchmarkResults([])
    updateCacheStatus()
    setProgress(0)
    
    console.log('✅ All caches cleared and reset complete')
  }

  return (
    <section>
      <h2>⚡ Performance Benchmark</h2>
      <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
        Test all caching strategies against the same endpoint and compare their performance.
        First run uses cold cache, second run shows warm cache behavior.
      </p>

      <div className="card">
        <h3>Benchmark Configuration</h3>
        
        <label>Select API Endpoint</label>
        <select 
          value={selectedEndpoint.id} 
          onChange={(e) => setSelectedEndpoint(allEndpoints.find(ep => ep.id === e.target.value))}
          disabled={isRunning}
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

        <label>Network Delay (ms)</label>
        <input
          type="number"
          value={networkDelay}
          onChange={(e) => setNetworkDelay(e.target.value)}
          disabled={isRunning}
          min="0"
          max="5000"
          step="100"
        />

        <div className="button-row">
          <button onClick={runBenchmark} disabled={isRunning}>
            {isRunning ? '⏳ Running...' : '🚀 Run Benchmark (Cold Cache)'}
          </button>
          {benchmarkResults.length > 0 && (
            <button onClick={runSecondPass} disabled={isRunning}>
              🔄 Run 2nd Pass (Warm Cache)
            </button>
          )}
          <button onClick={clearAndReset} disabled={isRunning}>
            🗑️ Clear & Reset
          </button>
        </div>

        <div style={{ 
          marginTop: '16px',
          padding: '12px',
          background: '#0b1220',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-around',
          fontSize: '14px'
        }}>
          <div>
            <span style={{ color: '#9ca3af' }}>Memory Cache: </span>
            <strong style={{ color: cacheStatus.memory > 0 ? '#10b981' : '#ef4444' }}>
              {cacheStatus.memory} items
            </strong>
          </div>
          <div>
            <span style={{ color: '#9ca3af' }}>Disk Cache: </span>
            <strong style={{ color: cacheStatus.disk > 0 ? '#10b981' : '#ef4444' }}>
              {cacheStatus.disk} items
            </strong>
          </div>
          <button 
            onClick={updateCacheStatus}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh Status
          </button>
        </div>

        {isRunning && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ 
              fontSize: '14px', 
              color: '#9ca3af', 
              marginBottom: '8px' 
            }}>
              Progress: {Math.round(progress)}%
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: '#1f2937',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #2563eb, #60a5fa)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}
      </div>

      {benchmarkResults.length > 0 && (
        <>
          <div className="grid-2" style={{ alignItems: 'start' }}>
            <PerformanceComparison results={benchmarkResults.filter(r => !r.strategy.includes('2nd pass'))} />
            
            <div className="card">
              <h3>Detailed Results</h3>
              <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                {benchmarkResults.map((result, index) => (
                  <BenchmarkResult key={index} result={result} />
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h3>📊 Analysis & Insights</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginTop: '16px'
            }}>
              {benchmarkResults
                .filter(r => !r.strategy.includes('2nd pass'))
                .sort((a, b) => a.duration - b.duration)
                .slice(0, 3)
                .map((result, index) => {
                  const medals = ['🥇', '🥈', '🥉']
                  return (
                    <div key={index} style={{
                      padding: '16px',
                      background: '#0b1220',
                      borderRadius: '8px',
                      border: index === 0 ? '2px solid #10b981' : '1px solid #243041'
                    }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                        {medals[index]}
                      </div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {result.strategy}
                      </div>
                      <div style={{ fontSize: '20px', color: '#10b981', fontWeight: 'bold' }}>
                        {result.duration}ms
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                        {result.source}
                      </div>
                    </div>
                  )
                })}
            </div>

            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: '#0b1220',
              borderRadius: '8px'
            }}>
              <h4 style={{ fontSize: '16px', marginBottom: '12px' }}>
                💡 Key Takeaways
              </h4>
              <ul style={{ color: '#9ca3af', paddingLeft: '20px', lineHeight: '1.8' }}>
                <li>
                  <strong style={{ color: '#60a5fa' }}>Cache-First</strong> is fastest when data is already cached
                </li>
                <li>
                  <strong style={{ color: '#60a5fa' }}>Network-Only</strong> is slowest but always fresh
                </li>
                <li>
                  <strong style={{ color: '#60a5fa' }}>Stale-While-Revalidate</strong> balances speed and freshness
                </li>
                <li>
                  Second pass shows dramatic speed improvements for cache strategies
                </li>
                <li>
                  Memory cache (⚡) is faster than disk cache (💾) which is faster than network (🌐)
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
