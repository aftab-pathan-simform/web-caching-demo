export default function TechniqueCard({ item }) {
  return (
    <div className="card">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <div className="meta-grid">
        <span><strong>Speed:</strong> {item.speed}</span>
        <span><strong>Persistence:</strong> {item.persistence}</span>
        <span><strong>Offline:</strong> {item.offline}</span>
        <span><strong>Best For:</strong> {item.bestFor}</span>
      </div>
    </div>
  )
}
