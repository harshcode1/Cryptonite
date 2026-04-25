"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, TrendingUp, Zap } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    const updateWalletBalance = () => {
      const savedBalance = localStorage.getItem('walletBalance');
      if (savedBalance) {
        setWalletBalance(parseFloat(savedBalance));
      } else {
        localStorage.setItem('walletBalance', '100000');
        setWalletBalance(100000);
      }
    };

    updateWalletBalance();

    const handleStorageChange = (e) => {
      if (e.key === 'walletBalance') {
        updateWalletBalance();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
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
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-slate-900/60 backdrop-blur-md'
      }`}
    >
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
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/ProductsPage"
              className="text-white/80 hover:text-white transition-colors duration-300 text-lg"
            >
              Markets
            </Link>
            <Link
              href="/AboutPage"
              className="text-white/80 hover:text-white transition-colors duration-300 text-lg"
            >
              About
            </Link>
            <Link
              href="/buy"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 text-lg font-semibold"
            >
              Buy Crypto
            </Link>
            <Link
              href="/portfolio"
              className="text-white/80 hover:text-white transition-colors duration-300 text-lg"
            >
              Holdings
            </Link>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
          >
            {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/90 backdrop-blur-md shadow-lg">
          <div className="flex flex-col items-center gap-4 py-4">
            <Link
              href="/ProductsPage"
              className="text-white/80 hover:text-white transition-colors duration-300 text-lg"
            >
              Markets
            </Link>
            <Link
              href="/AboutPage"
              className="text-white/80 hover:text-white transition-colors duration-300 text-lg"
            >
              About
            </Link>
            <Link
              href="/buy"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 text-lg font-semibold"
            >
              Buy Crypto
            </Link>
            <Link
              href="/portfolio"
              className="text-white/80 hover:text-white transition-colors duration-300 text-lg"
            >
              Holdings
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;