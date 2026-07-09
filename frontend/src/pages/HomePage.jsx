import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import SearchBar from '../components/SearchBar';
import TextbookCard from '../components/TextbookCard';
import { CardSkeleton } from '../components/Skeleton';

const CATEGORY_ICONS = {
  chinese: '📖', english: '📝', math: '🔢', physics: '⚡', chemistry: '🧪',
  biology: '🧬', economics: '📊', bafs: '💼', ict: '💻', history: '📜',
  geography: '🌏', ls: '🧠', chinese_history: '🏯', chinese_literature: '📚',
  music: '🎵', visual_arts: '🎨', pe: '🏃',
};

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get('/categories'),
      client.get('/listings?page_size=12'),
    ]).then(([catRes, listRes]) => {
      setCategories(catRes.data);
      setListings(listRes.data.items);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="py-8 sm:py-14 text-center">
        <div className="text-5xl sm:text-6xl mb-4 animate-[fadeIn_0.6s_ease-out]">📚</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 animate-[fadeIn_0.6s_ease-out_0.1s]">
          <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">HKTextbook</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mb-8 animate-[fadeIn_0.6s_ease-out_0.2s]">
          🏫 香港学生二手书买卖 · 原价对比 · 新旧评分 · 安心面交
        </p>
        <div className="animate-[fadeIn_0.6s_ease-out_0.3s]">
          <SearchBar />
        </div>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-gray-800">📂 科目分类</h2>
          <Link to="/search" className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 font-bold">全部 →</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
          {categories.map((cat, i) => (
            <Link key={cat.id} to={`/search?category=${cat.id}`}
              className="group flex flex-col items-center bg-white rounded-2xl p-2 sm:p-3 border border-gray-50 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100 transition-all duration-200 hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 30}ms` }}>
              <span className="text-xl sm:text-2xl group-hover:scale-125 transition-transform duration-300">{CATEGORY_ICONS[cat.name] || '📚'}</span>
              <span className="text-[10px] sm:text-xs mt-1.5 text-gray-500 text-center leading-tight font-bold">{cat.name_zh}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-gray-800">🆕 最新上架</h2>
          <Link to="/search" className="text-xs sm:text-sm text-orange-500 hover:text-orange-600 font-bold">查看更多 →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-50 shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-400 font-bold">还没有人发布书籍</p>
            <p className="text-gray-300 text-sm mt-1">成为第一个卖家吧！</p>
            <Link to="/create" className="inline-block mt-3 bg-gradient-to-r from-orange-400 to-pink-400 text-white px-5 py-2 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-orange-200 transition-all hover:scale-105 active:scale-95">🚀 立即发布</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map(l => <TextbookCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>
    </div>
  );
}
