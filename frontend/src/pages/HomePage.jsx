import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import SearchBar from '../components/SearchBar';
import TextbookCard from '../components/TextbookCard';
import { CardSkeleton } from '../components/Skeleton';
import { CategoryIcon, ShopIcon, RefreshIcon } from '../components/Icon';

const COLORS = ['#ff6b6b','#a78bfa','#4ecdc4','#f97316','#6bcb77','#06b6d4','#8b5cf6','#f59e0b'];

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
      <div className="py-8 sm:py-16 text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
          <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">二手教科书</span>
          <span className="text-gray-800 hidden sm:inline"> 买卖平台</span>
        </h1>
        <p className="text-gray-500 text-xs sm:text-base font-medium mb-5 sm:mb-8">原价对比 · 新旧评分 · 同校面交</p>
        <SearchBar />
      </div>

      <section className="mb-6 sm:mb-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">科目分类</h2>
          <Link to="/search" className="btn btn-ghost btn-sm">全部 →</Link>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
          {categories.slice(0, 8).map((cat, i) => (
            <Link key={cat.id} to={`/search?category=${cat.id}`}
              className="btn glass !rounded-full !py-1.5 !px-3 sm:!py-2 sm:!px-4 !text-xs sm:!text-sm font-semibold text-gray-600 hover:text-gray-800 active:scale-95 flex items-center gap-1.5"
              style={{borderColor:`${COLORS[i%COLORS.length]}30`}}>
              <span style={{color:COLORS[i%COLORS.length]}}><CategoryIcon name={cat.name} className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></span>
              {cat.name_zh}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-1.5 sm:gap-2.5">
          {categories.map((cat, i) => (
            <Link key={cat.id} to={`/search?category=${cat.id}`}
              className="glass flex flex-col items-center p-2 sm:p-3 sm:py-4 gap-1.5 sm:gap-2 group !rounded-xl sm:!rounded-2xl">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform group-active:scale-95 duration-150"
                style={{background:`${COLORS[i%COLORS.length]}20`, color:COLORS[i%COLORS.length]}}>
                <CategoryIcon name={cat.name} className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[10px] sm:text-xs text-gray-500 text-center font-semibold leading-tight">{cat.name_zh}</span>
            </Link>
          ))}
        </div>
      </section>

      {recentListings.length > 0 && (
        <section className="mb-6 sm:mb-10">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-1 h-4 sm:h-5 rounded-full" style={{background:'#ff6b6b'}} />
            <h2 className="text-base sm:text-lg font-bold text-gray-800">最近浏览</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {recentListings.slice(0,3).map(l => <TextbookCard key={l.id} listing={l} />)}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 sm:h-5 rounded-full" style={{background:'#4ecdc4'}} />
            <h2 className="text-base sm:text-lg font-bold text-gray-800">最新上架</h2>
          </div>
          <Link to="/search" className="btn btn-ghost btn-sm">更多 →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[1,2,3].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-16 sm:py-20 glass">
            <ShopIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-200 mb-3 sm:mb-4" />
            <p className="text-gray-400 font-semibold text-base sm:text-lg mb-1">还没有人发布书籍</p>
            <p className="text-gray-300 text-xs sm:text-sm mb-4">成为第一个卖家吧</p>
            <Link to="/create" className="btn btn-primary">立即发布</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {listings.map(l => <TextbookCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>
    </div>
  );
}
