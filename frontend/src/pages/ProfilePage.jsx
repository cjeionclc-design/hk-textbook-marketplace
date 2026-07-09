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
      <div className="bg-white rounded-3xl border border-gray-50 shadow-sm p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-md shadow-orange-200">
            {user?.nickname?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold text-gray-900 truncate">{user?.nickname}</h1>
            <p className="text-sm text-gray-400 truncate font-medium">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <Link to="/messages"
            className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-5 py-2 rounded-2xl text-sm font-bold transition-all shadow-md shadow-orange-200 hover:scale-105 active:scale-95">💬 消息</Link>
          <Link to="/create"
            className="border-2 border-orange-200 text-orange-500 px-5 py-2 rounded-2xl text-sm font-bold hover:bg-orange-50 transition-colors active:scale-95">+ 发布书籍</Link>
        </div>
      </div>

      <h2 className="text-base font-extrabold text-gray-800 mb-3">📦 我的上架</h2>
      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-50 shadow-sm">
          <div className="text-5xl mb-3">📦</div>
          <p className="text-gray-400 font-bold">还没有发布任何书籍</p>
          <Link to="/create" className="inline-block mt-3 text-orange-500 font-bold text-sm hover:text-orange-600">发布第一本 →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map(l => (
            <div key={l.id} className="bg-white rounded-2xl border border-gray-50 p-4 flex items-center gap-4 min-w-0 hover:shadow-sm hover:border-orange-100 transition-all">
              <div className="flex-1 min-w-0">
                <Link to={`/listings/${l.id}`} className="font-bold text-gray-800 hover:text-orange-500 text-sm truncate block transition-colors">{l.textbook_title}</Link>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-extrabold text-pink-500">HK${l.price}</span>
                  {l.status === 'active' ? (
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">🟢 售卖中</span>
                  ) : (
                    <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">⚪ 已售出</span>
                  )}
                </div>
              </div>
              {l.status === 'active' && (
                <button onClick={() => markSold(l.id)}
                  className="text-xs font-bold text-gray-400 hover:text-emerald-500 border border-gray-200 rounded-xl px-3 py-1.5 shrink-0 hover:border-emerald-200 transition-all active:scale-95">
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
