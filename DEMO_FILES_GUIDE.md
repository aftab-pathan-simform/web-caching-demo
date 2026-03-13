# 📁 Demo Code Files Guide

## 🎯 Which Files to Show for Each Technique

This guide helps you know exactly which code files to show during your demo and what to explain.

---

## 1️⃣ Memory Cache (In-Memory Storage)

### File to Show:

📄 **`src/hooks/useMemoryCache.js`**

### Key Points to Explain:

- ⚡ **Fastest** caching layer (0-5ms)
- Uses JavaScript `Map()` stored in React `useRef()`
- Lives in RAM - **lost on refresh**
- Perfect for SPA where users fetch same data repeatedly

### Code Highlights:

```javascript
const cacheRef = useRef(new Map()); // Lives in memory during session
const get = (key) => cacheRef.current.get(key); // O(1) lookup - instant!
```

### Demo Actions:

1. Fetch data → show ~1200ms
2. Fetch again → show ~1ms (memory cache hit!) ⚡
3. Refresh page → cache is gone (explain trade-off)

---

## 2️⃣ Disk Cache (localStorage)

### File to Show:

📄 **`src/utils/httpCache.js`**

### Key Points to Explain:

- 💾 **Persistent** storage (survives refresh)
- Uses browser's localStorage (disk storage)
- Slower than memory (5-15ms) but still fast
- Survives browser restart

### Code Highlights:

```javascript
// Store to disk with prefix
localStorage.setItem("disk-cache:" + key, JSON.stringify(value));

// Retrieve from disk
const raw = localStorage.getItem("disk-cache:" + key);
return JSON.parse(raw);
```

### Demo Actions:

1. Fetch data → cached to disk
2. Open DevTools → Application → Local Storage → show cached data
3. Refresh page → data still there! 💾
4. Clear cache → data gone

---

## 3️⃣ Service Worker Cache (PWA Offline)

### File to Show:

📄 **`public/sw.js`**

### Key Points to Explain:

- 🔧 **Programmable proxy** between app and network
- Runs in **background**, separate thread
- Enables **true offline** functionality
- Can pre-cache assets on install

### Code Highlights:

```javascript
// Pre-cache on install
self.addEventListener("install", (event) => {
  caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS));
});

// Intercept ALL requests
self.addEventListener("fetch", (event) => {
  event.respondWith(cacheFirst(request)); // We control the response!
});
```

### Demo Actions:

1. Open DevTools → Application → Service Workers → show registered
2. Fetch data normally
3. **Go offline** (Network tab → Offline)
4. Fetch again → **IT STILL WORKS!** 🎉 (offline support)
5. Show Cache Storage in DevTools

---

## 4️⃣ HTTP Cache Headers (Server-Side Rules)

### File to Show:

📄 **`src/utils/httpCache.js`** (scroll to `getCacheHeadersExample()`)

### Key Points to Explain:

- 📋 Server tells browser **HOW** to cache
- Controls browser cache, CDN cache, proxy cache
- Different directives for different needs

### Code Highlights:

```javascript
{
  'Cache-Control': 'max-age=60, stale-while-revalidate=30',
  'ETag': 'W/"demo-resource-v1"',
  'Last-Modified': '2026-03-13T10:00:00Z',
  'Expires': '2026-03-13T11:00:00Z'
}
```

### Demo Actions:

1. Open DevTools → Network tab
2. Fetch API → click request → show Headers tab
3. Point out Cache-Control, ETag, Expires
4. Explain: "Server controls caching with these headers"

---

## 5️⃣ Caching Strategies (Implementation)

### File to Show:

📄 **`src/hooks/useFetchWithStrategy.js`**

### Key Points to Explain:

All 5 strategies in one file - easy comparison!

#### Strategy 1: Cache-First

```javascript
// Check cache → return if found → else network
if (memoryHit) return cached; // 1ms ⚡
if (diskHit) return cached; // 10ms 💾
return await fetch(url); // 1200ms 🌐
```

#### Strategy 2: Network-First

```javascript
// Always try network first → fallback to cache if offline
try {
  return await fetch(url); // Always fresh!
} catch {
  return cached; // Offline fallback
}
```

#### Strategy 3: Stale-While-Revalidate (⭐ Best UX!)

```javascript
// Return cache immediately → update in background
if (cached) {
  fetch(url).then((fresh) => cache.set(url, fresh)); // Background refresh
  return cached; // Instant response!
}
```

#### Strategy 4: Cache-Only

