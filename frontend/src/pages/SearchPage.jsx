import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../api/client';
import TextbookCard from '../components/TextbookCard';
import FilterSidebar from '../components/FilterSidebar';
import { CardSkeleton } from '../components/Skeleton';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => { client.get('/categories').then(res => setCategories(res.data)); }, []);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('category') || '';
    setFilters(prev => ({ ...prev, search: q || undefined, category_id: cat || undefined }));
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = { page, page_size: 20 };
    const q = searchParams.get('q') || filters.search;
    const cat = searchParams.get('category') || filters.category_id;
    if (q) params.search = q;
    if (cat) params.category_id = cat;
    if (filters.language) params.language = filters.language;
    if (filters.condition) params.condition = filters.condition;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;
    client.get('/listings', { params }).then(res => {
      setListings(res.data.items);
      setTotal(res.data.total);
      setTotalPages(res.data.total_pages);
    }).finally(() => setLoading(false));
  }, [filters, page, searchParams]);

  return (
    <div className="flex gap-5 lg:gap-8">
      <aside className="hidden md:block w-56 lg:w-64 shrink-0">
        <div className="sticky top-20">
          <FilterSidebar filters={filters} onChange={setFilters} categories={categories} />
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-extrabold text-gray-800 truncate">
              {filters.search ? `🔍 "${filters.search}"` : '📚 全部教科书'}
            </h2>
            {!loading && <p className="text-xs text-gray-400 mt-0.5 font-medium">{total} 个结果</p>}
          </div>
          <button onClick={() => setShowFilter(true)}
            className="md:hidden text-sm font-bold text-orange-500 border-2 border-orange-200 rounded-2xl px-4 py-2 shrink-0 hover:bg-orange-50 transition-colors active:scale-95">
            🔍 筛选
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-50 shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 font-bold">没有找到相关书籍</p>
            <p className="text-gray-300 text-sm mt-1 font-medium">试试其他搜索词或筛选条件</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.map(l => <TextbookCard key={l.id} listing={l} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-1.5 mt-8 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => setPage(i + 1)}
                    className={`min-w-[40px] h-10 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                      page === i + 1
                        ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg shadow-orange-200'
                        : 'bg-white border border-gray-100 text-gray-400 hover:border-orange-200'
                    }`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {showFilter && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowFilter(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl p-6 overflow-y-auto rounded-l-3xl">
            <div className="flex justify-between items-center mb-5">
              <span className="font-extrabold text-gray-800">🔍 筛选</span>
              <button onClick={() => setShowFilter(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <FilterSidebar filters={filters} onChange={(f) => { setFilters(f); setShowFilter(false); }} categories={categories} />
          </div>
        </div>
      )}
    </div>
  );
}
