"use client"
import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '../components/card';
import { 
  Bitcoin, 
  TrendingUp, 
  Globe, 
  Shield, 
  Zap, 
  Users, 
  ExternalLink,
  Sparkles,
  Target,
  Award
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-60 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-full">
                  <Bitcoin className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
              About Cryptonite
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your gateway to the revolutionary world of cryptocurrency. Discover, analyze, and trade with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Choose Cryptonite?</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We provide cutting-edge tools and insights to help you navigate the crypto markets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:scale-105 transition-all duration-500">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Real-Time Data</h3>
                <p className="text-gray-300">
                  Live market data, prices, and analytics updated in real-time to keep you ahead of the market
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:scale-105 transition-all duration-500">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Secure Platform</h3>
                <p className="text-gray-300">
                  Built with security-first principles to protect your data and provide a safe trading environment
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:scale-105 transition-all duration-500">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Lightning Fast</h3>
                <p className="text-gray-300">
                  Optimized performance ensures you never miss a trading opportunity with instant data updates
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl max-w-6xl mx-auto">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="h-8 w-8 text-yellow-400" />
                    <h2 className="text-3xl font-bold text-white">The Bitcoin Revolution</h2>
                  </div>
                  <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p>
                      Bitcoin, launched in 2009 by the mysterious Satoshi Nakamoto, revolutionized the concept of money itself. 
                      For the first time in history, we had a truly decentralized digital currency that required no central authority.
                    </p>
                    <p>
                      What started as an experiment has grown into a trillion-dollar asset class, spawning thousands of 
                      cryptocurrencies and blockchain projects that are reshaping finance, technology, and society.
                    </p>
                    <p>
                      From solving the double-spending problem to enabling programmable money through smart contracts, 
                      cryptocurrency has opened doors to innovations we never thought possible.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-6 rounded-2xl border border-orange-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="h-6 w-6 text-orange-400" />
                      <h3 className="font-bold text-white">2009</h3>
                    </div>
                    <p className="text-gray-300 text-sm">Bitcoin network goes live with the genesis block</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-2xl border border-blue-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="h-6 w-6 text-blue-400" />
                      <h3 className="font-bold text-white">2017</h3>
                    </div>
                    <p className="text-gray-300 text-sm">Cryptocurrency boom brings mainstream attention</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-2xl border border-green-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Globe className="h-6 w-6 text-green-400" />
                      <h3 className="font-bold text-white">Today</h3>
                    </div>
                    <p className="text-gray-300 text-sm">Institutional adoption and global recognition</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-gray-300">Cryptocurrencies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
                $3T+
              </div>
              <div className="text-gray-300">Market Cap</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
                100M+
              </div>
              <div className="text-gray-300">Users Worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-gray-300">Market Activity</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-white/20 shadow-2xl max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-white mb-6">Ready to Explore?</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join millions of users who trust Cryptonite for their cryptocurrency journey. 
                Start exploring the markets today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/ProductsPage"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  <TrendingUp className="h-5 w-5" />
                  Explore Markets
                </Link>
                <Link 
                  href="https://en.wikipedia.org/wiki/Cryptocurrency"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/20"
                >
                  <ExternalLink className="h-5 w-5" />
                  Learn More
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;