// Pagination.jsx
export default function Pagination({ coinsPerPage, totalCoins, paginate, currentPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalCoins / coinsPerPage); i++) {
      pageNumbers.push(i);
  }

  return (
      <nav className="mt-4">
          <ul className="inline-flex -space-x-px">
              {pageNumbers.map(number => (
                  <li key={number}>
                      <button
                          onClick={() => paginate(number)}
                          className={`px-4 py-2 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'} border border-gray-300 rounded-lg shadow-sm hover:bg-blue-100`}
                      >
                          {number}
                      </button>
                  </li>
              ))}
          </ul>
      </nav>
  );
}
