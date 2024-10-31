"use client"
import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '../components/card';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Cryptonite</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover the fascinating world of cryptocurrency and how it has evolved over the years.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold mb-8">The History of Bitcoin & Cryptocurrency</h2>
                <div className="space-y-6 text-gray-700">
                  {/* Content split into paragraphs for better readability */}
                  <p>
                    Bitcoin, the first decentralized digital currency, was launched in 2009 by an anonymous individual or group under the pseudonym Satoshi Nakamoto. The idea of a digital currency is not new, but Bitcoin was the first to solve the double-spending problem, allowing for secure, verifiable transactions without the need for a trusted third party.
                  </p>
                  {/* Add more paragraphs here */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Learn More</h2>
          <p className="text-white mb-8 text-lg">
            For a more in-depth look at cryptocurrency, explore our educational resources.
          </p>
          <Link 
            href="https://en.wikipedia.org/wiki/Cryptocurrency" 
            className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-blue-600 bg-white rounded-lg hover:bg-gray-50 transition-colors duration-300"
          >
            Visit Wiki
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;