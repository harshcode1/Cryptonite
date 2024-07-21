"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Image from 'next/image';
import 'chart.js/auto';

const CoinPage = () => {
    const { id } = useParams();
    const [coin, setCoin] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [activeTab, setActiveTab] = useState('1D');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coinResponse, chartResponse] = await Promise.all([
                    axios.get(`https://api.coingecko.com/api/v3/coins/${id}`),
                    axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`)
                ]);
                setCoin(coinResponse.data);
                setChartData({
                    labels: chartResponse.data.prices.map(price => new Date(price[0]).toLocaleDateString()),
                    datasets: [{
                        data: chartResponse.data.prices.map(price => price[1]),
                        borderColor: '#FF6384',
                        fill: false,
                    }]
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [id]);

    if (!coin) return <div className="text-center text-black p-8">Loading...</div>;

    return (
        <div className="bg-white p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Image
                        src={coin.image.small}
                        alt={coin.name}
                        width={32}
                        height={32}
                        className="mr-2"
                    />
                    <h1 className="text-2xl font-bold">{coin.name}</h1>
                    <span className="ml-2 text-gray-500">{coin.symbol.toUpperCase()}</span>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold">${coin.market_data.current_price.usd.toLocaleString()}</p>
                    <p className={`text-sm ${coin.market_data.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {coin.market_data.price_change_percentage_24h.toFixed(2)}% Today
                    </p>
                </div>
            </div>

            <div className="mb-6">
                {chartData && <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
                <div className="flex justify-center mt-4">
                    {['1H', '1D', '1W', '1M', '1Y', 'ALL'].map((period) => (
                        <button
                            key={period}
                            className={`mx-1 px-3 py-1 rounded ${activeTab === period ? 'bg-gray-200' : 'bg-white'}`}
                            onClick={() => setActiveTab(period)}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="text-xl font-bold mb-4">Performance</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Today's Low</span>
                            <span>{coin.market_data.low_24h.usd.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Today's High</span>
                            <span>{coin.market_data.high_24h.usd.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="text-xl font-bold mb-4">Fundamentals</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Market Cap</span>
                            <span>${coin.market_data.market_cap.usd.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>24 Hour Trading Vol</span>
                            <span>${coin.market_data.total_volume.usd.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Circulating Supply</span>
                            <span>{coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Supply</span>
                            <span>{coin.market_data.total_supply ? coin.market_data.total_supply.toLocaleString() : 'N/A'} {coin.symbol.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Max Supply</span>
                            <span>{coin.market_data.max_supply ? coin.market_data.max_supply.toLocaleString() : 'N/A'} {coin.symbol.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">About {coin.name}</h2>
                <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: coin.description.en }}></p>
            </div>
        </div>
    );
};

export default CoinPage;
