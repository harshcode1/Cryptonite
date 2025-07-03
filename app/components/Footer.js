import React from 'react';
import Link from 'next/link';
import { 
  Bitcoin, 
  Twitter, 
  Github, 
  Mail, 
  Phone, 
  MapPin,
  TrendingUp,
  Zap
} from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-t border-white/10">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75"></div>
                                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Cryptonite
                            </span>
                        </div>
                        <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                            Your ultimate destination for cryptocurrency market data, analysis, and insights. 
                            Stay ahead of the market with real-time data and professional tools.
                        </p>
                        <div className="flex items-center gap-4">
                            <a 
                                href="#" 
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
                            >
                                <Twitter className="h-5 w-5 text-blue-400" />
                            </a>
                            <a 
                                href="#" 
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
                            >
                                <Github className="h-5 w-5 text-gray-300" />
                            </a>
                            <a 
                                href="mailto:info@cryptonite.com" 
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20"
                            >
                                <Mail className="h-5 w-5 text-green-400" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                                    <TrendingUp className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/ProductsPage" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group">
                                    <Bitcoin className="h-4 w-4 text-orange-400 group-hover:scale-110 transition-transform duration-300" />
                                    Markets
                                </Link>
                            </li>                            <li>
                                <Link href="/AboutPage" className="text-gray-300 hover:text-white transition-colors duration-300">
                                    About Us
                                </Link>                            </li>
                            <li>
                                <Link href="/buy" className="text-gray-300 hover:text-white transition-colors duration-300">
                                    Buy Crypto
                                </Link>
                            </li>
                            <li>
                                <Link href="/portfolio" className="text-gray-300 hover:text-white transition-colors duration-300">
                                    Holdings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-300">
                                <Mail className="h-4 w-4 text-blue-400" />
                                <a href="mailto:info@cryptonite.com" className="hover:text-white transition-colors duration-300">
                                    info@cryptonite.com
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <Phone className="h-4 w-4 text-green-400" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-300">
                                <MapPin className="h-4 w-4 text-red-400" />
                                <span>Global Platform</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} Cryptonite. All rights reserved.
                        </p>                        <div className="flex items-center gap-6 text-sm">
                            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                                Terms of Service
                            </Link>
                            <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-300">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
