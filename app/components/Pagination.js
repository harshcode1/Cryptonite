const Pagination = ({ coinsPerPage, totalCoins, paginate, currentPage }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalCoins / coinsPerPage);
  
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className="flex justify-center mt-6">
        <nav className="relative z-0 inline-flex gap-2">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`pagination-number ${
                currentPage === number
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 hover:bg-blue-50'
              }`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </nav>
      </div>
    );
  };
  
  export default Pagination;
  