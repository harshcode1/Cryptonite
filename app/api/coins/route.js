import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const cache = new Map();
const CACHE_EXPIRATION = 300 * 1000;
const DATA_FILE_PATH = path.resolve('./data/coins.json');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const vs_currency = searchParams.get('vs_currency') || 'usd';
  const order = searchParams.get('order') || 'market_cap_desc';
  const per_page = searchParams.get('per_page') || '100';
  const page = searchParams.get('page') || '1';
  const sparkline = searchParams.get('sparkline') || 'false';
  const price_change_percentage = searchParams.get('price_change_percentage') || '24h';
  const cacheKey = `${vs_currency}-${order}-${per_page}-${page}-${sparkline}-${price_change_percentage}`;

  try {
    const now = Date.now();
    const cached = cache.get(cacheKey);

    if (cached && (now - cached.timestamp) < CACHE_EXPIRATION) {
      return NextResponse.json({ data: cached.data, cached: true, age: Math.round((now - cached.timestamp) / 1000) });
    }

    const coinGeckoUrl = new URL('https://api.coingecko.com/api/v3/coins/markets');
    coinGeckoUrl.searchParams.set('vs_currency', vs_currency);
    coinGeckoUrl.searchParams.set('order', order);
    coinGeckoUrl.searchParams.set('per_page', per_page);
    coinGeckoUrl.searchParams.set('page', page);
    coinGeckoUrl.searchParams.set('sparkline', sparkline);
    coinGeckoUrl.searchParams.set('price_change_percentage', price_change_percentage);

    const response = await fetch(coinGeckoUrl.toString());
    if (!response.ok) throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    const data = await response.json();

    cache.set(cacheKey, { data, timestamp: now });

    if (sparkline === 'true' || data.length >= 50) {
      try { fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2)); } catch {}
    }

    return NextResponse.json({ data, cached: false, timestamp: now });
  } catch (error) {
    console.error('Error fetching coins:', error.message);

    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ data: cached.data, cached: true, stale: true, age: Math.round((Date.now() - cached.timestamp) / 1000) });
    }

    if (error.message.includes('429')) {
      try {
        const fallbackData = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf-8'));
        let processedData = fallbackData.slice(0, parseInt(per_page));
        if (sparkline === 'false') {
          processedData = processedData.map(coin => { const { sparkline_in_7d, ...rest } = coin; return rest; });
        }
        if (sparkline === 'true') {
          processedData = processedData.map(coin => {
            if (!coin.sparkline_in_7d?.price) {
              const basePrice = coin.current_price || 1;
              return { ...coin, sparkline_in_7d: { price: Array(168).fill(0).map(() => basePrice + (Math.random() - 0.5) * 2 * basePrice * 0.02) } };
            }
            return coin;
          });
        }
        cache.set(cacheKey, { data: processedData, timestamp: Date.now() });
        return NextResponse.json({ data: processedData, cached: true, fallback: true });
      } catch (fileError) {
        console.error('Error reading JSON file:', fileError.message);
        const basicFallbackData = [
          { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 108110, market_cap: 2150113012353, market_cap_rank: 1, price_change_percentage_24h: 0.16 },
          { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png', current_price: 2516, market_cap: 302000000000, market_cap_rank: 2, price_change_percentage_24h: 0.80 },
        ];
        return NextResponse.json({ data: basicFallbackData, cached: true, fallback: true });
      }
    }

    return NextResponse.json({ error: 'Failed to fetch cryptocurrency data', message: error.message }, { status: 500 });
  }
}
