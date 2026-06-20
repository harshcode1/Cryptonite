import { NextResponse } from 'next/server';

const cache = new Map();
const CACHE_EXPIRATION = 300 * 1000; // 5 minutes

const FALLBACK = {
  total_market_cap: { usd: 2500000000000 },
  total_volume: { usd: 50000000000 },
  market_cap_percentage: { btc: 50, eth: 20 },
  market_cap_change_percentage_24h_usd: 0,
};

export async function GET() {
  const cacheKey = 'global';
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && now - cached.timestamp < CACHE_EXPIRATION) {
    return NextResponse.json({
      data: cached.data,
      cached: true,
      age: Math.round((now - cached.timestamp) / 1000),
    });
  }

  try {
    const response = await fetch('https://api.coingecko.com/api/v3/global');

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const json = await response.json();
    cache.set(cacheKey, { data: json.data, timestamp: now });

    return NextResponse.json({ data: json.data, cached: false });
  } catch {
    if (cached) {
      return NextResponse.json({ data: cached.data, cached: true, stale: true });
    }
    return NextResponse.json({ data: FALLBACK, cached: false, fallback: true });
  }
}
