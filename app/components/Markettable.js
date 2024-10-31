import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketTable = ({ coins }) => {
  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="table-header">#</th>
            <th scope="col" className="table-header">Name</th>
            <th scope="col" className="table-header">Price</th>
            <th scope="col" className="table-header">24h %</th>
            <th scope="col" className="table-header">Market Cap</th>
            <th scope="col" className="table-header">Volume(24h)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {coins.map((coin, index) => (
            <tr key={coin.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="table-cell">{index + 1}</td>
              <td className="table-cell">
                <Link href={`/coins/${coin.id}`} className="flex items-center hover:underline hover:text-blue-600 transition duration-200 ease-in-out">
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="ml-2 font-medium">{coin.name}</span>
                  <span className="ml-2 text-gray-500 text-sm">{coin.symbol.toUpperCase()}</span>
                </Link>
              </td>
              <td className="table-cell">
                ${coin.current_price.toLocaleString()}
              </td>
              <td className="table-cell">
                <span className={`flex items-center ${
                  coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {coin.price_change_percentage_24h > 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </span>
              </td>
              <td className="table-cell">
                {formatMarketCap(coin.market_cap)}
              </td>
              <td className="table-cell">
                ${coin.total_volume.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketTable;
