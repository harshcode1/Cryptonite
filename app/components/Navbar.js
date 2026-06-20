"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Zap, Wallet } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const updateWalletBalance = () => {
      const saved = localStorage.getItem('walletBalance');
      if (saved) {
        setWalletBalance(parseFloat(saved));
      } else {
        localStorage.setItem('walletBalance', '100000');
        setWalletBalance(100000);
      }
    };
    updateWalletBalance();

    const handleStorageChange = (e) => { if (e.key === 'walletBalance') updateWalletBalance(); };
    const handleWalletUpdated = (e) => setWalletBalance(e.detail.newBalance);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('walletUpdated', handleWalletUpdated);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('walletUpdated', handleWalletUpdated);
    };
  }, []);

  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-[rgba(8,12,30,0.85)] backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
        : 'bg-[rgba(8,12,30,0.5)] backdrop-blur-md border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="ml-3 text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Cryptonite
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { href: '/ProductsPage', label: 'Markets' },
              { href: '/AboutPage',    label: 'About'   },
              { href: '/portfolio',    label: 'Holdings' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-white/70 hover:text-white hover:bg-white/8 rounded-xl text-sm font-medium transition-all duration-200"
              >
                {label}
              </Link>
            ))}

            {/* Wallet balance pill */}
            <Link
              href="/portfolio"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200"
            >
              <Wallet className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-bold font-mono">{formatINR(walletBalance)}</span>
            </Link>

            <Link
              href="/buy"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 hover:scale-105"
            >
              Buy Crypto
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 transition-all duration-200"
          >
            {isMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/8 bg-[rgba(8,12,30,0.95)] backdrop-blur-xl">
          <div className="flex flex-col gap-1 p-4">
            {[
              { href: '/ProductsPage', label: 'Markets'  },
              { href: '/AboutPage',    label: 'About'    },
              { href: '/portfolio',    label: 'Holdings' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-3 text-white/80 hover:text-white hover:bg-white/8 rounded-xl text-base font-medium transition-all duration-200"
              >
                {label}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 mt-1">
              <Wallet className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-bold font-mono">{formatINR(walletBalance)}</span>
            </div>
            <Link
              href="/buy"
              onClick={() => setIsMenuOpen(false)}
              className="mt-1 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-base font-bold text-center transition-all duration-300"
            >
              Buy Crypto
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
