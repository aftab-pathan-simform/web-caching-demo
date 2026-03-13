import DemoGuide from '../components/DemoGuide'

export default function Home() {
  return (
    <section>
      <h2>Frontend Web Caching Techniques</h2>
      <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
        This interactive demo explains where caching happens in frontend systems, how common caching
        strategies behave, and when to use each one. Test with real APIs and see actual performance differences!
      </p>
      
      <div className="card">
        <h3>What you can demonstrate</h3>
        <ul style={{ lineHeight: '1.8', color: '#9ca3af' }}>
          <li>✅ Runtime memory cache inside React app</li>
          <li>✅ Disk-like persistence with localStorage</li>
          <li>✅ Service worker interception and offline cache</li>
          <li>✅ HTTP header driven caching behavior</li>
          <li>✅ Strategy comparison for freshness vs performance</li>
          <li>✅ Real-time performance benchmarks</li>
          <li>✅ Multiple real external APIs for testing</li>
        </ul>
      </div>

      <DemoGuide />

      <div className="card">
        <h3>🎯 Quick Start</h3>
        <div style={{ 
          display: 'grid', 
          gap: '12px',
          marginTop: '12px'
        }}>
          <div style={{ 
            padding: '12px', 
            background: '#0b1220', 
            borderRadius: '8px',
            borderLeft: '3px solid #2563eb'
          }}>
            <strong style={{ color: '#60a5fa' }}>1. Learn the Basics</strong>
            <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#9ca3af' }}>
              Go to <strong>Caching Techniques</strong> to understand different caching layers
            </p>
          </div>
          
          <div style={{ 
            padding: '12px', 
            background: '#0b1220', 
            borderRadius: '8px',
            borderLeft: '3px solid #8b5cf6'
          }}>
            <strong style={{ color: '#a78bfa' }}>2. Try Interactive Testing</strong>
            <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#9ca3af' }}>
              Visit <strong>Caching Strategies</strong> to manually test each strategy
            </p>
          </div>
          
          <div style={{ 
            padding: '12px', 
            background: '#0b1220', 
            borderRadius: '8px',
            borderLeft: '3px solid #10b981'
          }}>
            <strong style={{ color: '#34d399' }}>3. Run Performance Tests</strong>
            <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#9ca3af' }}>
              Check <strong>Benchmark</strong> to compare all strategies with timing charts
            </p>
          </div>
          
          <div style={{ 
            padding: '12px', 
            background: '#0b1220', 
            borderRadius: '8px',
            borderLeft: '3px solid #f59e0b'
          }}>
            <strong style={{ color: '#fbbf24' }}>4. Review Comparisons</strong>
            <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#9ca3af' }}>
              See <strong>Comparison UI</strong> for quick reference tables
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
