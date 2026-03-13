import { useRef } from 'react'

export default function useMemoryCache() {
  const cacheRef = useRef(new Map())

  const get = (key) => cacheRef.current.get(key)
  const set = (key, value) => cacheRef.current.set(key, value)
  const has = (key) => cacheRef.current.has(key)
  const clear = () => cacheRef.current.clear()
  const entries = () => Array.from(cacheRef.current.entries())

  return { get, set, has, clear, entries }
}
