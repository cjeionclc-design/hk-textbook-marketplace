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
    <div className="flex gap-6">
      <aside className="hidden md:block w-64 shrink-0">
        <FilterSidebar filters={filters} onChange={setFilters} categories={categories} />
      </aside>
      <main className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {filters.search ? `"${filters.search}"` : 'All Textbooks'}
          </h2>
          <span className="text-sm text-gray-500">{listings.length} results</span>
        </div>
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No listings found</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map(l => <TextbookCard key={l.id} listing={l} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
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
    </div>
  );
}
