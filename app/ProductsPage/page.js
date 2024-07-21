"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Searchbar from '../components/Searchbar';
import Markettable from '../components/Markettable';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';

export default function ProductsPage() {
    const [coins, setCoins] = useState([]);
    const [filteredCoins, setFilteredCoins] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [coinsPerPage] = useState(10);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                    params: {
                        vs_currency: 'usd',
                        order: 'market_cap_desc',
                        per_page: 100,
                        page: 1,
                        sparkline: false,
                    },
                });
                setCoins(response.data);
                setFilteredCoins(response.data);
            } catch (error) {
                setError('Error fetching coins. Please try again later.');
                console.error('Error fetching coins:', error);
            }
        };

        fetchCoins();
    }, []);

    useEffect(() => {
        const filtered = coins.filter(coin =>
            coin.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCoins(filtered);
        setCurrentPage(1); // Reset to first page on search
    }, [searchTerm, coins]);

    // Get current coins
    const indexOfLastCoin = currentPage * coinsPerPage;
    const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
    const currentCoins = filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
            <div className="container mx-auto p-6">
                <div className="w-[60%] text-black flex items-center justify-center mb-6">
                    <Searchbar setSearchTerm={setSearchTerm} />
                </div>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <Markettable coins={currentCoins} />
                            <Pagination
                                coinsPerPage={coinsPerPage}
                                totalCoins={filteredCoins.length}
                                paginate={paginate}
                                currentPage={currentPage}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <Sidebar title="Watchlist" coins={coins.slice(0, 5)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