```javascript
// Only return from cache, never hit network
if (cached) return cached;
throw new Error("Not cached");
```

#### Strategy 5: Network-Only

```javascript
// Always network, ignore cache completely
return await fetch(url); // Always slow, always fresh
```

### Demo Actions:

1. Go to `/benchmark` page
2. Run benchmark → show visual timing comparison
3. Point out: cache-first 2nd pass = **0-1ms** vs network-only = **1200ms**
4. That's **1200x faster!** 🚀

---

## 6️⃣ Network Delay Simulation

### File to Show:

📄 **`src/utils/fakeNetwork.js`**

### Key Points to Explain:

- Simulates slow network for demo purposes
- Shows **real timing** measurements
- Highlights benefit of caching

### Code Highlights:

```javascript
const start = performance.now();
await new Promise((resolve) => setTimeout(resolve, delay)); // Simulate slow network
const response = await fetch(url);
const duration = Math.round(performance.now() - start);
```

### Demo Actions:

1. Adjust network delay slider: 0ms → 2000ms
2. Show how cache always beats network
3. Even with 0ms delay, cache is faster!

---

## 🎬 Complete Demo Flow (15 minutes)

### Part 1: Concepts (3 min)

1. Show `/` home page - explain 6 techniques
2. Show `/techniques` - click through cards

### Part 2: Memory Cache (2 min)

1. Open `useMemoryCache.js` - explain code
2. Go to `/strategies` page
3. Fetch → 1200ms, Fetch again → 1ms ⚡
4. Explain: "Look at that speed improvement!"

### Part 3: Disk Cache (2 min)

1. Open `httpCache.js` - explain localStorage
2. Refresh page → memory cleared
3. Fetch → 10ms from disk cache 💾
4. Show DevTools → Local Storage

### Part 4: Service Worker (3 min)

1. Open `public/sw.js` - explain intercepting requests
2. Show DevTools → Application → Service Workers
3. **Go offline** → fetch still works! 🎉
4. Explain: "This is how PWAs work offline"

### Part 5: Strategies (3 min)

1. Open `useFetchWithStrategy.js`
2. Go to `/benchmark` page
3. Run benchmark → show results
4. Explain: "Cache-first is 1000x faster than network!"

### Part 6: Live Demo (2 min)

1. Select real API: "JSONPlaceholder Posts"
2. Show network delay: 800ms
3. First fetch → slow
4. Second fetch → instant! ⚡
5. Point to console logs showing cache hits

---

## 💡 Pro Tips for Demo

### Before Demo:

- ✅ Clear all caches (use "Clear & Reset" button)
- ✅ Open DevTools → Console (for logs)
- ✅ Open DevTools → Application tab (for cache inspection)
- ✅ Set network delay to 1000ms (shows benefit clearly)

### During Demo:

- 📊 Keep Console open - logs are very helpful!
- 🎨 Use the visual timing bars in benchmark
- 🔄 Compare 1st pass (cold) vs 2nd pass (warm)
- 📱 Show offline mode to prove Service Worker works

### Key Phrases:

- "Watch the timing - 1200ms down to 1ms!"
- "This is 1000x faster with caching"
- "Even offline, the app still works"
- "Different strategies for different content"
- "Memory cache is fastest, but lost on refresh"
- "Service Worker makes true offline apps possible"

---

## 📂 File Structure Summary

```
Demo Code Files:
├─ src/hooks/
│  ├─ useMemoryCache.js          ⚡ Memory cache (0-5ms)
│  └─ useFetchWithStrategy.js    🎯 All 5 strategies
├─ src/utils/
│  ├─ httpCache.js               💾 Disk cache (localStorage)
│  └─ fakeNetwork.js             🌐 Network simulation
└─ public/
   └─ sw.js                       🔧 Service Worker (offline)

Demo Pages:
├─ / (home)                       Overview + guide
├─ /techniques                    Explain 6 techniques
├─ /strategies                    Interactive testing
├─ /benchmark                     Performance comparison ⭐
└─ /compare                       Quick reference table
```

---

## 🎯 Key Takeaways for Audience

1. **Memory Cache** → Fastest but temporary
2. **Disk Cache** → Fast and persistent
3. **Service Worker** → Enables offline apps
4. **HTTP Headers** → Server controls caching
5. **Strategies** → Different needs, different strategies
6. **Performance** → 1000x speed improvement is real!

**The demo proves caching is not just theory - it's a massive performance win!** 🚀

---

**Files are ready! Start your demo with confidence!** ✨
