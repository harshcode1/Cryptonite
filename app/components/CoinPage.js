"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const CoinPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [coin, setCoin] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            const fetchCoin = async () => {
                const options = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        'x-cg-pro-api-key': 'CG-FXDQoSrSThEsbJnimYvneMsG' // Replace this with your actual API key
                    }
                };

                try {
                    const response = await fetch(`https://pro-api.coingecko.com/api/v3/coins/${id}`, options);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setCoin(data);
                } catch (error) {
                    setError('Error fetching coin data. Please try again later.');
                }
            };

            fetchCoin();
        }
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!coin) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>{coin.name}</h1>
            <p>{coin.symbol}</p>
            <p>${coin.market_data.current_price.usd}</p>
            <p>{coin.description.en}</p>
        </div>
    );
};

export default CoinPage;
