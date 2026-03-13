import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Techniques from './pages/Techniques'
import Strategies from './pages/Strategies'
import Compare from './pages/Compare'
import Benchmark from './pages/Benchmark'

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Web Caching Lab</h1>
        <nav>
          <NavLink to="/">Overview</NavLink>
          <NavLink to="/techniques">Caching Techniques</NavLink>
          <NavLink to="/strategies">Caching Strategies</NavLink>
          <NavLink to="/benchmark">Benchmark</NavLink>
          <NavLink to="/compare">Comparison UI</NavLink>
        </nav>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/techniques" element={<Techniques />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/benchmark" element={<Benchmark />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </main>
    </div>
  )
}
