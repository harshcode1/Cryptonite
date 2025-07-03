"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/card';
import { 
  ShoppingCart, 
  TrendingUp, 
  Wallet, 
  IndianRupee,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

const BuyPage = () => {
  const [selectedCoin, setSelectedCoin] = useState('');
  const [amountINR, setAmountINR] = useState('');
  const [availableCoins, setAvailableCoins] = useState([]);
  const [coinPrices, setCoinPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [purchaseResult, setPurchaseResult] = useState(null);

  useEffect(() => {
    fetchAvailableCoins();
    loadWalletBalance();
  }, []);

  const loadWalletBalance = () => {
    const balance = localStorage.getItem('walletBalance');
    setWalletBalance(balance ? parseFloat(balance) : 100000);
  };  const fetchAvailableCoins = async () => {
    try {
      setLoading(true);
      // Fetch top 20 cryptocurrencies from internal API
      const response = await axios.get('/api/coins', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 20,
          page: 1,
          sparkline: false,
        },
      });

      // Handle the new API response format
      const coinsData = response.data.data || response.data;
      
      // Filter out any invalid coin data
      const validCoins = coinsData.filter(coin => 
        coin && coin.id && coin.name && coin.symbol && coin.current_price
      );
      
      setAvailableCoins(validCoins);
      
      // Create price mapping for quick access
      const prices = {};
      validCoins.forEach(coin => {
        prices[coin.id] = coin.current_price;
      });
      setCoinPrices(prices);
      
      // Log cache/fallback info
      if (response.data.cached) {
        console.log(`📦 Coins loaded from cache (age: ${response.data.age}s)`);
      } else if (response.data.fallback) {
        console.log('⚠️ Using fallback coins data due to rate limiting');
      } else {
        console.log('🆕 Fresh coins data loaded');
      }
      
    } catch (error) {
      console.error('Error fetching coins:', error);
      
      // Set fallback coins if API fails completely
      const fallbackCoins = [
        { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 65000, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
        { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 3500, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' }
      ];
      setAvailableCoins(fallbackCoins);
      
      const fallbackPrices = {};
      fallbackCoins.forEach(coin => {
        fallbackPrices[coin.id] = coin.current_price;
      });
      setCoinPrices(fallbackPrices);
      
      console.log('⚠️ Using local fallback coins due to API error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCrypto = (amount) => {
    return amount.toFixed(8);
  };
  const handlePurchase = async () => {
    // Basic validation
    if (!selectedCoin || !amountINR || parseFloat(amountINR) <= 0) {
      setPurchaseResult({
        success: false,
        message: 'Please select a coin and enter a valid amount.'
      });
      return;
    }

    const purchaseAmount = parseFloat(amountINR);
    
    // Validate amount is a number
    if (isNaN(purchaseAmount)) {
      setPurchaseResult({
        success: false,
        message: 'Please enter a valid numeric amount.'
      });
      return;
    }
    
    // Check minimum amount
    if (purchaseAmount < 100) {
      setPurchaseResult({
        success: false,
        message: 'Minimum purchase amount is ₹100.'
      });
      return;
    }
    
    // Check maximum amount (wallet balance)
    if (purchaseAmount > walletBalance) {
      setPurchaseResult({
        success: false,
        message: `Insufficient wallet balance. You have ₹${walletBalance.toLocaleString('en-IN')} available, but trying to spend ₹${purchaseAmount.toLocaleString('en-IN')}.`
      });
      return;
    }
    
    // Additional safety check - prevent extremely large amounts
    if (purchaseAmount > 10000000) { // 1 crore limit
      setPurchaseResult({
        success: false,
        message: 'Maximum purchase limit is ₹1,00,00,000 per transaction.'
      });
      return;
    }

    setBuying(true);
    
    try {
      // Double-check wallet balance before proceeding (safety check)
      const currentBalance = parseFloat(localStorage.getItem('walletBalance') || '0');
      if (purchaseAmount > currentBalance) {
        setPurchaseResult({
          success: false,
          message: 'Transaction failed: Insufficient balance. Please refresh and try again.'
        });
        setBuying(false);
        return;
      }
      
      // Get selected coin data
      const coin = availableCoins.find(c => c.id === selectedCoin);
      const coinPriceUSD = coinPrices[selectedCoin];
      
      if (!coin || !coinPriceUSD) {
        setPurchaseResult({
          success: false,
          message: 'Error: Coin data not available. Please try again.'
        });
        setBuying(false);
        return;
      }
      
      // Convert INR to USD (approximate rate: 1 USD = 83 INR)
      const usdAmount = purchaseAmount / 83;
      const cryptoQuantity = usdAmount / coinPriceUSD;      // Create purchase record
      const purchase = {
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        coinImage: coin.image,
        quantity: cryptoQuantity,
        avgBuyPrice: coinPriceUSD,
        totalSpentINR: purchaseAmount,
        totalSpentUSD: usdAmount,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString('en-IN')
      };

      // Update wallet balance
      const newBalance = walletBalance - purchaseAmount;
      localStorage.setItem('walletBalance', newBalance.toString());
      setWalletBalance(newBalance);

      // Save purchase to holdings
      const existingHoldings = JSON.parse(localStorage.getItem('holdings') || '[]');
      
      // Check if we already have this coin
      const existingHoldingIndex = existingHoldings.findIndex(holding => holding.coinId === coin.id);
      
      if (existingHoldingIndex >= 0) {
        // Update existing holding
        const existingHolding = existingHoldings[existingHoldingIndex];
        const totalQuantity = existingHolding.quantity + cryptoQuantity;
        const totalSpent = existingHolding.totalSpentINR + purchaseAmount;
        const avgPrice = totalSpent / totalQuantity / 83; // Average price in USD
          existingHoldings[existingHoldingIndex] = {
          ...existingHolding,
          quantity: totalQuantity,
          totalSpentINR: totalSpent,
          totalSpentUSD: totalSpent / 83,
          avgBuyPrice: avgPrice, // Average buy price
          lastUpdated: Date.now()
        };
      } else {
        // Add new holding
        existingHoldings.push(purchase);
      }

      localStorage.setItem('holdings', JSON.stringify(existingHoldings));

      // Show success message
      setPurchaseResult({
        success: true,
        message: `Successfully purchased ${formatCrypto(cryptoQuantity)} ${coin.symbol.toUpperCase()} for ${formatCurrency(purchaseAmount)}!`,
        details: {
          coin: coin.name,
          quantity: cryptoQuantity,
          symbol: coin.symbol.toUpperCase(),
          amount: purchaseAmount
        }
      });

      // Reset form
      setSelectedCoin('');
      setAmountINR('');

    } catch (error) {
      setPurchaseResult({
        success: false,
        message: 'Transaction failed. Please try again.'
      });
      console.error('Purchase error:', error);
    } finally {
      setBuying(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    
    // Allow empty string for clearing
    if (value === '') {
      setAmountINR('');
      return;
    }
    
    // Only allow numbers and decimal point
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }
    
    const numValue = parseFloat(value);
    
    // Prevent negative numbers
    if (numValue < 0) {
      return;
    }
    
    // Limit to 2 decimal places
    if (value.includes('.') && value.split('.')[1].length > 2) {
      return;
    }
    
    // Prevent amounts higher than 10 crore (safety limit)
    if (numValue > 100000000) {
      return;
    }
    
    setAmountINR(value);
  };
  const getAmountValidationMessage = () => {
    if (!amountINR) return null;
    
    const amount = parseFloat(amountINR);
    
    if (isNaN(amount)) {
      return { type: 'error', message: 'Invalid amount' };
    }
    
    if (amount < 100) {
      return { type: 'error', message: 'Minimum amount is ₹100' };
    }
    
    if (amount > walletBalance) {
      return { 
        type: 'error', 
        message: `Exceeds wallet balance by ₹${(amount - walletBalance).toLocaleString('en-IN')}` 
      };
    }
    
    if (amount > 10000000) {
      return { type: 'error', message: 'Maximum limit is ₹1,00,00,000' };
    }
    
    return { type: 'success', message: 'Valid amount' };
  };

  const calculateCryptoAmount = () => {
    if (!selectedCoin || !amountINR || !coinPrices[selectedCoin]) return 0;
    const usdAmount = parseFloat(amountINR) / 83;
    return usdAmount / coinPrices[selectedCoin];
  };

  const dismissResult = () => {
    setPurchaseResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
          <span className="text-white text-lg">Loading cryptocurrencies...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Buy Cryptocurrency
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Purchase cryptocurrencies with your INR wallet balance
          </p>
        </div>

        {/* Purchase Result Modal */}
        {purchaseResult && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
              <CardContent className="p-6">
                <div className="text-center">
                  {purchaseResult.success ? (
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  ) : (
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                  )}
                  
                  <h3 className={`text-xl font-bold mb-3 ${purchaseResult.success ? 'text-green-400' : 'text-red-400'}`}>
                    {purchaseResult.success ? 'Purchase Successful!' : 'Purchase Failed'}
                  </h3>
                  
                  <p className="text-gray-300 mb-6">{purchaseResult.message}</p>
                  
                  <button
                    onClick={dismissResult}
                    className="w-full btn-modern"
                  >
                    Continue
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Purchase Form */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <ShoppingCart className="h-6 w-6 text-green-400" />
                    Purchase Details
                  </h2>

                  <div className="space-y-6">
                    {/* Coin Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Select Cryptocurrency
                      </label>
                      <select
                        value={selectedCoin}
                        onChange={(e) => setSelectedCoin(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="" className="bg-slate-800 text-gray-300">Choose a cryptocurrency...</option>
                        {availableCoins.map((coin) => (
                          <option key={coin.id} value={coin.id} className="bg-slate-800 text-white">
                            {coin.name} ({coin.symbol.toUpperCase()}) - ${coin.current_price.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Amount to Spend (INR)
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />                        <input
                          type="number"
                          value={amountINR}
                          onChange={handleAmountChange}
                          placeholder="Enter amount in INR"
                          min="100"
                          max={walletBalance}
                          className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                            getAmountValidationMessage()?.type === 'error' 
                              ? 'border-red-500 focus:ring-red-500' 
                              : getAmountValidationMessage()?.type === 'success'
                              ? 'border-green-500 focus:ring-green-500'
                              : 'border-white/20 focus:ring-green-500'
                          }`}
                        />
                      </div>
                      {getAmountValidationMessage() && (
                        <p className={`text-sm mt-2 ${
                          getAmountValidationMessage().type === 'error' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {getAmountValidationMessage().message}
                        </p>
                      )}
                      <p className="text-sm text-gray-400 mt-2">
                        Minimum: ₹100 • Maximum: {formatCurrency(walletBalance)} • Daily limit: ₹1,00,00,000
                      </p>
                    </div>

                    {/* Purchase Preview */}
                    {selectedCoin && amountINR && (
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-3">Purchase Preview</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">You will receive:</span>
                            <span className="text-green-400 font-medium">
                              {formatCrypto(calculateCryptoAmount())} {availableCoins.find(c => c.id === selectedCoin)?.symbol.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Price per coin:</span>
                            <span className="text-white">${coinPrices[selectedCoin]?.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total cost:</span>
                            <span className="text-white font-medium">{formatCurrency(parseFloat(amountINR || 0))}</span>
                          </div>
                        </div>
                      </div>
                    )}                    {/* Purchase Button */}
                    <button
                      onClick={handlePurchase}
                      disabled={
                        !selectedCoin || 
                        !amountINR || 
                        buying || 
                        getAmountValidationMessage()?.type === 'error'
                      }
                      className="w-full btn-modern disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {buying ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5" />
                          Buy Cryptocurrency
                        </>
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Wallet Balance */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-green-400" />
                    Wallet Balance
                  </h3>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400 mb-2">
                      {formatCurrency(walletBalance)}
                    </p>
                    <p className="text-sm text-gray-400">Available for purchases</p>
                  </div>
                </CardContent>
              </Card>

              {/* Top Cryptocurrencies */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    Popular Coins
                  </h3>
                  <div className="space-y-3">
                    {availableCoins.slice(0, 5).map((coin) => (
                      <div
                        key={coin.id}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer"
                        onClick={() => setSelectedCoin(coin.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={coin.image}
                            alt={coin.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div>
                            <p className="font-medium text-white text-sm">{coin.name}</p>
                            <p className="text-xs text-gray-400">{coin.symbol.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white text-sm font-medium">${coin.current_price.toFixed(2)}</p>
                          <p className={`text-xs ${coin.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                            {coin.price_change_percentage_24h?.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Purchase Tips */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">💡 Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Start with small amounts</li>
                    <li>• Diversify your portfolio</li>
                    <li>• Do your own research</li>
                    <li>• Never invest more than you can afford to lose</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyPage;
