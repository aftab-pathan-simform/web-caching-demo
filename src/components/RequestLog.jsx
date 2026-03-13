export default function RequestLog({ items }) {
  return (
    <div className="card">
      <h3>Request Log</h3>
      {items.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <ul className="log-list">
          {items.map((item) => (
            <li key={item.id}>{item.at} — {item.message}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
