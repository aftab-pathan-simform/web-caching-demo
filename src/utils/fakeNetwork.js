export async function delayedFetch(url, delay = 1200) {
  console.log(`[delayedFetch] Starting fetch for ${url} with ${delay}ms delay`)
  const start = performance.now()
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, delay))
  
  // Actually fetch the data
  const fetchStart = performance.now()
  const response = await fetch(url)
  const data = await response.json()
  const fetchEnd = performance.now()
  
  const end = performance.now()
  const totalDuration = Math.round(end - start)
  const actualFetchTime = Math.round(fetchEnd - fetchStart)

  console.log(`[delayedFetch] Completed:`, {
    url,
    delay,
    actualFetchTime,
    totalDuration
  })

  return {
    data,
    duration: totalDuration,
    source: 'network'
  }
}
