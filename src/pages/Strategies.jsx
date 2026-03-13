import StrategyCard from '../components/StrategyCard'
import FetchPanel from '../components/FetchPanel'
import { strategies } from '../data/strategies'

export default function Strategies() {
  return (
    <section>
      <h2>Caching Strategies</h2>
      <div className="card-grid">
        {strategies.map((item) => (
          <StrategyCard key={item.id} item={item} />
        ))}
      </div>
      <FetchPanel />
    </section>
  )
}
