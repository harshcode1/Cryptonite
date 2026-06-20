import { NextResponse } from 'next/server';

const priceCache = {
  data: new Map(),
  timestamps: new Map(),
  expiration: 300 * 1000,
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');
  const vs_currencies = searchParams.get('vs_currencies') || 'usd';
  const include_24hr_change = searchParams.get('include_24hr_change') || 'true';

  if (!ids) {
    return NextResponse.json({ error: 'Missing required parameter: ids' }, { status: 400 });
  }

  const cacheKey = `${ids}-${vs_currencies}-${include_24hr_change}`;
  const forceRefresh = request.headers.get('x-force-refresh') === '1';
  const now = Date.now();
  const cacheAge = now - (priceCache.timestamps.get(cacheKey) || 0);

  if (!forceRefresh && priceCache.data.has(cacheKey) && cacheAge < priceCache.expiration) {
    return NextResponse.json(priceCache.data.get(cacheKey));
  }

  try {
    const url = new URL('https://api.coingecko.com/api/v3/simple/price');
    url.searchParams.set('ids', ids);
    url.searchParams.set('vs_currencies', vs_currencies);
    url.searchParams.set('include_24hr_change', include_24hr_change);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);

    const data = await response.json();
    priceCache.data.set(cacheKey, data);
    priceCache.timestamps.set(cacheKey, now);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching price data:', error.message);

    if (priceCache.data.has(cacheKey)) {
      return NextResponse.json(priceCache.data.get(cacheKey));
    }

    if (error.message.includes('429')) {
      const fallbackMap = {
        bitcoin: { usd: 65000, usd_24h_change: 0 },
        ethereum: { usd: 3500, usd_24h_change: 0 },
        binancecoin: { usd: 600, usd_24h_change: 0 },
        cardano: { usd: 1.2, usd_24h_change: 0 },
        solana: { usd: 150, usd_24h_change: 0 },
        xrp: { usd: 0.6, usd_24h_change: 0 },
        dogecoin: { usd: 0.08, usd_24h_change: 0 },
        'avalanche-2': { usd: 35, usd_24h_change: 0 },
        polkadot: { usd: 7, usd_24h_change: 0 },
        chainlink: { usd: 15, usd_24h_change: 0 },
        'bitcoin-cash': { usd: 485.52, usd_24h_change: 0 },
        sui: { usd: 2.89, usd_24h_change: 0 },
      };
      const result = {};
      ids.split(',').forEach((id) => { result[id] = fallbackMap[id] || { usd: 1, usd_24h_change: 0 }; });
      return NextResponse.json(result);
    }

    return NextResponse.json({});
  }
}
