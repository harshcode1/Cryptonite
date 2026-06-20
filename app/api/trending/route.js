import { NextResponse } from 'next/server';

const cache = new Map();
const CACHE_EXPIRATION = 300 * 1000; // 5 minutes

export async function GET() {
  const cacheKey = 'trending';
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && now - cached.timestamp < CACHE_EXPIRATION) {
    return NextResponse.json({
      coins: cached.data,
      cached: true,
      age: Math.round((now - cached.timestamp) / 1000),
    });
  }

  try {
    const response = await fetch('https://api.coingecko.com/api/v3/search/trending');

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const json = await response.json();
    const coins = json.coins || [];
    cache.set(cacheKey, { data: coins, timestamp: now });

    return NextResponse.json({ coins, cached: false });
  } catch {
    if (cached) {
      return NextResponse.json({ coins: cached.data, cached: true, stale: true });
    }
    return NextResponse.json({ coins: [], cached: false, fallback: true });
  }
}
