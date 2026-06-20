import { NextResponse } from 'next/server';

const cache = new Map();
const CACHE_EXPIRATION = 60 * 1000;

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const now = Date.now();
    const cached = cache.get(id);

    if (cached && (now - cached.timestamp) < CACHE_EXPIRATION) {
      return NextResponse.json({ data: cached.data, cached: true, age: Math.round((now - cached.timestamp) / 1000) });
    }

    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
    if (!response.ok) throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);

    const data = await response.json();
    cache.set(id, { data, timestamp: now });

    return NextResponse.json({ data, cached: false, timestamp: now });
  } catch (error) {
    console.error('Error fetching coin data for', id, ':', error.message);

    const cached = cache.get(id);
    if (cached) {
      return NextResponse.json({ data: cached.data, cached: true, stale: true, age: Math.round((Date.now() - cached.timestamp) / 1000) });
    }

    if (error.message.includes('429')) {
      return NextResponse.json({
        data: {
          id, symbol: id.substring(0, 3), name: id.charAt(0).toUpperCase() + id.slice(1),
          image: { large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
          market_data: { current_price: { usd: 0 }, market_cap: { usd: 0 }, price_change_percentage_24h: 0 },
          description: { en: 'Data unavailable due to rate limiting.' }
        },
        fallback: true
      });
    }

    return NextResponse.json({ error: 'Failed to fetch coin data', message: error.message }, { status: 500 });
  }
}
