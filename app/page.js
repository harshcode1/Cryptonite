"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "./components/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { 
  Loader2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3,
  Eye,
  Star,
  Zap,
  Globe,
  Activity
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [globalData, setGlobalData] = useState(null);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketStats, setMarketStats] = useState({
    totalMarketCap: 0,
    totalVolume: 0,
    btcDominance: 0,
    ethDominance: 0
  });  useEffect(() => {
    const fetchData = async () => {
      try {
        // First try to get coins data from our API
        const coinsResponse = await axios.get("/api/coins", {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 10,
            page: 1,
            sparkline: true,
            price_change_percentage: "1h,24h,7d"
          },
        });
        
        // Handle the new API response format for coins
        const coinsData = coinsResponse.data.data || coinsResponse.data;
        setCoins(coinsData);
        
        // Log cache/fallback info
        if (coinsResponse.data.cached) {
          console.log(`📦 Market data loaded from cache (age: ${coinsResponse.data.age}s)`);
        } else if (coinsResponse.data.fallback) {
          console.log('⚠️ Using fallback market data due to rate limiting');
        } else {
          console.log('🆕 Fresh market data loaded');
        }
        
        // Try to get global data and trending, but don't fail if they error
        try {
          const [globalResponse, trendingResponse] = await Promise.all([
            axios.get("https://api.coingecko.com/api/v3/global"),
            axios.get("https://api.coingecko.com/api/v3/search/trending")
          ]);
          
          setGlobalData(globalResponse.data.data);
          setTrendingCoins(trendingResponse.data.coins.slice(0, 5));
          
          setMarketStats({
            totalMarketCap: globalResponse.data.data.total_market_cap.usd,
            totalVolume: globalResponse.data.data.total_volume.usd,
            btcDominance: globalResponse.data.data.market_cap_percentage.btc,
            ethDominance: globalResponse.data.data.market_cap_percentage.eth
          });
        } catch (globalError) {
          console.warn('⚠️ Could not fetch global data, using defaults');
          // Set fallback global data
          setMarketStats({
            totalMarketCap: 2500000000000, // $2.5T fallback
            totalVolume: 50000000000, // $50B fallback
            btcDominance: 50,
            ethDominance: 20
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set fallback data if everything fails
        setCoins([]);
        setMarketStats({
          totalMarketCap: 2500000000000,
          totalVolume: 50000000000,
          btcDominance: 50,
          ethDominance: 20
        });
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const formatCurrency = (value) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value?.toLocaleString()}`;
  };

  const formatPercentage = (value) => {
    return value >= 0 ? `+${value?.toFixed(2)}%` : `${value?.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section with Market Stats */}
      <div className="container mx-auto px-4 py-8">
        {/* Global Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-none text-white shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Market Cap</p>
                  <p className="text-2xl font-bold">{formatCurrency(marketStats.totalMarketCap)}</p>
                </div>
                <Globe className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-none text-white shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">24h Volume</p>
                  <p className="text-2xl font-bold">{formatCurrency(marketStats.totalVolume)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 border-none text-white shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">BTC Dominance</p>
                  <p className="text-2xl font-bold">{marketStats.btcDominance?.toFixed(1)}%</p>
                </div>
                <Activity className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-none text-white shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">ETH Dominance</p>
                  <p className="text-2xl font-bold">{marketStats.ethDominance?.toFixed(1)}%</p>
                </div>
                <Zap className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="xl:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                    Market Overview
                  </h2>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Live</span>
                  </div>
                </div>
                
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={coins}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="symbol" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                          color: '#f8fafc'
                        }}
                        formatter={(value, name) => [formatCurrency(value), 'Price']}
                        labelStyle={{ color: '#cbd5e1' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="current_price"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="url(#colorPrice)"
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#60a5fa' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Top Performers */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Top Performers
                </h3>
                <div className="space-y-4">
                  {coins.slice(0, 5).map((coin) => (
                    <div
                      key={coin.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={coin.image}
                            alt={coin.name}
                            width={40}
                            height={40}
                            className="rounded-full group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{coin.name}</p>
                          <p className="text-sm text-gray-400">{coin.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">{formatCurrency(coin.current_price)}</p>
                        <div className="flex items-center gap-1">
                          {coin.price_change_percentage_24h >= 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-400" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-400" />
                          )}
                          <p
                            className={`text-sm font-medium ${
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
              </CardContent>
            </Card>

            {/* Trending */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-400" />
                  Trending
                </h3>
                <div className="space-y-3">
                  {trendingCoins.map((item, index) => (
                    <div
                      key={item.item.id}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <Image
                        src={item.item.thumb}
                        alt={item.item.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-white text-sm">{item.item.name}</p>
                        <p className="text-xs text-gray-400">{item.item.symbol}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">#{item.item.market_cap_rank}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
