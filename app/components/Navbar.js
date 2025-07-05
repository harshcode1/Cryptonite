"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, TrendingUp, Zap, BarChart3, Globe, ShoppingCart, Wallet } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Function to update wallet balance
    const updateWalletBalance = () => {
      const savedBalance = localStorage.getItem('walletBalance');
      if (savedBalance) {
        setWalletBalance(parseFloat(savedBalance));
      } else {
        // Set initial balance of ₹100,000
        localStorage.setItem('walletBalance', '100000');
        setWalletBalance(100000);
      }
    };
    
    // Initialize wallet balance
    updateWalletBalance();
    
    // Listen for localStorage changes (from other tabs or components)
    const handleStorageChange = (e) => {
      if (e.key === 'walletBalance') {
        updateWalletBalance();
      }
    };
    
    // Listen for custom wallet update events
    const handleWalletUpdate = () => {
      updateWalletBalance();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('walletUpdated', handleWalletUpdate);
    
    // Also check for balance changes every 5 seconds
    const balanceCheckInterval = setInterval(updateWalletBalance, 5000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('walletUpdated', handleWalletUpdate);
      clearInterval(balanceCheckInterval);
    };
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
        : 'bg-slate-900/60 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Cryptonite
              </span>
            </Link>
          </div>          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/ProductsPage" className="nav-link-modern">
              <TrendingUp className="h-4 w-4" />
              Markets
            </Link>            <Link href="/AboutPage" className="nav-link-modern">
              <Globe className="h-4 w-4" />
              About
            </Link>
            <Link href="/buy" className="nav-link-modern">
              <ShoppingCart className="h-4 w-4" />
              Buy Crypto
            </Link>            <Link href="/portfolio" className="nav-link-modern">
              <BarChart3 className="h-4 w-4" />
              Holdings
            </Link>
            
            {/* Wallet Balance */}
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl border border-green-500/20">
              <Wallet className="h-4 w-4 text-white" />
              <span className="text-white font-medium">{formatCurrency(walletBalance)}</span>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-900/90 backdrop-blur-xl rounded-xl mt-2 border border-white/10">
              <Link href="/ProductsPage" className="mobile-nav-link-modern">
                <TrendingUp className="h-4 w-4" />
                Markets
              </Link>              <Link href="/AboutPage" className="mobile-nav-link-modern">
                <Globe className="h-4 w-4" />
                About
              </Link>
              <Link href="/buy" className="mobile-nav-link-modern">
                <ShoppingCart className="h-4 w-4" />
                Buy Crypto
              </Link>              <Link href="/portfolio" className="mobile-nav-link-modern">
                <BarChart3 className="h-4 w-4" />
                Holdings
              </Link>
              
              {/* Mobile Wallet Balance */}
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl border border-green-500/20 mt-2">
                <Wallet className="h-4 w-4 text-white" />
                <span className="text-white font-medium">{formatCurrency(walletBalance)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;