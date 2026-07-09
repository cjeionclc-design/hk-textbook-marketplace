import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import client from '../api/client';
import TextbookCard from '../components/TextbookCard';
import FilterSidebar from '../components/FilterSidebar';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({});
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    client.get('/categories').then(res => setCategories(res.data));
  }, []);

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
      setTotalPages(res.data.total_pages);
    }).finally(() => setLoading(false));
  }, [filters, page, searchParams]);

  return (
    <div className="flex gap-4 lg:gap-6">
      <aside className="hidden md:block w-56 lg:w-64 shrink-0">
        <div className="sticky top-20">
          <FilterSidebar filters={filters} onChange={setFilters} categories={categories} />
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4 gap-2">
          <h2 className="text-base sm:text-lg font-semibold truncate">
            {filters.search ? `"${filters.search}"` : 'All Textbooks'}
          </h2>
          <button onClick={() => setShowFilter(true)}
            className="md:hidden text-sm text-blue-600 border border-blue-300 rounded-lg px-3 py-1 shrink-0">
            Filter
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No listings found</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {listings.map(l => <TextbookCard key={l.id} listing={l} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6 flex-wrap">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i + 1} onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded text-sm ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
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
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowFilter(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Filters</span>
              <button onClick={() => setShowFilter(false)} className="text-gray-400 text-xl">✕</button>
            </div>
            <FilterSidebar filters={filters} onChange={(f) => { setFilters(f); setShowFilter(false); }} categories={categories} />
          </div>
        </div>
      )}
    </div>
  );
}
