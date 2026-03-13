/**
 * 🎯 CACHING STRATEGIES IMPLEMENTATION
 * 
 * This file demonstrates 5 common caching strategies used in modern web apps.
 * Each strategy has different trade-offs between speed, freshness, and resilience.
 * 
 * STRATEGIES OVERVIEW:
 * 
 * 1. CACHE-FIRST: Check cache → return if found → else fetch & cache
 *    - Speed: ⚡⚡⚡ (instant on cache hit)
 *    - Freshness: ⚠️ (may serve stale data)
 *    - Best for: Static assets, versioned files, images
 * 
 * 2. NETWORK-FIRST: Fetch from network → fallback to cache if offline
 *    - Speed: 🐌 (always hits network first)
 *    - Freshness: ✅ (always fresh when online)
 *    - Best for: Real-time data, stock prices, user profile
 * 
 * 3. STALE-WHILE-REVALIDATE: Return cache immediately → update in background
 *    - Speed: ⚡⚡⚡ (instant response)
 *    - Freshness: ✅ (fresh on next request)
 *    - Best for: News feeds, product lists, dashboards
 * 
 * 4. CACHE-ONLY: Only return cached data, never touch network
 *    - Speed: ⚡⚡⚡ (instant or error)
 *    - Freshness: ⚠️ (never updates)
 *    - Best for: Offline-only mode, pre-cached content
 * 
 * 5. NETWORK-ONLY: Always fetch from network, ignore cache completely
 *    - Speed: 🐌 (always slow)
 *    - Freshness: ✅ (always fresh)
 *    - Best for: Authentication, payments, sensitive data
 * 
 * PERFORMANCE TIMING:
 * - Memory cache: 0-5ms ⚡
 * - Disk cache: 5-15ms 💾
 * - Network: 100-2000ms 🌐 (depends on connection)
 */

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
    // Start timing to measure actual cache/network performance
    const startTime = performance.now()
    
    // Check both cache layers
    const memoryHit = memoryCache.has(url)
    const diskHit = getDiskCache(url)

    console.log(`[${strategy}] Starting fetch for: ${url}`)
    console.log(`[${strategy}] Memory hit: ${memoryHit}, Disk hit: ${!!diskHit}`)

    setLoading(true)

    try {
      // ==========================================
      // STRATEGY 1: CACHE-FIRST
      // ==========================================
      // Check cache layers in order: Memory → Disk → Network
      // Fast but may serve stale data
      if (strategy === 'cache-first') {
        // Level 1: Check memory cache (fastest - 0-5ms)
        if (memoryHit) {
          const cached = memoryCache.get(url)
          const duration = Math.round(performance.now() - startTime)
          addLog(`Cache First → Memory cache hit (${duration}ms)`)
          console.log(`[cache-first] Memory cache hit, duration: ${duration}ms`)
          return { 
            data: cached.data, 
            duration, // Actual time to retrieve from memory
            source: 'memory cache' 
          }
        }
        
        // Level 2: Check disk cache (faster - 5-15ms)
        if (diskHit) {
          const duration = Math.round(performance.now() - startTime)
          addLog(`Cache First → Disk cache hit (${duration}ms)`)
          console.log(`[cache-first] Disk cache hit, duration: ${duration}ms`)
          
          // Promote to memory cache for faster future access
          memoryCache.set(url, diskHit)
          
          return { 
            data: diskHit.data, 
            duration, // Actual time to retrieve from disk
            source: 'disk cache' 
          }
        }
        
        // Level 3: No cache found - fetch from network (slowest - 100-2000ms)
        addLog('Cache First → Cache miss, fetching network')
        console.log(`[cache-first] Cache miss, fetching from network`)
        const result = await delayedFetch(url, networkDelay)
        console.log(`[cache-first] Network fetch completed: ${result.duration}ms`)
        
        // Store in both cache layers for future requests
        memoryCache.set(url, result)
        setDiskCache(url, result)
        
        return result
      }

      // ==========================================
      // STRATEGY 2: NETWORK-FIRST
      // ==========================================
      // Always try network first, use cache only as fallback
      // Ensures fresh data but slower. Best for: real-time data, user profiles
      if (strategy === 'network-first') {
        try {
          // Step 1: Always attempt network fetch first (slow but fresh)
          addLog('Network First → Trying network')
          console.log(`[network-first] Attempting network fetch`)
          const result = await delayedFetch(url, networkDelay)
          console.log(`[network-first] Network fetch completed: ${result.duration}ms`)
          
          // Step 2: Cache successful network response for offline fallback
          memoryCache.set(url, result)
          setDiskCache(url, result)
          return result
        } catch (error) {
          // If network fails (offline/error), fall back to cache
          console.log(`[network-first] Network failed, checking cache fallback`)
          addLog('Network First → Network failed, fallback cache')
          
          // Try memory cache first (faster)
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
          
          // Fall back to disk cache if memory miss
          if (diskHit) {
            const duration = Math.round(performance.now() - startTime)
            console.log(`[network-first] Using disk cache fallback: ${duration}ms`)
            return { 
              data: diskHit.data, 
              duration, 
              source: 'disk cache fallback' 
            }
          }
          
          // No cache available - throw error
          throw error
        }
      }

      // ==========================================
      // STRATEGY 3: STALE-WHILE-REVALIDATE (⭐ BEST UX!)
      // ==========================================
      // Return cached data instantly, then update cache in background
      // Perfect balance of speed and freshness. Best for: dashboards, news feeds
      if (strategy === 'stale-while-revalidate') {
        // Check if we have ANY cached version (even if stale)
        if (memoryHit || diskHit) {
          const cached = memoryHit ? memoryCache.get(url) : diskHit
          const duration = Math.round(performance.now() - startTime)
          addLog(`SWR → Serving stale cache immediately (${duration}ms)`)
          console.log(`[stale-while-revalidate] Serving stale cache: ${duration}ms`)
          
          // ⚡ MAGIC: Return stale cache immediately (instant response!)
          // Then update cache in background for next request
          delayedFetch(url, networkDelay).then((fresh) => {
            console.log(`[stale-while-revalidate] Background refresh completed: ${fresh.duration}ms`)
            
            // Update both cache layers silently in background
            memoryCache.set(url, fresh)
            setDiskCache(url, fresh)
            addLog('SWR → Cache updated in background')
            // User already got their data - this refresh is for NEXT request!
          }).catch(err => {
            console.error(`[stale-while-revalidate] Background refresh failed:`, err)
            // Silent failure - user already has stale data which is better than nothing
          })
          
          return { 
            data: cached.data, 
            duration, // Instant! 0-15ms
            source: memoryHit ? 'memory stale cache' : 'disk stale cache' 
          }
        }

        // No cache available - fetch from network (first time request)
        addLog('SWR → No cache, fetching from network')
        console.log(`[stale-while-revalidate] No cache, fetching from network`)
        const result = await delayedFetch(url, networkDelay)
        console.log(`[stale-while-revalidate] Network fetch completed: ${result.duration}ms`)
        
        // Cache for future stale-while-revalidate's
        memoryCache.set(url, result)
        setDiskCache(url, result)
        return result
      }

      // ==========================================
      // STRATEGY 4: CACHE-ONLY
      // ==========================================
      // NEVER touch network - only return cached data or error
      // Best for: offline-only mode, pre-cached content
      if (strategy === 'cache-only') {
        // Check memory cache first
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
        
        // Check disk cache if memory miss
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
        
        // No cache found - throw error (never fetch from network!)
        console.log(`[cache-only] No cache found, throwing error`)
        throw new Error('Cache Only → Resource not found in cache')
      }

      // ==========================================
      // STRATEGY 5: NETWORK-ONLY
      // ==========================================
      // NEVER use cache - always fetch fresh from network
      // Slowest but guarantees freshness. Best for: auth, payments, sensitive data
      if (strategy === 'network-only') {
        // Ignore ALL caches - always hit network for fresh data
        addLog('Network Only → Always fetching network')
        console.log(`[network-only] Fetching from network`)
        const result = await delayedFetch(url, networkDelay)
        console.log(`[network-only] Network fetch completed: ${result.duration}ms`)
        
        // Note: We don't cache the result on purpose!
        // Next request will hit network again (always fresh, always slow)
        return result
      }

      // Unknown strategy - should never reach here
      throw new Error('Unknown strategy')
    } finally {
      setLoading(false)
    }
  }

  return { run, loading, log, setLog }
}
