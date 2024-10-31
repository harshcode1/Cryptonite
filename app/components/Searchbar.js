import React from 'react';
import { Search } from 'lucide-react';

const Searchbar = ({ setSearchTerm }) => {
  return (
    <div className="relative max-w-md w-full mx-auto mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        placeholder="Search cryptocurrencies..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default Searchbar;
