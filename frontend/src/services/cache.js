const CACHE_DURATION = 5 * 60 * 1000;
const cache = {};

export async function cachedFetch(key, fetchFn) {
  const now = Date.now();
  if (cache[key] && (now - cache[key].timestamp) < CACHE_DURATION) {
    return cache[key].data;
  }
  const data = await fetchFn();  // fetchFn retourne déjà res.data
  if (data !== undefined && data !== null) {
    cache[key] = { data, timestamp: now };
  }
  return data;
}