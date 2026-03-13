export default function TimingBar({ label, duration, maxDuration, color = '#2563eb' }) {
  const percentage = maxDuration > 0 ? (duration / maxDuration) * 100 : 0
  
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '4px',
        fontSize: '14px'
      }}>
        <span>{label}</span>
        <span><strong>{duration}ms</strong></span>
      </div>
      <div style={{
        width: '100%',
        height: '24px',
        background: '#1f2937',
        borderRadius: '4px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${Math.min(percentage, 100)}%`,
          height: '100%',
          background: color,
          transition: 'width 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '8px',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {percentage > 15 ? `${Math.round(percentage)}%` : ''}
        </div>
      </div>
    </div>
  )
}
