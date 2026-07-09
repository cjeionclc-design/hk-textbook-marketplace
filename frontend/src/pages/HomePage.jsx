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
      <div className="py-10 sm:py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          <span className="text-indigo-600">二手教科书</span>
          <span className="text-gray-900"> 买卖平台</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-md mx-auto">
          香港学生专属 · 原价对比 · 新旧评分 · 安心面交
        </p>
        <SearchBar />
      </div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">浏览科目</h2>
          <Link to="/search" className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium">全部 →</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
          {categories.map(cat => (
            <Link key={cat.id} to={`/search?category=${cat.id}`}
              className="group flex flex-col items-center bg-white rounded-2xl p-2.5 sm:p-3 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200">
              <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-200">{CATEGORY_ICONS[cat.name] || '📚'}</span>
              <span className="text-[10px] sm:text-xs mt-1.5 text-gray-500 text-center leading-tight font-medium">{cat.name_zh}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">最新上架</h2>
          <Link to="/search" className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium">查看更多 →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-4xl mb-3">📚</div>
            <p className="text-gray-400 text-sm">还没有人发布书籍</p>
            <Link to="/create" className="text-indigo-600 text-sm font-medium mt-1 inline-block">成为第一个 →</Link>
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
