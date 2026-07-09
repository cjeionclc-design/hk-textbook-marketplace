import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import useAuth from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ProfilePage() {
  return <ProtectedRoute><Profile /></ProtectedRoute>;
}

function Profile() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    client.get('/listings/mine').then(res => setListings(res.data));
  }, []);

  const markSold = async (id) => {
    await client.patch(`/listings/${id}/status?status=sold`);
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: 'sold' } : l));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">{user?.nickname}</h1>
      <p className="text-gray-500 mb-4 sm:mb-6 text-sm">{user?.email}</p>

      <div className="flex gap-3 mb-6">
        <Link to="/messages"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">Messages</Link>
        <Link to="/create"
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm">+ New Listing</Link>
      </div>

      <h2 className="text-base sm:text-lg font-semibold mb-3">My Listings</h2>
      {listings.length === 0 ? (
        <div className="text-center py-10 text-gray-400 text-sm">No listings yet</div>
      ) : (
        <div className="space-y-3">
          {listings.map(l => (
            <div key={l.id} className="bg-white border rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="flex-1 min-w-0">
                <Link to={`/listings/${l.id}`} className="font-medium hover:text-blue-600 text-sm truncate block">
                  {l.textbook_title}
                </Link>
                <div className="text-sm text-gray-500">
                  HK${l.price} · {l.status === 'active' ? (
                    <span className="text-green-600">Active</span>
                  ) : (
                    <span className="text-gray-400">Sold</span>
                  )}
                </div>
              </div>
              {l.status === 'active' && (
                <button onClick={() => markSold(l.id)}
                  className="text-xs sm:text-sm text-gray-500 hover:text-green-600 border rounded-lg px-2 sm:px-3 py-1 shrink-0">
                  Mark Sold
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
