export const strategies = [
  {
    id: 'cache-first',
    title: 'Cache First',
    description: 'Serve from cache if available, otherwise go to network and save it.',
    bestFor: 'Images, versioned assets, fonts'
  },
  {
    id: 'network-first',
    title: 'Network First',
    description: 'Try network first, fall back to cache when offline or slow.',
    bestFor: 'Frequently updated data'
  },
  {
    id: 'stale-while-revalidate',
    title: 'Stale While Revalidate',
    description: 'Serve cached response immediately, update cache in background.',
    bestFor: 'News feeds, dashboards, product lists'
  },
  {
    id: 'cache-only',
    title: 'Cache Only',
    description: 'Only return cached data; never hit the network.',
    bestFor: 'Offline-only resources'
  },
  {
    id: 'network-only',
    title: 'Network Only',
    description: 'Always fetch from network and never use cache.',
    bestFor: 'Sensitive, real-time, or non-cacheable endpoints'
  }
]
