import { useState, useEffect } from 'react';
import client from '../api/client';
import TextbookCard from '../components/TextbookCard';
import ProtectedRoute from '../components/ProtectedRoute';
import { ShopIcon } from '../components/Icon';

export default function FavoritesPage() {
  return <ProtectedRoute><FavList /></ProtectedRoute>;
}

function FavList() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/favorites').then(res => setListings(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-6">收藏的书</h1>
      {listings.length === 0 ? (
        <div className="text-center py-16 neo-card">
          <ShopIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 font-bold">还没有收藏任何书</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {listings.map(l => <TextbookCard key={l.id} listing={l} />)}
        </div>
      )}
    </div>
  );
}
