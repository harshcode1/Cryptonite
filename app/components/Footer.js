import React from 'react';
import Link from 'next/link';
import { Bitcoin, Twitter, Github, Mail, Phone, MapPin, TrendingUp, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/8 bg-[rgba(8,12,30,0.8)] backdrop-blur-xl">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75" />
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="ml-3 text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Cryptonite
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed text-sm">
              Professional-grade crypto intelligence. Real-time prices, portfolio analytics,
              and virtual trading — all in one place.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: '#', icon: Twitter, color: 'text-blue-400',  label: 'Twitter' },
                { href: '#', icon: Github,  color: 'text-gray-300',  label: 'GitHub'  },
                { href: 'mailto:info@cryptonite.com', icon: Mail, color: 'text-emerald-400', label: 'Email' },
              ].map(({ href, icon: Icon, color, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-3 rounded-xl glass-premium border border-white/10 hover:border-white/20 hover:scale-110 transition-all duration-300"
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/',             label: 'Home',     icon: TrendingUp, color: 'text-blue-400'   },
                { href: '/ProductsPage', label: 'Markets',  icon: Bitcoin,    color: 'text-orange-400' },
                { href: '/AboutPage',    label: 'About Us', icon: null,       color: null               },
                { href: '/buy',          label: 'Buy Crypto', icon: null,     color: null               },
                { href: '/portfolio',    label: 'Holdings', icon: null,       color: null               },
              ].map(({ href, label, icon: Icon, color }) => (
                <li key={href}>
                  <Link href={href} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm group">
                    {Icon && <Icon className={`h-3.5 w-3.5 ${color} group-hover:scale-110 transition-transform duration-200`} />}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                <a href="mailto:info@cryptonite.com" className="hover:text-white transition-colors duration-200">
                  info@cryptonite.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
                <span>Global Platform</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Cryptonite. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((label) => (
              <Link key={label} href="#" className="text-gray-500 hover:text-white transition-colors duration-200">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
