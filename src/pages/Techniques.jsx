import TechniqueCard from '../components/TechniqueCard'
import { techniques } from '../data/techniques'

export default function Techniques() {
  return (
    <section>
      <h2>Caching Techniques</h2>
      <div className="card-grid">
        {techniques.map((item) => (
          <TechniqueCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}
