"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';

const CoinPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [coin, setCoin] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            const fetchCoin = async () => {
                try {
                    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
                    setCoin(response.data);
                } catch (error) {
                    setError('Error fetching coin data. Please try again later.');
                    console.error('Error fetching coin data:', error);
                }
            };

            fetchCoin();
        }
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!coin) {
        return <p>Loading...</p>;
    }

    const chartData = {
        labels: coin.market_data.sparkline_7d.price.map((_, index) => index),
        datasets: [
            {
                label: `${coin.name} Price`,
                data: coin.market_data.sparkline_7d.price,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }
        ]
    };

    return (
        <div>
            <Head>
                <title>{coin.name} - Coin Details</title>
            </Head>
            <div className="container mx-auto p-4">
                <div className="flex items-center space-x-4">
                    <Image src={coin.image.large} alt={coin.name} width={50} height={50} />
                    <h1 className="text-3xl font-bold">{coin.name}</h1>
                    <span className="text-gray-500">{coin.symbol.toUpperCase()}</span>
                </div>
                <div className="mt-4">
                    <p>Current Price: ${coin.market_data.current_price.usd}</p>
                    <p>Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}</p>
                    <p>24h High: ${coin.market_data.high_24h.usd}</p>
                    <p>24h Low: ${coin.market_data.low_24h.usd}</p>
                </div>
                <div className="mt-6">
                    <Line data={chartData} />
                </div>
                <div className="mt-6">
                    <h2 className="text-2xl font-bold">About {coin.name}</h2>
                    <p>{coin.description.en}</p>
                </div>
            </div>
        </div>
    );
};

export default CoinPage;
