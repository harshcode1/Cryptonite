import { NextResponse } from 'next/server';

// In-memory cache for chart data
const cache = new Map(); // key → { data, timestamp }
const CACHE_EXPIRATION = 300 * 1000; // 5 minutes for chart data

export async function GET(request, { params }) {
  const { id } = params;
  const { searchParams } = new URL(request.url);
  
  const days = searchParams.get('days') || '7';
  const vs_currency = searchParams.get('vs_currency') || 'usd';
  
  const cacheKey = `${id}-${days}-${vs_currency}`;
  
  try {
    // Check if we have fresh cached data for this chart
    const now = Date.now();
    const cached = cache.get(cacheKey);
    
    if (cached && (now - cached.timestamp) < CACHE_EXPIRATION) {
      const cacheAge = Math.round((now - cached.timestamp) / 1000);
      console.log('🚀 Serving chart data from cache, key:', cacheKey, 'age:', cacheAge, 'seconds');
      return NextResponse.json({
        data: cached.data,
        cached: true,
        age: cacheAge
      });
    }

    // Cache is expired or empty, fetch fresh data
    console.log('📡 Fetching fresh chart data from CoinGecko for:', cacheKey);
    
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${vs_currency}&days=${days}`);
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Update cache
    cache.set(cacheKey, {
      data: data,
      timestamp: now
    });

    console.log('✅ Fresh chart data cached for:', cacheKey);

    return NextResponse.json({
      data: data,
      cached: false,
      timestamp: now
    });

  } catch (error) {
    console.error('❌ Error fetching chart data for', cacheKey, ':', error);
    
    // If we have stale cached data, return it
    const cached = cache.get(cacheKey);
    if (cached) {
      const cacheAge = Math.round((Date.now() - cached.timestamp) / 1000);
      console.log('⚠️ Returning stale chart data for:', cacheKey, '(age:', cacheAge, 'seconds)');
      return NextResponse.json({
        data: cached.data,
        cached: true,
        stale: true,
        error: 'Fresh data unavailable, serving stale cache',
        age: cacheAge
      });
    }

    // If it's a rate limit error, return empty fallback data
    if (error.message.includes('429')) {
      console.log('🚫 Rate limited - returning fallback chart data for:', cacheKey);
      const fallbackData = {
        prices: [[Date.now() - 86400000, 0], [Date.now(), 0]], // Empty 24h chart
        market_caps: [[Date.now() - 86400000, 0], [Date.now(), 0]],
        total_volumes: [[Date.now() - 86400000, 0], [Date.now(), 0]]
      };
      
      return NextResponse.json({
        data: fallbackData,
        cached: false,
        fallback: true,
        message: 'Rate limited - using fallback chart data'
      });
    }

    // No cache available, return error
    return NextResponse.json(
      {
        error: 'Failed to fetch chart data',
        message: error.message,
        timestamp: Date.now()
      },
      { status: 500 }
    );
  }
}
