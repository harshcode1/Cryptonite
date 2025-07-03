"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../components/card';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [currentPrices, setCurrentPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    totalInvested: 0,
    totalProfitLoss: 0,
    totalProfitLossPercent: 0
  });
  useEffect(() => {
    loadPortfolioData();
    
    // Listen for localStorage changes (from other tabs or after purchases)
    const handleStorageChange = (e) => {
      if (e.key === 'holdings' || e.key === 'walletBalance') {
        loadPortfolioData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also set up an interval to refresh data periodically
    const interval = setInterval(() => {
      loadPortfolioData();
    }, 30000); // Refresh every 30 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);  const fetchCurrentPrices = useCallback(async () => {
    if (holdings.length === 0) return;

    try {
      const coinIds = holdings.map(holding => holding.coinId).join(',');
      
      const response = await axios.get(`/api/price`, {
        params: {
          ids: coinIds,
          vs_currencies: 'usd',
          include_24hr_change: true
        }
      });
      
      // Check if response data is valid
      if (response.data && typeof response.data === 'object') {
        setCurrentPrices(response.data);
        console.log('💰 Price data loaded for', Object.keys(response.data).length, 'coins');
      } else {
        console.warn('⚠️ Invalid price data received from API');
      }
    } catch (error) {
      console.error('Error fetching current prices:', error);
      
      // Don't update currentPrices if API fails - keep existing data
      console.log('⚠️ Using existing price data due to API error');
    }
  }, [holdings]); // Remove currentPrices dependency to avoid infinite loops

  useEffect(() => {
    if (holdings.length > 0) {
      fetchCurrentPrices();
    }
  }, [holdings, fetchCurrentPrices]);  const calculatePortfolioStats = useCallback(() => {
    let totalCurrentValue = 0;
    let totalInvested = 0;

    holdings.forEach(holding => {
      const currentPrice = currentPrices[holding.coinId]?.usd || 0;
      const quantity = holding.quantity || 0;
      const currentValue = quantity * currentPrice;
      
      totalCurrentValue += currentValue;
      totalInvested += holding.totalSpentUSD || (holding.totalSpentINR || 0) / 83;
    });

    const profitLoss = totalCurrentValue - totalInvested;
    const profitLossPercent = totalInvested > 0 ? ((profitLoss / totalInvested) * 100) : 0;

    setPortfolioStats({
      totalValue: totalCurrentValue * 83, // Convert to INR
      totalInvested: totalInvested * 83, // Convert to INR
      totalProfitLoss: profitLoss * 83, // Convert to INR
      totalProfitLossPercent: profitLossPercent
    });
  }, [holdings, currentPrices]);

  useEffect(() => {
    if (holdings.length > 0 && Object.keys(currentPrices).length > 0) {
      calculatePortfolioStats();
    }
  }, [holdings, currentPrices, calculatePortfolioStats]);  const loadPortfolioData = () => {
    const savedHoldings = localStorage.getItem('holdings');
    const savedBalance = localStorage.getItem('walletBalance');
    
    let holdings = savedHoldings ? JSON.parse(savedHoldings) : [];
    
    // Normalize holdings data structure (handle both old and new formats)
    holdings = holdings.map(holding => {
      const normalized = {
        ...holding,
        name: holding.name || holding.coinName || 'Unknown',
        symbol: holding.symbol || holding.coinSymbol || 'N/A',
        avgBuyPrice: holding.avgBuyPrice || holding.priceAtBuy || 0
      };
      
      // Clean up old properties to avoid confusion
      delete normalized.coinName;
      delete normalized.coinSymbol;
      delete normalized.priceAtBuy;
      
      return normalized;
    });
    
    // Filter out any malformed holdings
    holdings = holdings.filter(holding => 
      holding && 
      holding.coinId && 
      holding.symbol && 
      holding.name && 
      typeof holding.quantity === 'number' &&
      holding.quantity > 0
    );
    
    // Save the normalized data back to localStorage
    if (holdings.length > 0) {
      localStorage.setItem('holdings', JSON.stringify(holdings));
    }
    
    console.log('📊 Loaded', holdings.length, 'valid holdings');
    
    setHoldings(holdings);
    setWalletBalance(savedBalance ? parseFloat(savedBalance) : 100000);
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(num);
  };
  const refreshPrices = () => {
    fetchCurrentPrices();
  };

  const refreshPortfolio = () => {
    loadPortfolioData();
  };

  const resetPortfolio = () => {
    if (window.confirm('Are you sure you want to reset your entire portfolio? This action cannot be undone.')) {
      localStorage.removeItem('holdings');
      localStorage.setItem('walletBalance', '100000');
      setHoldings([]);
      setWalletBalance(100000);
      setCurrentPrices({});
      setPortfolioStats({
        totalValue: 0,
        totalInvested: 0,
        totalProfitLoss: 0,
        totalProfitLossPercent: 0
      });
    }
  };
  const exportPortfolio = () => {
    const portfolioData = holdings.map(holding => ({
      'Coin': holding.name || 'Unknown',
      'Symbol': holding.symbol?.toUpperCase() || 'N/A',
      'Quantity': formatNumber(holding.quantity || 0),
      'Avg Buy Price (USD)': `$${formatNumber(holding.avgBuyPrice || 0)}`,
      'Current Price (USD)': `$${formatNumber(currentPrices[holding.coinId]?.usd || 0)}`,
      'Total Invested (INR)': formatCurrency(holding.totalSpentINR || 0),
      'Current Value (INR)': formatCurrency(((holding.quantity || 0) * (currentPrices[holding.coinId]?.usd || 0)) * 83),
      'Profit/Loss (INR)': formatCurrency((((holding.quantity || 0) * (currentPrices[holding.coinId]?.usd || 0)) * 83) - (holding.totalSpentINR || 0)),
      '24h Change (%)': `${(currentPrices[holding.coinId]?.usd_24h_change || 0).toFixed(2)}%`
    }));

    const csvContent = [
      Object.keys(portfolioData[0] || {}).join(','),
      ...portfolioData.map(row => Object.values(row).join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cryptonite-portfolio-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="text-white text-lg">Loading portfolio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            My Portfolio
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Track your cryptocurrency investments and portfolio performance
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Portfolio Value */}
          <Card className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Total Portfolio Value</h3>
                  <div className="flex items-center gap-2 mt-2">
                    {isBalanceVisible ? (
                      <p className="text-2xl font-bold text-white">{formatCurrency(portfolioStats.totalValue)}</p>
                    ) : (
                      <p className="text-2xl font-bold text-white">•••••••</p>
                    )}
                    <button
                      onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {isBalanceVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          {/* Total Invested */}
          <Card className="bg-gradient-to-br from-green-900/50 to-green-800/30 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Total Invested</h3>
                  <p className="text-2xl font-bold text-white mt-2">{formatCurrency(portfolioStats.totalInvested)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          {/* Profit/Loss */}
          <Card className={`bg-gradient-to-br ${portfolioStats.totalProfitLoss >= 0 ? 'from-emerald-900/50 to-emerald-800/30 border-emerald-500/20' : 'from-red-900/50 to-red-800/30 border-red-500/20'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Profit/Loss</h3>
                  <p className={`text-2xl font-bold mt-2 ${portfolioStats.totalProfitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {portfolioStats.totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(portfolioStats.totalProfitLoss)}
                  </p>
                  <p className={`text-sm ${portfolioStats.totalProfitLoss >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                    {portfolioStats.totalProfitLossPercent >= 0 ? '+' : ''}{portfolioStats.totalProfitLossPercent.toFixed(2)}%
                  </p>
                </div>
                {portfolioStats.totalProfitLoss >= 0 ? 
                  <TrendingUp className="h-8 w-8 text-emerald-400" /> : 
                  <TrendingDown className="h-8 w-8 text-red-400" />
                }
              </div>
            </CardContent>
          </Card>

          {/* Cash Balance */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Cash Balance</h3>
                  <p className="text-2xl font-bold text-white mt-2">{formatCurrency(walletBalance)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={refreshPortfolio}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors duration-300"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh Portfolio
          </button>
          
          <button
            onClick={refreshPrices}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-300"
          >
            <RefreshCw className="h-5 w-5" />
            Refresh Prices
          </button>
          
          {holdings.length > 0 && (
            <>
              <button
                onClick={exportPortfolio}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors duration-300"
              >
                <Download className="h-5 w-5" />
                Export CSV
              </button>
              
              <button
                onClick={resetPortfolio}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors duration-300"
              >
                <Trash2 className="h-5 w-5" />
                Reset Portfolio
              </button>
            </>
          )}
        </div>

        {/* Holdings Table */}
        {holdings.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-12">
              <div className="text-center">
                <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />                <h3 className="text-2xl font-bold text-white mb-2">No Holdings Found</h3>
                <p className="text-gray-400 mb-6">You haven&apos;t purchased any cryptocurrency yet. Start building your portfolio!</p>
                <a
                  href="/buy"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-colors duration-300"
                >
                  <DollarSign className="h-5 w-5" />
                  Buy Your First Crypto
                </a>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Your Holdings</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-4 px-2 text-gray-300 font-semibold">Asset</th>
                      <th className="text-right py-4 px-2 text-gray-300 font-semibold">Holdings</th>
                      <th className="text-right py-4 px-2 text-gray-300 font-semibold">Avg Price</th>
                      <th className="text-right py-4 px-2 text-gray-300 font-semibold">Current Price</th>
                      <th className="text-right py-4 px-2 text-gray-300 font-semibold">Value</th>
                      <th className="text-right py-4 px-2 text-gray-300 font-semibold">P&L</th>
                      <th className="text-right py-4 px-2 text-gray-300 font-semibold">24h Change</th>
                    </tr>
                  </thead>
                  <tbody>                    {holdings.map((holding, index) => {
                      const currentPrice = currentPrices[holding.coinId]?.usd || 0;
                      const currentValue = (holding.quantity || 0) * currentPrice * 83;
                      const profitLoss = currentValue - (holding.totalSpentINR || 0);
                      const profitLossPercent = (holding.totalSpentINR && holding.totalSpentINR > 0) ? ((profitLoss / holding.totalSpentINR) * 100) : 0;
                      const change24h = currentPrices[holding.coinId]?.usd_24h_change || 0;

                      return (
                        <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-3">                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                  {holding.symbol?.charAt(0)?.toUpperCase() || '?'}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-semibold">{holding.name || 'Unknown'}</p>
                                <p className="text-gray-400 text-sm">{holding.symbol?.toUpperCase() || 'N/A'}</p>
                              </div>
                            </div>
                          </td>                          <td className="text-right py-4 px-2">
                            <p className="text-white font-medium">{formatNumber(holding.quantity || 0)}</p>
                          </td>
                          <td className="text-right py-4 px-2">
                            <p className="text-white">${formatNumber(holding.avgBuyPrice || 0)}</p>
                          </td>
                          <td className="text-right py-4 px-2">
                            <p className="text-white">${formatNumber(currentPrice)}</p>
                          </td>
                          <td className="text-right py-4 px-2">
                            <p className="text-white font-medium">{formatCurrency(currentValue)}</p>
                          </td>
                          <td className="text-right py-4 px-2">
                            <p className={`font-medium ${profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {profitLoss >= 0 ? '+' : ''}{formatCurrency(profitLoss)}
                            </p>
                            <p className={`text-sm ${profitLoss >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                              {profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%
                            </p>
                          </td>
                          <td className="text-right py-4 px-2">
                            <p className={`font-medium ${change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
