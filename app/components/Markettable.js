import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, TrendingDown, Star, ExternalLink } from 'lucide-react';

const MarketTable = ({ coins }) => {
  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap?.toLocaleString()}`;
  };

  const formatPercentage = (value) => {
    return value >= 0 ? `+${value?.toFixed(2)}%` : `${value?.toFixed(2)}%`;
  };

  const renderSparkline = (sparklineData) => {
    if (!sparklineData || !sparklineData.price) return null;
    
    const prices = sparklineData.price;
    const width = 100;
    const height = 40;
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const range = max - min;
    
    const points = prices.map((price, index) => {
      const x = (index / (prices.length - 1)) * width;
      const y = height - ((price - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    const isPositive = prices[prices.length - 1] > prices[0];
    
    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="2"
          className="transition-all duration-300"
        />
      </svg>
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl">
      <table className="min-w-full">
        <thead className="bg-white/5 backdrop-blur-sm">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              #
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              1h %
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              24h %
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              7d %
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Market Cap
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Volume(24h)
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
              Last 7 Days
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {coins.map((coin, index) => (
            <tr 
              key={coin.id} 
              className="hover:bg-white/5 transition-all duration-300 group cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{index + 1}</span>
                  <Star className="h-4 w-4 text-gray-500 hover:text-yellow-400 transition-colors duration-300 cursor-pointer" />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link 
                  href={`/coins/${coin.id}`} 
                  className="flex items-center group-hover:text-blue-400 transition-colors duration-300"
                >
                  <div className="relative">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={32}
                      height={32}
                      className="rounded-full group-hover:scale-110 transition-transform duration-300"
                    />
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                        {coin.name}
                      </span>
                      <ExternalLink className="h-3 w-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span className="text-sm text-gray-400 font-mono">
                      {coin.symbol.toUpperCase()}
                    </span>
                  </div>
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-bold text-white">
                  ${coin.current_price?.toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  coin.price_change_percentage_1h_in_currency >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {coin.price_change_percentage_1h_in_currency >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPercentage(coin.price_change_percentage_1h_in_currency)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {coin.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPercentage(coin.price_change_percentage_24h)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  coin.price_change_percentage_7d_in_currency >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {coin.price_change_percentage_7d_in_currency >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {formatPercentage(coin.price_change_percentage_7d_in_currency)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                {formatMarketCap(coin.market_cap)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                ${coin.total_volume?.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-center">
                  {renderSparkline(coin.sparkline_in_7d)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketTable;
