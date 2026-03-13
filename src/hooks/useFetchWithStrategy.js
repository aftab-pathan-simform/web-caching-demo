import { useState } from 'react'
import { delayedFetch } from '../utils/fakeNetwork'
import { getDiskCache, setDiskCache } from '../utils/httpCache'

export default function useFetchWithStrategy(memoryCache) {
  const [loading, setLoading] = useState(false)
  const [log, setLog] = useState([])

  const addLog = (message) => {
    setLog((prev) => [
      { id: crypto.randomUUID(), message, at: new Date().toLocaleTimeString() },
      ...prev
    ])
  }

  const run = async ({ url, strategy, networkDelay = 1200 }) => {
    const startTime = performance.now()
    const memoryHit = memoryCache.has(url)
    const diskHit = getDiskCache(url)

    console.log(`[${strategy}] Starting fetch for: ${url}`)
    console.log(`[${strategy}] Memory hit: ${memoryHit}, Disk hit: ${!!diskHit}`)

    setLoading(true)

    try {
      if (strategy === 'cache-first') {
        if (memoryHit) {
          const cached = memoryCache.get(url)
          const duration = Math.round(performance.now() - startTime)
          addLog(`Cache First → Memory cache hit (${duration}ms)`)
          console.log(`[cache-first] Memory cache hit, duration: ${duration}ms`)
          return { 
            data: cached.data, 
            duration, 
            source: 'memory cache' 
          }
        }
        if (diskHit) {
          const duration = Math.round(performance.now() - startTime)
          addLog(`Cache First → Disk cache hit (${duration}ms)`)
          console.log(`[cache-first] Disk cache hit, duration: ${duration}ms`)
          memoryCache.set(url, diskHit)
          return { 
            data: diskHit.data, 
            duration, 
            source: 'disk cache' 
          }
        }
        addLog('Cache First → Cache miss, fetching network')
        console.log(`[cache-first] Cache miss, fetching from network`)
        const result = await delayedFetch(url, networkDelay)
        console.log(`[cache-first] Network fetch completed: ${result.duration}ms`)
        memoryCache.set(url, result)
        setDiskCache(url, result)
        return result
      }

      if (strategy === 'network-first') {
        try {
          addLog('Network First → Trying network')
          console.log(`[network-first] Attempting network fetch`)
          const result = await delayedFetch(url, networkDelay)
          console.log(`[network-first] Network fetch completed: ${result.duration}ms`)
          memoryCache.set(url, result)
          setDiskCache(url, result)
          return result
        } catch (error) {
          console.log(`[network-first] Network failed, checking cache fallback`)
          addLog('Network First → Network failed, fallback cache')
          if (memoryHit) {
            const cached = memoryCache.get(url)
            const duration = Math.round(performance.now() - startTime)
            console.log(`[network-first] Using memory cache fallback: ${duration}ms`)
            return { 
              data: cached.data, 
              duration, 
              source: 'memory cache fallback' 
            }
          }
          if (diskHit) {
            const duration = Math.round(performance.now() - startTime)
            console.log(`[network-first] Using disk cache fallback: ${duration}ms`)
            return { 
              data: diskHit.data, 
              duration, 
              source: 'disk cache fallback' 
            }
          }
          throw error
        }
      }

      if (strategy === 'stale-while-revalidate') {
        if (memoryHit || diskHit) {
          const cached = memoryHit ? memoryCache.get(url) : diskHit
          const duration = Math.round(performance.now() - startTime)
          addLog(`SWR → Serving stale cache immediately (${duration}ms)`)
          console.log(`[stale-while-revalidate] Serving stale cache: ${duration}ms`)
          
          // Background revalidation
          delayedFetch(url, networkDelay).then((fresh) => {
            console.log(`[stale-while-revalidate] Background refresh completed: ${fresh.duration}ms`)
            memoryCache.set(url, fresh)
            setDiskCache(url, fresh)
            addLog('SWR → Cache updated in background')
          }).catch(err => {
            console.error(`[stale-while-revalidate] Background refresh failed:`, err)
          })
          
          return { 
            data: cached.data, 
            duration, 
            source: memoryHit ? 'memory stale cache' : 'disk stale cache' 
          }
        }

        addLog('SWR → No cache, fetching from network')
        console.log(`[stale-while-revalidate] No cache, fetching from network`)
        const result = await delayedFetch(url, networkDelay)
        console.log(`[stale-while-revalidate] Network fetch completed: ${result.duration}ms`)
        memoryCache.set(url, result)
        setDiskCache(url, result)
        return result
      }

      if (strategy === 'cache-only') {
        if (memoryHit) {
          const cached = memoryCache.get(url)
          const duration = Math.round(performance.now() - startTime)
          addLog(`Cache Only → Memory cache hit (${duration}ms)`)
          console.log(`[cache-only] Memory cache hit: ${duration}ms`)
          return { 
            data: cached.data, 
            duration, 
            source: 'memory cache' 
          }
        }
        if (diskHit) {
          const duration = Math.round(performance.now() - startTime)
          addLog(`Cache Only → Disk cache hit (${duration}ms)`)
          console.log(`[cache-only] Disk cache hit: ${duration}ms`)
          return { 
            data: diskHit.data, 
            duration, 
            source: 'disk cache' 
          }
        }
        console.log(`[cache-only] No cache found, throwing error`)
        throw new Error('Cache Only → Resource not found in cache')
      }

      if (strategy === 'network-only') {
        addLog('Network Only → Always fetching network')
        console.log(`[network-only] Fetching from network`)
        const result = await delayedFetch(url, networkDelay)
        console.log(`[network-only] Network fetch completed: ${result.duration}ms`)
        return result
      }

      throw new Error('Unknown strategy')
    } finally {
      setLoading(false)
    }
  }

  return { run, loading, log, setLog }
}
