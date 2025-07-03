import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ coinsPerPage, totalCoins, paginate, currentPage }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalCoins / coinsPerPage);
    
    // Calculate which pages to show
    const maxPagesToShow = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
  
    return (
        <div className="flex justify-center items-center mt-8 gap-2">
            <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30"
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </button>
            
            {startPage > 1 && (
                <>
                    <button
                        onClick={() => paginate(1)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30"
                    >
                        1
                    </button>
                    {startPage > 2 && (
                        <span className="px-2 text-gray-400">...</span>
                    )}
                </>
            )}
            
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border ${
                        currentPage === number
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-lg'
                            : 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30'
                    }`}
                >
                    {number}
                </button>
            ))}
            
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                        onClick={() => paginate(totalPages)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30"
                    >
                        {totalPages}
                    </button>
                </>
            )}
            
            <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30"
            >
                Next
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
};

export default Pagination;
  