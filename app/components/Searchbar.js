// Searchbar.jsx
export default function Searchbar({ setSearchTerm }) {
  return (
      <input
          type="text"
          placeholder="Search for a coin..."
          className="w-full p-3 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearchTerm(e.target.value)}
      />
  );
}
