"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Searchbar from '../app/components/Searchbar';
import Chart from '../app/components/Chart';
import Markettable from '../app/components/Markettable';
import Sidebar from '../app/components/Sidebar';

export default function Home() {
  const [coins, setCoins] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Price',
        data: [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  });

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1,
            sparkline: false,
          },
        });

        console.log('API Response:', response.data); // Log the response for debugging

        const data = response.data;
        setCoins(data);

        setChartData({
          labels: data.map((coin) => coin.symbol.toUpperCase()),
          datasets: [
            {
              label: 'Price',
              data: data.map((coin) => coin.current_price),
              fill: false,
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderColor: 'rgba(75,192,192,1)',
            },
          ],
        });
      } catch (error) {
        if (error.response) {
          console.error('Error fetching coins:', error.response.data); // Log detailed error response
        } else {
          console.error('Error fetching coins:', error.message); // Log general error message
        }
      }
    };

    fetchCoins();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="md:col-span-2">
            {chartData.labels.length > 0 && chartData.datasets[0].data.length > 0 ? (
              <Chart data={chartData} />
            ) : (
              <p>Loading chart data...</p>
            )}
          </div>
          <Sidebar title="Watchlist" coins={coins} />
        </div>
        <div className="mt-8">
          <Markettable coins={coins} />
        </div>
      </div>
    </div>
  );
}
