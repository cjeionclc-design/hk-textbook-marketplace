import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search textbooks by title..."
        className="w-full border-2 border-gray-200 rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-base sm:text-lg focus:border-blue-400 focus:outline-none"
      />
    </form>
  );
}
