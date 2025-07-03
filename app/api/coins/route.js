import { NextResponse } from 'next/server';

// In-memory cache with query-specific keys
const cache = new Map(); // key → { data, timestamp }
const CACHE_EXPIRATION = 600 * 1000; // 10 minutes to heavily reduce API calls

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Get query parameters (with defaults)
  const vs_currency = searchParams.get('vs_currency') || 'usd';
  const order = searchParams.get('order') || 'market_cap_desc';
  const per_page = searchParams.get('per_page') || '100';
  const page = searchParams.get('page') || '1';
  const sparkline = searchParams.get('sparkline') || 'false';
  const price_change_percentage = searchParams.get('price_change_percentage') || '24h';

  // Create cache key based on all parameters
  const cacheKey = `${vs_currency}-${order}-${per_page}-${page}-${sparkline}-${price_change_percentage}`;
  
  try {
    // Check if we have fresh cached data for this specific query
    const now = Date.now();
    const cached = cache.get(cacheKey);
    
    if (cached && (now - cached.timestamp) < CACHE_EXPIRATION) {
      // Return cached data
      const cacheAge = Math.round((now - cached.timestamp) / 1000);
      console.log('🚀 Serving from cache, key:', cacheKey, 'age:', cacheAge, 'seconds');
      return NextResponse.json({
        data: cached.data,
        cached: true,
        age: cacheAge
      });
    }

    // Cache is expired or empty, fetch fresh data
    console.log('📡 Fetching fresh data from CoinGecko...');
    
    const coinGeckoUrl = new URL('https://api.coingecko.com/api/v3/coins/markets');
    coinGeckoUrl.searchParams.set('vs_currency', vs_currency);
    coinGeckoUrl.searchParams.set('order', order);
    coinGeckoUrl.searchParams.set('per_page', per_page);
    coinGeckoUrl.searchParams.set('page', page);
    coinGeckoUrl.searchParams.set('sparkline', sparkline);
    coinGeckoUrl.searchParams.set('price_change_percentage', price_change_percentage);

    const response = await fetch(coinGeckoUrl.toString());
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }    const data = await response.json();

    // Update cache with query-specific key
    cache.set(cacheKey, {
      data: data,
      timestamp: now
    });

    console.log('✅ Fresh data cached with key:', cacheKey, '- coins fetched:', data.length);

    return NextResponse.json({
      data: data,
      cached: false,
      timestamp: now
    });
  } catch (error) {
    console.error('❌ Error fetching coins:', error);
    
    // If we have stale cached data for this query, return it
    const cached = cache.get(cacheKey);
    if (cached) {
      const cacheAge = Math.round((Date.now() - cached.timestamp) / 1000);
      console.log('⚠️ Returning stale cached data for key:', cacheKey, '(age:', cacheAge, 'seconds)');
      return NextResponse.json({
        data: cached.data,
        cached: true,
        stale: true,
        error: 'Fresh data unavailable, serving stale cache',
        age: cacheAge
      });
    }

    // If it's a rate limit error, return a fallback response
    if (error.message.includes('429')) {
      console.log('🚫 Rate limited - returning minimal fallback data');
      const fallbackData = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          current_price: 65000,
          market_cap: 1280000000000,
          market_cap_rank: 1,
          price_change_percentage_24h: 0,
          last_updated: new Date().toISOString()
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          current_price: 3500,
          market_cap: 420000000000,
          market_cap_rank: 2,
          price_change_percentage_24h: 0,
          last_updated: new Date().toISOString()
        }
      ];
      
      return NextResponse.json({
        data: fallbackData,
        cached: false,
        fallback: true,
        message: 'Rate limited - using fallback data'
      });
    }

    // No cache available, return error
    return NextResponse.json(
      {
        error: 'Failed to fetch cryptocurrency data',
        message: error.message,
        timestamp: Date.now()
      },
      { status: 500 }
    );
  }
}
