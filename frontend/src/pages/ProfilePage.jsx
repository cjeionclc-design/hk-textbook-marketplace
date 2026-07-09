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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold shrink-0">
            {user?.nickname?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">{user?.nickname}</h1>
            <p className="text-sm text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <Link to="/messages"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">消息</Link>
          <Link to="/create"
            className="border-2 border-indigo-200 text-indigo-600 px-5 py-2 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors">+ 发布书籍</Link>
        </div>
      </div>

      <h2 className="text-base font-bold text-gray-800 mb-3">我的上架</h2>
      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-gray-400 text-sm font-medium">还没有发布任何书籍</p>
          <Link to="/create" className="text-indigo-600 text-sm font-medium mt-1 inline-block">发布第一本 →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map(l => (
            <div key={l.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 min-w-0 hover:shadow-sm transition-shadow">
              <div className="flex-1 min-w-0">
                <Link to={`/listings/${l.id}`} className="font-semibold text-gray-800 hover:text-indigo-600 text-sm truncate block transition-colors">
                  {l.textbook_title}
                </Link>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-bold text-red-500">HK${l.price}</span>
                  {l.status === 'active' ? (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">售卖中</span>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">已售出</span>
                  )}
                </div>
              </div>
              {l.status === 'active' && (
                <button onClick={() => markSold(l.id)}
                  className="text-xs font-medium text-gray-400 hover:text-emerald-600 border border-gray-200 rounded-lg px-3 py-1.5 shrink-0 hover:border-emerald-200 transition-all">
                  标记已售
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
