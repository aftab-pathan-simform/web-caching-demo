const DISK_PREFIX = 'disk-cache:'

export function getDiskCache(key) {
  const raw = localStorage.getItem(DISK_PREFIX + key)
  return raw ? JSON.parse(raw) : null
}

export function setDiskCache(key, value) {
  localStorage.setItem(DISK_PREFIX + key, JSON.stringify({
    ...value,
    cachedAt: new Date().toISOString()
  }))
}

export function clearDiskCache(key) {
  localStorage.removeItem(DISK_PREFIX + key)
}

export function clearAllDiskCache() {
  const keys = Object.keys(localStorage)
  const diskCacheKeys = keys.filter(key => key.startsWith(DISK_PREFIX))
  
  console.log(`[clearAllDiskCache] Removing ${diskCacheKeys.length} cached items`)
  diskCacheKeys.forEach(key => {
    console.log(`[clearAllDiskCache] Removing: ${key}`)
    localStorage.removeItem(key)
  })
  
  return diskCacheKeys.length
}

export function getAllDiskCacheKeys() {
  const keys = Object.keys(localStorage)
  return keys.filter(key => key.startsWith(DISK_PREFIX))
}

export function getCacheHeadersExample(strategy = 'max-age=60, stale-while-revalidate=30') {
  return {
    'Cache-Control': strategy,
    'ETag': 'W/"demo-resource-v1"',
    'Last-Modified': new Date(Date.now() - 3600 * 1000).toUTCString(),
    'Expires': new Date(Date.now() + 60 * 1000).toUTCString(),
    'Age': '12'
  }
}
