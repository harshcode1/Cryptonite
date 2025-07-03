"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Image from 'next/image';
import { Card, CardContent } from '../../components/card';
import { 
    TrendingUp, 
    TrendingDown, 
    Globe, 
    Users, 
    DollarSign, 
    BarChart3, 
    Star,
    ExternalLink,
    Calendar,
    Zap
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const CoinPage = () => {
    const { id } = useParams();
    const [coin, setCoin] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [activeTab, setActiveTab] = useState('7');
    const [loading, setLoading] = useState(true);    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use cached API routes instead of direct CoinGecko calls
                const [coinResponse, chartResponse] = await Promise.all([
                    axios.get(`/api/coin/${id}`),
                    axios.get(`/api/chart/${id}?days=7&vs_currency=usd`)
                ]);
                
                // Handle the cached API response format
                const coinData = coinResponse.data.data || coinResponse.data;
                const chartData = chartResponse.data.data || chartResponse.data;
                
                setCoin(coinData);
                
                setChartData({
                    labels: chartData.prices.map(price => 
                        new Date(price[0]).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                        })
                    ),
                    datasets: [{
                        label: 'Price (USD)',
                        data: chartData.prices.map(price => price[1]),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                    }]
                });
                
                // Log cache info if available
                if (coinResponse.data.cached) {
                    console.log(`📦 Coin data loaded from cache (age: ${coinResponse.data.age}s)`);
                }
                if (chartResponse.data.cached) {
                    console.log(`📦 Chart data loaded from cache (age: ${chartResponse.data.age}s)`);
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

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
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-white text-xl font-semibold">Loading coin data...</p>
                </div>
            </div>
        );
    }

    if (!coin) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white text-xl">Coin not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl mb-8">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Image
                                        src={coin.image.large}
                                        alt={coin.name}
                                        width={80}
                                        height={80}
                                        className="rounded-full shadow-2xl"
                                    />
                                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2">
                                        <Star className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2">{coin.name}</h1>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-300 text-lg font-mono">{coin.symbol?.toUpperCase()}</span>
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                                            Rank #{coin.market_cap_rank}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl font-bold text-white mb-2">
                                    {formatCurrency(coin.market_data?.current_price?.usd)}
                                </p>
                                <div className="flex items-center justify-end gap-2">
                                    {coin.market_data?.price_change_percentage_24h >= 0 ? (
                                        <TrendingUp className="h-5 w-5 text-green-400" />
                                    ) : (
                                        <TrendingDown className="h-5 w-5 text-red-400" />
                                    )}
                                    <p className={`text-lg font-semibold ${
                                        coin.market_data?.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {formatPercentage(coin.market_data?.price_change_percentage_24h)} (24h)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Chart */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl mb-8">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Price Chart</h2>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-400 text-sm font-medium">Live</span>
                            </div>
                        </div>
                        
                        {chartData && (
                            <div className="h-96 mb-6">
                                <Line 
                                    data={chartData} 
                                    options={{ 
                                        responsive: true, 
                                        maintainAspectRatio: false,
                                        plugins: { 
                                            legend: { display: false },
                                            tooltip: {
                                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                titleColor: '#f8fafc',
                                                bodyColor: '#cbd5e1',
                                                borderColor: '#3b82f6',
                                                borderWidth: 1,
                                                cornerRadius: 12,
                                            }
                                        },
                                        scales: {
                                            x: {
                                                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                                ticks: { color: '#9ca3af' }
                                            },
                                            y: {
                                                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                                ticks: { 
                                                    color: '#9ca3af',
                                                    callback: function(value) {
                                                        return formatCurrency(value);
                                                    }
                                                }
                                            }
                                        }
                                    }} 
                                />
                            </div>
                        )}
                        
                        <div className="flex justify-center gap-2">
                            {['1', '7', '30', '90', '365'].map((period) => (
                                <button
                                    key={period}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                        activeTab === period 
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                                    onClick={() => setActiveTab(period)}
                                >
                                    {period === '1' ? '1D' : period === '7' ? '1W' : period === '30' ? '1M' : period === '90' ? '3M' : '1Y'}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                        <CardContent className="p-8">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <BarChart3 className="h-6 w-6 text-blue-400" />
                                Performance
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                    <span className="text-gray-300">24h Low</span>
                                    <span className="font-semibold text-white">
                                        {formatCurrency(coin.market_data?.low_24h?.usd)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                    <span className="text-gray-300">24h High</span>
                                    <span className="font-semibold text-white">
                                        {formatCurrency(coin.market_data?.high_24h?.usd)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                    <span className="text-gray-300">All Time High</span>
                                    <span className="font-semibold text-green-400">
                                        {formatCurrency(coin.market_data?.ath?.usd)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                    <span className="text-gray-300">All Time Low</span>
                                    <span className="font-semibold text-red-400">
                                        {formatCurrency(coin.market_data?.atl?.usd)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                        <CardContent className="p-8">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <DollarSign className="h-6 w-6 text-green-400" />
                                Market Data
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                    <span className="text-gray-300">Market Cap</span>
                                    <span className="font-semibold text-white">
                                        {formatCurrency(coin.market_data?.market_cap?.usd)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                    <span className="text-gray-300">24h Trading Volume</span>
                                    <span className="font-semibold text-white">
                                        {formatCurrency(coin.market_data?.total_volume?.usd)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                    <span className="text-gray-300">Circulating Supply</span>
                                    <span className="font-semibold text-white">
                                        {coin.market_data?.circulating_supply?.toLocaleString()} {coin.symbol?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                    <span className="text-gray-300">Max Supply</span>
                                    <span className="font-semibold text-white">
                                        {coin.market_data?.max_supply ? 
                                            `${coin.market_data.max_supply.toLocaleString()} ${coin.symbol?.toUpperCase()}` : 
                                            'N/A'
                                        }
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Description */}
                <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                    <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Globe className="h-6 w-6 text-purple-400" />
                            About {coin.name}
                        </h3>
                        <div 
                            className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: coin.description?.en }}
                        />
                        
                        {coin.links?.homepage?.[0] && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                                <a 
                                    href={coin.links.homepage[0]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                                >
                                    <ExternalLink className="h-5 w-5" />
                                    Visit Official Website
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CoinPage;
