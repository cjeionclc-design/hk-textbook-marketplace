import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from './Icon';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  return (
    <form onSubmit={e => { e.preventDefault(); if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`); }}
      className="w-full max-w-xl mx-auto">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="搜索书名、科目..."
          className="input-field w-full !pl-11 !py-3.5 !text-base !rounded-2xl !bg-white !border !border-gray-100 focus:!border-red-300 focus:!shadow-[0_0_0_4px_rgba(255,107,107,0.08)]" />
      </div>
    </form>
  );
}
