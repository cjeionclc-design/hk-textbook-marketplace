import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import SearchBar from '../components/SearchBar';
import TextbookCard from '../components/TextbookCard';

const CATEGORY_ICONS = {
  chinese: '📖', english: '📝', math: '🔢', physics: '⚡', chemistry: '🧪',
  biology: '🧬', economics: '📊', bafs: '💼', ict: '💻', history: '📜',
  geography: '🌏', ls: '🧠', chinese_history: '🏯', chinese_literature: '📚',
  music: '🎵', visual_arts: '🎨', pe: '🏃',
};

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    client.get('/categories').then(res => setCategories(res.data));
    client.get('/listings?page_size=12').then(res => setListings(res.data.items));
  }, []);

  return (
    <div>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-center mb-2">HK Textbook Marketplace</h1>
        <p className="text-gray-500 text-center mb-6">Buy and sell second-hand textbooks</p>
        <SearchBar />
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Subjects</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
          {categories.map(cat => (
            <Link key={cat.id} to={`/search?category=${cat.id}`}
              className="flex flex-col items-center bg-white rounded-xl p-3 border hover:border-blue-300 transition-colors">
              <span className="text-2xl">{CATEGORY_ICONS[cat.name] || '📚'}</span>
              <span className="text-xs mt-1 text-gray-600 text-center">{cat.name_zh}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Latest Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map(l => <TextbookCard key={l.id} listing={l} />)}
        </div>
      </section>
    </div>
  );
}
