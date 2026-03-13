export default function DemoGuide() {
  return (
    <div className="card">
      <h3>📖 How to Use This Demo</h3>
      
      <div style={{ marginTop: '16px' }}>
        <h4 style={{ fontSize: '16px', marginBottom: '8px', color: '#60a5fa' }}>
          Step 1: Understanding Caching Techniques
        </h4>
        <p style={{ marginBottom: '12px', color: '#9ca3af' }}>
          Visit the <strong>Caching Techniques</strong> page to learn about different types of caching: 
          Browser Cache, Service Worker Cache, Memory Cache, Disk Cache, CDN Cache, and HTTP Headers.
        </p>
      </div>

      <div style={{ marginTop: '16px' }}>
        <h4 style={{ fontSize: '16px', marginBottom: '8px', color: '#60a5fa' }}>
          Step 2: Interactive Strategy Testing
        </h4>
        <p style={{ marginBottom: '12px', color: '#9ca3af' }}>
          Go to <strong>Caching Strategies</strong> page and use the simulator:
        </p>
        <ul style={{ color: '#9ca3af', paddingLeft: '20px' }}>
          <li>Select an API endpoint (local or real external APIs)</li>
          <li>Choose a caching strategy</li>
          <li>Adjust network delay to simulate slow connections</li>
          <li>Click "Fetch Data" and observe timing</li>
          <li>Check the Request Log to see what happened</li>
        </ul>
      </div>

      <div style={{ marginTop: '16px' }}>
        <h4 style={{ fontSize: '16px', marginBottom: '8px', color: '#60a5fa' }}>
          Step 3: Run Benchmarks
        </h4>
        <p style={{ marginBottom: '12px', color: '#9ca3af' }}>
          Visit the <strong>Benchmark</strong> page to:
        </p>
        <ul style={{ color: '#9ca3af', paddingLeft: '20px' }}>
          <li>Test all strategies against the same endpoint</li>
          <li>See visual timing comparisons</li>
          <li>Understand which strategy is fastest</li>
          <li>Compare cache hits vs network requests</li>
        </ul>
      </div>

      <div style={{ marginTop: '16px' }}>
        <h4 style={{ fontSize: '16px', marginBottom: '8px', color: '#60a5fa' }}>
          Step 4: Test Offline Behavior
        </h4>
        <p style={{ marginBottom: '12px', color: '#9ca3af' }}>
          Open DevTools → Network tab → Enable "Offline" mode to see how Service Worker 
          and cached strategies continue to work without internet connection.
        </p>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '12px', 
        background: '#0b1220', 
        borderRadius: '8px',
        border: '1px solid #2563eb'
      }}>
        <strong style={{ color: '#60a5fa' }}>💡 Pro Tip:</strong>
        <p style={{ marginTop: '8px', color: '#9ca3af', fontSize: '14px' }}>
          Try fetching the same endpoint multiple times with different strategies. 
          Notice how cache-first is instant on repeat, while network-only is always slow. 
          Stale-while-revalidate gives you the best of both worlds!
        </p>
      </div>
    </div>
  )
}
