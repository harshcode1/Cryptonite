"use client"
import React from 'react';
import Image from 'next/image';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';

const Sidebar = ({ title, coins }) => {
  const formatPrice = (price) => {
    if (price >= 1000) return `$${(price / 1000).toFixed(1)}K`;
    return `$${price?.toFixed(2)}`;
  };

  const formatPercentage = (value) => {
    return value >= 0 ? `+${value?.toFixed(2)}%` : `${value?.toFixed(2)}%`;
  };

  return (
    <div className="space-y-4">
      {coins.map((coin, index) => (
        <div
          key={coin.id}
          className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src={coin.image}
                alt={coin.name}
                width={36}
                height={36}
                className="rounded-full group-hover:scale-110 transition-transform duration-300"
              />
              {index < 3 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors duration-300">
                  {coin.name}
                </p>
                <Star className="h-3 w-3 text-gray-500 hover:text-yellow-400 transition-colors duration-300" />
              </div>
              <p className="text-xs text-gray-400 font-mono">
                {coin.symbol.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-white text-sm">
              {formatPrice(coin.current_price)}
            </p>
            <div className="flex items-center justify-end gap-1">
              {coin.price_change_percentage_24h >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-400" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-400" />
              )}
              <p
                className={`text-xs font-medium ${
                  coin.price_change_percentage_24h >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {formatPercentage(coin.price_change_percentage_24h)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
