"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "./components/card";
import TiltCard from "./components/TiltCard";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Loader2, TrendingUp, TrendingDown, DollarSign,
  BarChart3, Globe, Activity, Zap, ArrowRight, Star,
} from "lucide-react";

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketStats, setMarketStats] = useState({
    totalMarketCap: 0, totalVolume: 0, btcDominance: 0, ethDominance: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coinsRes = await axios.get("/api/coins", {
          params: { vs_currency: "usd", order: "market_cap_desc", per_page: 10, page: 1, sparkline: true, price_change_percentage: "1h,24h,7d" },
        });
        const coinsData = coinsRes.data.data || coinsRes.data;
        setCoins(coinsData);

        try {
          const [globalRes, trendingRes] = await Promise.all([
            axios.get("/api/global"),
            axios.get("/api/trending"),
          ]);
          const g = globalRes.data.data;
          setTrendingCoins(trendingRes.data.coins.slice(0, 5));
          setMarketStats({
            totalMarketCap: g.total_market_cap.usd,
            totalVolume: g.total_volume.usd,
            btcDominance: g.market_cap_percentage.btc,
            ethDominance: g.market_cap_percentage.eth,
          });
        } catch {
          setMarketStats({ totalMarketCap: 2.5e12, totalVolume: 5e10, btcDominance: 50, ethDominance: 20 });
        }
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fmt = (v) => {
    if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
    if (v >= 1e9)  return `$${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6)  return `$${(v / 1e6).toFixed(2)}M`;
    return `$${v?.toLocaleString()}`;
  };
  const pct = (v) => (v >= 0 ? `+${v?.toFixed(2)}%` : `${v?.toFixed(2)}%`);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">Loading market data...</p>
        </div>
      </div>
    );
  }

  /* ─── floating coin colours ─── */
  const coinColors = [
    { border: "border-neon-blue",   glow: "rgba(59,130,246,0.3)",  float: "float-coin-1", bg: "from-blue-600/20 to-blue-900/10" },
    { border: "border-neon-purple", glow: "rgba(168,85,247,0.3)",  float: "float-coin-2", bg: "from-purple-600/20 to-purple-900/10" },
    { border: "border-neon-cyan",   glow: "rgba(6,182,212,0.3)",   float: "float-coin-3", bg: "from-cyan-600/20 to-cyan-900/10" },
  ];
  const coinPositions = [
    { top: "5%",  right: "0%",   width: "200px" },
    { top: "35%", right: "20%",  width: "180px" },
    { top: "62%", right: "2%",   width: "190px" },
  ];

  return (
    <div className="min-h-screen">

      {/* ════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden hero-dots">
        {/* decorative ring */}
        <div
          aria-hidden="true"
          className="absolute right-[-10%] top-[-10%] w-[700px] h-[700px] rounded-full opacity-5 pointer-events-none"
          style={{ border: "1px solid rgba(96,165,250,1)", boxShadow: "0 0 120px 40px rgba(59,130,246,0.08)" }}
        />
        <div
          aria-hidden="true"
          className="absolute right-[5%] top-[5%] w-[500px] h-[500px] rounded-full opacity-5 pointer-events-none"
          style={{ border: "1px solid rgba(168,85,247,0.8)" }}
        />

        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* ── Left: Text ── */}
            <div>
              <div className="hero-l1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                Live Market Data · Updated in Real-time
              </div>

              <h1 className="font-black leading-none tracking-tight mb-8">
                <div className="hero-l2 text-shimmer text-7xl md:text-8xl lg:text-9xl">TRACK.</div>
                <div className="hero-l3 text-shimmer text-7xl md:text-8xl lg:text-9xl">TRADE.</div>
                <div className="hero-l4 text-white  text-7xl md:text-8xl lg:text-9xl">WIN.</div>
              </h1>

              <p className="hero-l4 text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                Professional-grade crypto intelligence. Real-time prices, portfolio analytics, and virtual trading — all in one place.
              </p>

              <div className="hero-l5 flex flex-wrap gap-4 mb-14">
                <Link
                  href="/ProductsPage"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
                >
                  Explore Markets
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/buy"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg border border-white/20 text-white hover:border-blue-400/50 hover:bg-white/5 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Start Trading
                </Link>
              </div>

              {/* Quick stats row */}
              <div className="hero-l5 grid grid-cols-3 gap-6">
                {[
                  { label: "Market Cap",    value: fmt(marketStats.totalMarketCap) },
                  { label: "BTC Dominance", value: `${marketStats.btcDominance?.toFixed(1)}%` },
                  { label: "Assets Tracked",value: "250+" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-black text-white mb-1">{s.value}</div>
                    <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Floating 3D Coin Cards ── */}
            <div className="relative h-[520px] hidden lg:block">
              {coins.slice(0, 3).map((coin, i) => {
                const c = coinColors[i];
                const pos = coinPositions[i];
                const change = coin.price_change_percentage_24h ?? 0;
                return (
                  <TiltCard
                    key={coin.id}
                    intensity={12}
                    className={`absolute glass-premium rounded-3xl p-5 border scan-card ${c.float} ${c.border}`}
                    style={{ ...pos, width: pos.width }}
                  >
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${c.bg} opacity-50`} />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <Image src={coin.image} alt={coin.name} width={44} height={44} className="rounded-full" />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#07071a]" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{coin.name}</p>
                          <p className="text-gray-400 text-xs font-mono">{coin.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                      <p className="text-white text-xl font-black mb-1">
                        ${coin.current_price?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                      </p>
                      <span className={`text-sm font-bold ${change >= 0 ? "neon-green" : "neon-red"}`}>
                        {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                      </span>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          GLOBAL STATS BAR
      ════════════════════════════════════════ */}
      <section className="container mx-auto px-4 mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Market Cap",    value: fmt(marketStats.totalMarketCap),            icon: Globe,     grad: "from-blue-600 to-blue-800",    border: "border-neon-blue" },
            { label: "24h Volume",    value: fmt(marketStats.totalVolume),                icon: BarChart3, grad: "from-emerald-600 to-emerald-800", border: "border-neon-green" },
            { label: "BTC Dominance", value: `${marketStats.btcDominance?.toFixed(1)}%`, icon: Activity,  grad: "from-orange-600 to-orange-800",  border: "border-orange-500/30" },
            { label: "ETH Dominance", value: `${marketStats.ethDominance?.toFixed(1)}%`, icon: Zap,       grad: "from-purple-600 to-purple-800",  border: "border-neon-purple" },
          ].map(({ label, value, icon: Icon, grad, border }) => (
            <TiltCard
              key={label}
              intensity={6}
              className={`glass-premium rounded-2xl border scan-card ${border}`}
            >
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-white text-xl font-black">{value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${grad} opacity-80`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          MARKET CHART + SIDEBAR
      ════════════════════════════════════════ */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Chart */}
          <div className="xl:col-span-2">
            <TiltCard intensity={3} className="glass-premium rounded-3xl border border-white/5 scan-card h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Market Overview
                  </h2>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-xs font-medium">Live</span>
                  </div>
                </div>
                <div className="h-[340px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={coins}>
                      <defs>
                        <linearGradient id="gPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="symbol" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={fmt} />
                      <Tooltip
                        contentStyle={{ background: "rgba(8,12,30,0.95)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 12, color: "#f8fafc" }}
                        formatter={(v) => [fmt(v), "Price"]}
                      />
                      <Area type="monotone" dataKey="current_price" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gPrice)" dot={{ fill: "#3b82f6", r: 3 }} activeDot={{ r: 6, fill: "#60a5fa", boxShadow: "0 0 10px #3b82f6" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Top Performers */}
            <div className="glass-premium rounded-3xl border border-white/5 p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Star className="h-4 w-4 text-yellow-400" />
                Top Performers
              </h3>
              <div className="space-y-3">
                {coins.slice(0, 5).map((coin) => {
                  const change = coin.price_change_percentage_24h ?? 0;
                  return (
                    <Link key={coin.id} href={`/coins/${coin.id}`} className="flex items-center justify-between p-3 rounded-xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/10 transition-all duration-200 group">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image src={coin.image} alt={coin.name} width={36} height={36} className="rounded-full group-hover:scale-110 transition-transform duration-200" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-semibold">{coin.name}</p>
                          <p className="text-gray-500 text-xs font-mono">{coin.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-bold">{fmt(coin.current_price)}</p>
                        <p className={`text-xs font-semibold ${change >= 0 ? "neon-green" : "neon-red"}`}>
                          {change >= 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Trending */}
            {trendingCoins.length > 0 && (
              <div className="glass-premium rounded-3xl border border-white/5 p-5">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  Trending
                </h3>
                <div className="space-y-3">
                  {trendingCoins.map((item, idx) => (
                    <div key={item.item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/10 transition-all duration-200 cursor-pointer">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">{idx + 1}</span>
                      <Image src={item.item.thumb} alt={item.item.name} width={24} height={24} className="rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{item.item.name}</p>
                        <p className="text-gray-500 text-xs">{item.item.symbol}</p>
                      </div>
                      <span className="text-gray-400 text-xs font-mono">#{item.item.market_cap_rank}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
