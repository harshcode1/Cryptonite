import { NextResponse } from 'next/server';

const cache = new Map();
const CACHE_EXPIRATION = 300 * 1000;

export async function GET(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  const days = searchParams.get('days') || '7';
  const vs_currency = searchParams.get('vs_currency') || 'usd';
  const cacheKey = `${id}-${days}-${vs_currency}`;

  try {
    const now = Date.now();
    const cached = cache.get(cacheKey);

    if (cached && (now - cached.timestamp) < CACHE_EXPIRATION) {
      return NextResponse.json({ data: cached.data, cached: true, age: Math.round((now - cached.timestamp) / 1000) });
    }

    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${vs_currency}&days=${days}`);
    if (!response.ok) throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);

    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: now });

    return NextResponse.json({ data, cached: false, timestamp: now });
  } catch (error) {
    console.error('Error fetching chart data for', cacheKey, ':', error.message);

    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ data: cached.data, cached: true, stale: true, age: Math.round((Date.now() - cached.timestamp) / 1000) });
    }

    if (error.message.includes('429')) {
      return NextResponse.json({
        data: {
          prices: [[Date.now() - 86400000, 0], [Date.now(), 0]],
          market_caps: [[Date.now() - 86400000, 0], [Date.now(), 0]],
          total_volumes: [[Date.now() - 86400000, 0], [Date.now(), 0]]
        },
        fallback: true
      });
    }

    return NextResponse.json({ error: 'Failed to fetch chart data', message: error.message }, { status: 500 });
  }
}
