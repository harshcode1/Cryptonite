import { NextResponse } from 'next/server';

// In-memory cache for price data
let priceCache = {
  data: {},
  timestamps: {},
  expiration: 300 * 1000 // 5 minutes for price data to reduce API calls
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Get query parameters
  const ids = searchParams.get('ids');
  const vs_currencies = searchParams.get('vs_currencies') || 'usd';
  const include_24hr_change = searchParams.get('include_24hr_change') || 'true';

  if (!ids) {
    return NextResponse.json(
      { error: 'Missing required parameter: ids' },
      { status: 400 }
    );
  }

  try {
    // Create cache key based on parameters
    const cacheKey = `${ids}-${vs_currencies}-${include_24hr_change}`;
    
    // Check if we have fresh cached data
    const now = Date.now();
    const cacheTimestamp = priceCache.timestamps[cacheKey] || 0;
    const cacheAge = now - cacheTimestamp;
    
    if (priceCache.data[cacheKey] && cacheAge < priceCache.expiration) {
      // Return cached data
      console.log('💰 Serving price data from cache, age:', Math.round(cacheAge / 1000), 'seconds');
      return NextResponse.json(priceCache.data[cacheKey]);
    }

    // Cache is expired or empty, fetch fresh data
    console.log('💸 Fetching fresh price data from CoinGecko...');
    
    const coinGeckoUrl = new URL('https://api.coingecko.com/api/v3/simple/price');
    coinGeckoUrl.searchParams.set('ids', ids);
    coinGeckoUrl.searchParams.set('vs_currencies', vs_currencies);
    coinGeckoUrl.searchParams.set('include_24hr_change', include_24hr_change);

    const response = await fetch(coinGeckoUrl.toString());
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Update cache
    priceCache.data[cacheKey] = data;
    priceCache.timestamps[cacheKey] = now;

    console.log('✅ Fresh price data cached for:', ids.split(',').length, 'coins');

    return NextResponse.json(data);  } catch (error) {
    console.error('❌ Error fetching price data:', error);
    
    // If we have stale cached data, return it with a warning
    const cacheKey = `${ids}-${vs_currencies}-${include_24hr_change}`;
    if (priceCache.data[cacheKey]) {
      console.log('⚠️ Returning stale cached data due to API error (age:', Math.round((Date.now() - priceCache.timestamps[cacheKey]) / 1000), 'seconds)');
      return NextResponse.json(priceCache.data[cacheKey]);
    }

    // If it's a rate limit error, return fallback price data
    if (error.message.includes('429')) {
      console.log('🚫 Rate limited - returning fallback price data');
      
      // Create fallback price data for common coins
      const coinList = ids.split(',');
      const fallbackPrices = {};
      
      coinList.forEach(coinId => {
        // Provide fallback prices for common coins
        const fallbackPrice = {
          'bitcoin': { usd: 65000, usd_24h_change: 0 },
          'ethereum': { usd: 3500, usd_24h_change: 0 },
          'binancecoin': { usd: 600, usd_24h_change: 0 },
          'cardano': { usd: 1.2, usd_24h_change: 0 },
          'solana': { usd: 150, usd_24h_change: 0 },
          'xrp': { usd: 0.6, usd_24h_change: 0 },
          'dogecoin': { usd: 0.08, usd_24h_change: 0 },
          'avalanche-2': { usd: 35, usd_24h_change: 0 },
          'polkadot': { usd: 7, usd_24h_change: 0 },
          'chainlink': { usd: 15, usd_24h_change: 0 }
        }[coinId] || { usd: 1, usd_24h_change: 0 }; // Default fallback
        
        fallbackPrices[coinId] = fallbackPrice;
      });
      
      return NextResponse.json(fallbackPrices);
    }

    // No cache available, return empty object instead of error
    console.log('⚠️ No data available, returning empty price object');
    return NextResponse.json({});
  }
}
