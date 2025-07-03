import React from 'react';
import { Search, Filter } from 'lucide-react';

const Searchbar = ({ setSearchTerm }) => {
  return (
    <div className="relative w-full mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300
                 text-white placeholder-gray-400 font-medium shadow-2xl
                 hover:bg-white/20 hover:border-white/30"
        placeholder="Search cryptocurrencies by name or symbol..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
        <div className="h-6 w-px bg-white/20 mr-3"></div>
        <Filter className="h-5 w-5 text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer" />
      </div>
    </div>
  );
};

export default Searchbar;
