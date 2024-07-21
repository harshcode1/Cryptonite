"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Using Next.js Image component for optimized image handling
import Link from 'next/link';

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <header className={`text-gray-600 body-font shadow-md ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <div className="flex title-font font-medium items-center mb-4 md:mb-0">
                    <Image 
                        src="/bit.png" 
                        alt="Cryptonite Logo" 
                        width={40} 
                        height={40} 
                        className="rounded-full"
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }} // Ensuring the aspect ratio is preserved
                    />
                    <Link href="/" className="ml-3 text-xl">Cryptonite</Link>
                </div>
                <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    <Link href="/ProductsPage" className={`mr-5 hover:text-${darkMode ? 'white' : 'gray-900'}`}>Products</Link>
                    <a className={`mr-5 hover:text-${darkMode ? 'white' : 'gray-900'}`}>Third Link</a>
                    <a className={`mr-5 hover:text-${darkMode ? 'white' : 'gray-900'}`}>Fourth Link</a>
                </nav>
                <button 
                    onClick={toggleDarkMode} 
                    className="inline-flex items-center bg-black border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-base mt-4 text-white md:mt-0"
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
