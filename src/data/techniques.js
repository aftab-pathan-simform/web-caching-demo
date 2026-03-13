export const techniques = [
  {
    id: 'browser-cache',
    title: 'Browser Cache',
    description: 'Stores assets like JS, CSS, images, and fetch responses according to HTTP rules.',
    speed: 'Fast',
    persistence: 'Until invalidated / expired',
    offline: 'Partial',
    bestFor: 'Static assets and repeat visits'
  },
  {
    id: 'cdn-cache',
    title: 'CDN Cache',
    description: 'Caches content at edge servers closer to users to reduce latency.',
    speed: 'Very Fast',
    persistence: 'CDN policy based',
    offline: 'No',
    bestFor: 'Images, scripts, public APIs, static content'
  },
  {
    id: 'service-worker-cache',
    title: 'Service Worker Cache',
    description: 'App-controlled programmable cache for requests and offline experiences.',
    speed: 'Very Fast',
    persistence: 'Until removed / updated',
    offline: 'Yes',
    bestFor: 'PWAs and offline-first apps'
  },
  {
    id: 'memory-cache',
    title: 'Memory Cache',
    description: 'Runtime in-memory store, usually fastest but cleared on refresh.',
    speed: 'Fastest',
    persistence: 'Current tab/session only',
    offline: 'Only while app is open',
    bestFor: 'Short-lived repeated data in SPA'
  },
  {
    id: 'disk-cache',
    title: 'Disk Cache',
    description: 'Browser stores resources on disk across reloads and browser restarts.',
    speed: 'Fast',
    persistence: 'Longer-lived',
    offline: 'Partial',
    bestFor: 'Assets reused across sessions'
  },
  {
    id: 'http-cache-headers',
    title: 'HTTP Cache Headers',
    description: 'Rules sent by server to control how clients and proxies cache responses.',
    speed: 'Indirect control',
    persistence: 'Header dependent',
    offline: 'Depends on other caches',
    bestFor: 'Defining freshness and validation rules'
  }
]
