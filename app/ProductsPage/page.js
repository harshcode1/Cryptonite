"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Searchbar from '../components/Searchbar';
import Markettable from '../components/Markettable';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import { Card, CardContent } from '../components/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart3, 
  Activity,
  Filter,
  Star,
  Flame
} from 'lucide-react';

export default function ProductsPage() {
    const [coins, setCoins] = useState([]);
    const [filteredCoins, setFilteredCoins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [coinsPerPage] = useState(20);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [marketStats, setMarketStats] = useState({
        totalCoins: 0,
        totalMarketCap: 0,
        totalVolume: 0,
        marketCapChange: 0
    });
    const [filterBy, setFilterBy] = useState('all');    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use cached API routes instead of direct CoinGecko calls
                const [coinsResponse] = await Promise.all([
                    axios.get('/api/coins', {
                        params: {
                            vs_currency: 'usd',
                            order: 'market_cap_desc',
                            per_page: 250,
                            page: 1,
                            sparkline: true,
                            price_change_percentage: '1h,24h,7d'
                        },
                    })
                ]);
                
                // Handle cached API response format
                const coinsData = coinsResponse.data.data || coinsResponse.data;
                
                setCoins(coinsData);
                setFilteredCoins(coinsData);
                
                // Calculate market stats from coins data
                const totalMarketCap = coinsData.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
                const totalVolume = coinsData.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
                
                setMarketStats({
                    totalCoins: coinsData.length,
                    totalMarketCap: totalMarketCap,
                    totalVolume: totalVolume,
                    marketCapChange: 0 // Will be calculated from coin data
                });
                
                // Log cache info if available
                if (coinsResponse.data.cached) {
                    console.log(`📦 Products page data loaded from cache (age: ${coinsResponse.data.age}s)`);
                } else if (coinsResponse.data.fallback) {
                    console.log('⚠️ Using fallback products data due to rate limiting');
                } else {
                    console.log('🆕 Fresh products data loaded');
                }
                
                setLoading(false);
            } catch (error) {
                setError('Error fetching market data. Please try again later.');
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        let filtered = coins.filter(coin =>
            coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Apply filters
        if (filterBy === 'gainers') {
            filtered = filtered.filter(coin => coin.price_change_percentage_24h > 0)
                .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        } else if (filterBy === 'losers') {
            filtered = filtered.filter(coin => coin.price_change_percentage_24h < 0)
                .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
        } else if (filterBy === 'volume') {
            filtered = filtered.sort((a, b) => b.total_volume - a.total_volume);
        }

        setFilteredCoins(filtered);
        setCurrentPage(1);
    }, [searchTerm, coins, filterBy]);

    const formatCurrency = (value) => {
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return `$${value?.toLocaleString()}`;
    };

    // Get current coins
    const indexOfLastCoin = currentPage * coinsPerPage;
    const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
    const currentCoins = filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-white text-xl font-semibold">Loading market data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
                        Crypto Markets
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Real-time cryptocurrency prices, market caps, and trading data
                    </p>
                </div>

                {/* Market Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm font-medium">Total Cryptocurrencies</p>
                                    <p className="text-2xl font-bold text-white">{marketStats.totalCoins?.toLocaleString()}</p>
                                </div>
                                <Activity className="h-8 w-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm font-medium">Market Cap</p>
                                    <p className="text-2xl font-bold text-white">{formatCurrency(marketStats.totalMarketCap)}</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm font-medium">24h Volume</p>
                                    <p className="text-2xl font-bold text-white">{formatCurrency(marketStats.totalVolume)}</p>
                                </div>
                                <BarChart3 className="h-8 w-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-300 text-sm font-medium">Market Change</p>
                                    <div className="flex items-center gap-1">
                                        <p className={`text-2xl font-bold ${
                                            marketStats.marketCapChange >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {marketStats.marketCapChange >= 0 ? '+' : ''}{marketStats.marketCapChange?.toFixed(2)}%
                                        </p>
                                        {marketStats.marketCapChange >= 0 ? (
                                            <TrendingUp className="h-5 w-5 text-green-400" />
                                        ) : (
                                            <TrendingDown className="h-5 w-5 text-red-400" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <Searchbar setSearchTerm={setSearchTerm} />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilterBy('all')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                filterBy === 'all' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterBy('gainers')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                filterBy === 'gainers' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                        >
                            <TrendingUp className="h-4 w-4" />
                            Gainers
                        </button>
                        <button
                            onClick={() => setFilterBy('losers')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                filterBy === 'losers' 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                        >
                            <TrendingDown className="h-4 w-4" />
                            Losers
                        </button>
                        <button
                            onClick={() => setFilterBy('volume')}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                                filterBy === 'volume' 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                            }`}
                        >
                            <BarChart3 className="h-4 w-4" />
                            Volume
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
                        <p className="text-red-400 text-center">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    <div className="xl:col-span-3">
                        <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white">Market Data</h2>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-green-400 text-sm font-medium">Live</span>
                                    </div>
                                </div>
                                <Markettable coins={currentCoins} />
                                <Pagination
                                    coinsPerPage={coinsPerPage}
                                    totalCoins={filteredCoins.length}
                                    paginate={paginate}
                                    currentPage={currentPage}
                                />
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-400" />
                                    Top Performers
                                </h3>
                                <Sidebar title="" coins={coins.slice(0, 8)} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
