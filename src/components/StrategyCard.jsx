export default function StrategyCard({ item }) {
  return (
    <div className="card">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <p><strong>Best for:</strong> {item.bestFor}</p>
    </div>
  )
}
