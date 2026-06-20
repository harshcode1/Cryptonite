"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function TickerBar() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    axios
      .get("/api/coins", { params: { per_page: 20, page: 1 } })
      .then((r) => setCoins(r.data.data || r.data))
      .catch(() => {});
  }, []);

  if (!coins.length) return null;

  const items = [...coins, ...coins];

  return (
    <div className="relative z-20 border-b border-white/5 bg-black/40 backdrop-blur-md overflow-hidden py-2.5">
      <div className="ticker-track flex gap-10 px-4">
        {items.map((coin, i) => {
          const change = coin.price_change_percentage_24h ?? 0;
          const isUp = change >= 0;
          return (
            <span
              key={`${coin.id}-${i}`}
              className="inline-flex items-center gap-2 text-sm font-mono flex-shrink-0"
            >
              {coin.image && (
                <img
                  src={coin.image}
                  alt={coin.symbol}
                  width={16}
                  height={16}
                  className="rounded-full"
                />
              )}
              <span className="text-gray-400 font-semibold">
                {coin.symbol.toUpperCase()}
              </span>
              <span className="text-white font-bold">
                ${coin.current_price?.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </span>
              <span className={isUp ? "neon-green" : "neon-red"} style={{ fontSize: "0.75rem" }}>
                {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
              </span>
              <span className="text-white/10 ml-2">|</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
