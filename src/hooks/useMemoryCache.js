/**
 * ⚡ MEMORY CACHE TECHNIQUE
 * 
 * Purpose: In-memory storage using JavaScript Map for ultra-fast data access
 * 
 * Key Characteristics:
 * - Speed: FASTEST (0-5ms) - Data stored in RAM
 * - Persistence: Lost on page refresh/tab close
 * - Capacity: Limited by browser memory
 * - Use Cases: Frequently accessed data during single session
 * 
 * Performance: ~1000x faster than network requests
 */

import { useRef } from 'react'

export default function useMemoryCache() {
  // useRef keeps the Map instance alive across re-renders
  // Map provides O(1) lookup time - extremely fast!
  const cacheRef = useRef(new Map())

  // Retrieve cached value by key
  // Returns: cached value or undefined if not found
  const get = (key) => cacheRef.current.get(key)

  // Store value with a key
  // Example: set('/api/users', { data: [...], duration: 1200 })
  const set = (key, value) => cacheRef.current.set(key, value)

  // Check if key exists in cache without retrieving value
  // Useful for cache hit/miss detection
  const has = (key) => cacheRef.current.has(key)

  // Clear all cached data
  // Called when user clicks "Clear Memory Cache" button
  const clear = () => cacheRef.current.clear()

  // Get all cache entries as array
  // Used for debugging and cache status display
  const entries = () => Array.from(cacheRef.current.entries())

  return { get, set, has, clear, entries }
}

/**
 * DEMO TALKING POINTS:
 * 
 * 1. "This is the FASTEST caching layer - data lives in RAM"
 * 2. "Perfect for SPA where users fetch same data multiple times"
 * 3. "Trade-off: Lost on refresh, but incredibly fast"
 * 4. "See the benchmark - 0-1ms vs 1000ms+ for network!"
 */
