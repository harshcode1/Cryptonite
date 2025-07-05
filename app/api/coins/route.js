import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// In-memory cache with query-specific keys
const cache = new Map(); // key → { data, timestamp }
const CACHE_EXPIRATION = 300 * 1000; // 5 minutes to reduce API calls
const DATA_FILE_PATH = path.resolve('./data/coins.json');

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

    // Write data to JSON file (only if it contains comprehensive data)
    // Prioritize saving data with sparklines for better fallback quality
    if (sparkline === 'true' || data.length >= 50) {
      try {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
        console.log('💾 Updated JSON file with', data.length, 'coins (sparkline:', sparkline, ')');
      } catch (writeError) {
        console.warn('⚠️ Failed to write to JSON file:', writeError.message);
      }
    }

    console.log('✅ Fresh data cached and stored in JSON file:', cacheKey, '- coins fetched:', data.length);

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

    // If it's a rate limit error, use data from JSON file
    if (error.message.includes('429')) {
      console.log('🚫 Rate limited - using data from JSON file');

      try {
        // Read fallback data from JSON file
        const fallbackData = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf-8'));
        
        // Process fallback data to match the requested query parameters
        let processedData = fallbackData.slice(0, parseInt(per_page));
        
        // If sparkline is not requested, remove sparkline data to match API behavior
        if (sparkline === 'false') {
          processedData = processedData.map(coin => {
            const { sparkline_in_7d, ...coinWithoutSparkline } = coin;
            return coinWithoutSparkline;
          });
        }
        
        // If sparkline is requested but missing, generate simple fallback sparkline
        if (sparkline === 'true') {
          processedData = processedData.map(coin => {
            if (!coin.sparkline_in_7d || !coin.sparkline_in_7d.price) {
              // Generate a simple sparkline based on current price with small variations
              const basePrice = coin.current_price || 1;
              const variation = basePrice * 0.02; // 2% variation
              const sparklinePrice = Array(168).fill(0).map((_, i) => {
                const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
                return basePrice + (variation * randomFactor);
              });
              
              return {
                ...coin,
                sparkline_in_7d: { price: sparklinePrice }
              };
            }
            return coin;
          });
        }
        
        console.log('✅ Processed fallback data with', processedData.length, 'coins, sparkline:', sparkline);
        
        // Update cache with processed fallback data
        cache.set(cacheKey, {
          data: processedData,
          timestamp: Date.now()
        });

        return NextResponse.json({
          data: processedData,
          cached: true,
          fallback: true,
          message: 'Rate limited - using processed data from JSON file'
        });
      } catch (fileError) {
        console.error('❌ Error reading JSON file:', fileError);
        
        // If JSON file is corrupted or missing, provide basic fallback data
        const basicFallbackData = [
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
            current_price: 108110,
            market_cap: 2150113012353,
            market_cap_rank: 1,
            price_change_percentage_24h: 0.16,
            sparkline_in_7d: sparkline === 'true' ? {
              price: Array(168).fill(0).map((_, i) => 108110 + (Math.random() - 0.5) * 2000)
            } : undefined
          },
          {
            id: 'ethereum',
            symbol: 'eth',
            name: 'Ethereum',
            image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
            current_price: 2516,
            market_cap: 302000000000,
            market_cap_rank: 2,
            price_change_percentage_24h: 0.80,
            sparkline_in_7d: sparkline === 'true' ? {
              price: Array(168).fill(0).map((_, i) => 2516 + (Math.random() - 0.5) * 100)
            } : undefined
          }
        ].map(coin => sparkline === 'false' ? (() => {
          const { sparkline_in_7d, ...rest } = coin;
          return rest;
        })() : coin);
        
        console.log('🆘 Using basic fallback data with', basicFallbackData.length, 'coins');
        
        return NextResponse.json({
          data: basicFallbackData,
          cached: true,
          fallback: true,
          basicFallback: true,
          message: 'Using basic fallback data - JSON file unavailable'
        });
      }
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
