// Real free APIs for better demonstration
export const realAPIs = [
  {
    id: 'jsonplaceholder-posts',
    name: 'JSONPlaceholder Posts',
    url: 'https://jsonplaceholder.typicode.com/posts',
    description: 'Fake blog posts (100 items)',
    bestStrategy: 'stale-while-revalidate'
  },
  {
    id: 'jsonplaceholder-users',
    name: 'JSONPlaceholder Users',
    url: 'https://jsonplaceholder.typicode.com/users',
    description: 'Fake user profiles (10 items)',
    bestStrategy: 'cache-first'
  },
  {
    id: 'jsonplaceholder-photos',
    name: 'JSONPlaceholder Photos',
    url: 'https://jsonplaceholder.typicode.com/photos?_limit=20',
    description: 'Photo metadata (20 items)',
    bestStrategy: 'cache-first'
  },
  {
    id: 'github-repos',
    name: 'GitHub Trending Repos',
    url: 'https://api.github.com/repositories',
    description: 'GitHub public repositories',
    bestStrategy: 'network-first'
  },
  {
    id: 'restcountries',
    name: 'REST Countries',
    url: 'https://restcountries.com/v3.1/all',
    description: 'World countries data',
    bestStrategy: 'cache-first'
  },
  {
    id: 'coinlore',
    name: 'CoinLore Crypto Prices',
    url: 'https://api.coinlore.net/api/tickers/?start=0&limit=10',
    description: 'Live cryptocurrency prices',
    bestStrategy: 'network-first'
  },
  {
    id: 'dummyjson-products',
    name: 'DummyJSON Products',
    url: 'https://dummyjson.com/products?limit=10',
    description: 'Sample product catalog',
    bestStrategy: 'stale-while-revalidate'
  },
  {
    id: 'randomuser',
    name: 'Random User Generator',
    url: 'https://randomuser.me/api/?results=5',
    description: 'Random user profiles',
    bestStrategy: 'network-only'
  }
]

// Local mock APIs
export const localAPIs = [
  {
    id: 'local-products',
    name: 'Local Products',
    url: '/mock-api/products.json',
    description: 'Local product data (fast)',
    bestStrategy: 'cache-first'
  },
  {
    id: 'local-news',
    name: 'Local News',
    url: '/mock-api/news.json',
    description: 'Local news data (fast)',
    bestStrategy: 'stale-while-revalidate'
  },
  {
    id: 'local-profile',
    name: 'Local Profile',
    url: '/mock-api/profile.json',
    description: 'Local user profile (fast)',
    bestStrategy: 'cache-first'
  }
]

export const allEndpoints = [...localAPIs, ...realAPIs]
