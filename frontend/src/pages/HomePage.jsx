import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import SearchBar from '../components/SearchBar';
import TextbookCard from '../components/TextbookCard';
import { CardSkeleton } from '../components/Skeleton';
import { CategoryIcon, ShopIcon } from '../components/Icon';

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
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'#ff7b3d'}}>
          <ShopIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          <span style={{color:'#ff7b3d'}}>HK</span><span className="text-gray-700">Textbook</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base font-bold mb-8">
          香港学生二手书买卖 · 原价对比 · 新旧评分 · 安心面交
        </p>
        <SearchBar />
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-gray-700">科目分类</h2>
          <Link to="/search" className="neo-btn px-3 py-1 text-xs font-bold" style={{color:'#ff7b3d'}}>全部 →</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
          {categories.map(cat => (
            <Link key={cat.id} to={`/search?category=${cat.id}`}
              className="group flex flex-col items-center neo-card p-3 hover:shadow-[12px_12px_24px_#e0dbd6,-12px_-12px_24px_#ffffff] transition-all duration-200 hover:-translate-y-0.5">
              <span className="mb-1.5" style={{color:'#ff7b3d'}}><CategoryIcon name={cat.name} className="w-6 h-6 sm:w-7 sm:h-7" /></span>
              <span className="text-[10px] sm:text-xs text-gray-500 text-center leading-tight font-bold">{cat.name_zh}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-extrabold text-gray-700">最新上架</h2>
          <Link to="/search" className="neo-btn px-3 py-1 text-xs font-bold" style={{color:'#ff7b3d'}}>查看更多 →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 neo-card">
            <div className="mb-4"><ShopIcon className="w-12 h-12 mx-auto text-gray-300" /></div>
            <p className="text-gray-400 font-bold">还没有人发布书籍</p>
            <Link to="/create" className="neo-btn-primary px-5 py-2 mt-3 inline-block text-sm">立即发布</Link>
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
