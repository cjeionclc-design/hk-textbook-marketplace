import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import SearchBar from '../components/SearchBar';
import TextbookCard from '../components/TextbookCard';
import { CardSkeleton } from '../components/Skeleton';
import { CategoryIcon, ShopIcon, RefreshIcon } from '../components/Icon';

const COLORS = ['#ff6b6b','#a78bfa','#4ecdc4','#ffd93d','#6bcb77','#f97316','#8b5cf6','#06b6d4'];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentIds] = useState(() => { try { return JSON.parse(localStorage.getItem('recent')||'[]'); } catch { return []; } });
  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    Promise.all([client.get('/categories'), client.get('/listings?page_size=12')])
      .then(([c,l]) => { setCategories(c.data); setListings(l.data.items); }).finally(() => setLoading(false));
    if (recentIds.length > 0) {
      client.get('/listings', { params: { page_size: 12 } }).then(res => {
        setRecentListings(res.data.items.filter(l => recentIds.includes(l.id)));
      }).catch(() => {});
    }
  }, []);

  return (
    <div>
      <div className="py-10 sm:py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">二手教科书</span>
          <span className="text-gray-800"> 买卖平台</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base font-medium mb-8">原价对比 · 新旧评分 · 同校面交</p>
        <SearchBar />
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-800 mb-4">科目分类</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2.5">
          {categories.map((cat, i) => (
            <Link key={cat.id} to={`/search?category=${cat.id}`}
              className="card flex flex-col items-center p-3 py-4 gap-2 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200" style={{background:`${COLORS[i%COLORS.length]}15`,color:COLORS[i%COLORS.length]}}>
                <CategoryIcon name={cat.name} className="w-5 h-5" />
              </div>
              <span className="text-[11px] sm:text-xs text-gray-600 text-center font-semibold">{cat.name_zh}</span>
            </Link>
          ))}
        </div>
      </section>

      {recentListings.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 rounded-full" style={{background:'#ff6b6b'}} />
            <h2 className="text-lg font-bold text-gray-800">最近浏览</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentListings.slice(0,3).map(l => <TextbookCard key={l.id} listing={l} />)}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-5 rounded-full" style={{background:'#4ecdc4'}} />
          <h2 className="text-lg font-bold text-gray-800">最新上架</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 card">
            <ShopIcon className="w-16 h-16 mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-semibold text-lg mb-1">还没有人发布书籍</p>
            <p className="text-gray-300 text-sm mb-4">成为第一个卖家吧</p>
            <Link to="/create" className="btn btn-primary">立即发布</Link>
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
