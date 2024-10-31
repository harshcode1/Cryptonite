// Home.js
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
} from "recharts";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 10,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCoins(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching coins:", error);
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  Cryptocurrency Market Overview
                </h2>
                {loading ? (
                  <div className="flex items-center justify-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={coins}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-30"
                        />
                        <XAxis dataKey="symbol" className="text-xs" />
                        <YAxis
                          domain={["auto", "auto"]}
                          className="text-xs"
                          tickFormatter={(value) =>
                            `$${value.toLocaleString()}`
                          }
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                          formatter={(value) => [
                            `$${value.toLocaleString()}`,
                            "Price",
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey="current_price"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Watchlist Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Watchlist</h2>
                {loading ? (
                  <div className="flex items-center justify-center h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coins.map((coin) => (
                      <div
                        key={coin.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={coin.image}
                            alt={coin.name}
                            width={32}
                            height={32}
                            className="w-8 h-8"
                          />
                          <div>
                            <p className="font-medium">{coin.name}</p>
                            <p className="text-sm text-gray-500">
                              {coin.symbol.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${coin.current_price.toLocaleString()}
                          </p>
                          <p
                            className={`text-sm ${
                              coin.price_change_percentage_24h >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
