import { NextResponse } from 'next/server';

// In-memory cache for individual coin data
const cache = new Map(); // key → { data, timestamp }
const CACHE_EXPIRATION = 60 * 1000; // 1 minute for coin details

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    // Check if we have fresh cached data for this coin
    const now = Date.now();
    const cached = cache.get(id);
    
    if (cached && (now - cached.timestamp) < CACHE_EXPIRATION) {
      const cacheAge = Math.round((now - cached.timestamp) / 1000);
      console.log('🚀 Serving coin data from cache, id:', id, 'age:', cacheAge, 'seconds');
      return NextResponse.json({
        data: cached.data,
        cached: true,
        age: cacheAge
      });
    }

    // Cache is expired or empty, fetch fresh data
    console.log('📡 Fetching fresh coin data from CoinGecko for:', id);
    
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Update cache
    cache.set(id, {
      data: data,
      timestamp: now
    });

    console.log('✅ Fresh coin data cached for:', id);

    return NextResponse.json({
      data: data,
      cached: false,
      timestamp: now
    });

  } catch (error) {
    console.error('❌ Error fetching coin data for', id, ':', error);
    
    // If we have stale cached data, return it
    const cached = cache.get(id);
    if (cached) {
      const cacheAge = Math.round((Date.now() - cached.timestamp) / 1000);
      console.log('⚠️ Returning stale coin data for:', id, '(age:', cacheAge, 'seconds)');
      return NextResponse.json({
        data: cached.data,
        cached: true,
        stale: true,
        error: 'Fresh data unavailable, serving stale cache',
        age: cacheAge
      });
    }

    // If it's a rate limit error, return basic fallback data
    if (error.message.includes('429')) {
      console.log('🚫 Rate limited - returning fallback coin data for:', id);
      const fallbackData = {
        id: id,
        symbol: id.substring(0, 3),
        name: id.charAt(0).toUpperCase() + id.slice(1),
        image: { large: `https://assets.coingecko.com/coins/images/1/large/bitcoin.png` },
        market_data: {
          current_price: { usd: 0 },
          market_cap: { usd: 0 },
          price_change_percentage_24h: 0
        },
        description: { en: 'Data unavailable due to rate limiting.' }
      };
      
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
        error: 'Failed to fetch coin data',
        message: error.message,
        timestamp: Date.now()
      },
      { status: 500 }
    );
  }
}
