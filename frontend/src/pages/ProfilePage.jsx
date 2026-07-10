import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useToast } from '../components/Toast';
import useAuth from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ProfilePage() {
  return <ProtectedRoute><Profile /></ProtectedRoute>;
}

function Profile() {
  const { user } = useAuth();
  const toast = useToast();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    client.get('/listings/mine').then(res => setListings(res.data));
  }, []);

  const toggleStatus = async (l) => {
    const newStatus = l.status === 'active' ? 'sold' : 'active';
    await client.patch(`/listings/${l.id}/status?status=${newStatus}`);
    setListings(prev => prev.map(x => x.id === l.id ? { ...x, status: newStatus } : x));
    toast(newStatus === 'sold' ? '已标记售出' : '已重新上架', 'success');
  };

  const deleteListing = async (id) => {
    if (!confirm('确定要删除这个上架吗？')) return;
    await client.delete(`/listings/${id}`);
    setListings(prev => prev.filter(l => l.id !== id));
    toast('已删除');
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
            <div key={l.id} className="bg-white rounded-2xl border border-gray-50 p-4 flex items-center gap-3 min-w-0 hover:shadow-sm hover:border-orange-100 transition-all">
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
              <button onClick={() => toggleStatus(l)}
                className={`text-xs font-bold rounded-xl px-2.5 py-1.5 shrink-0 transition-all active:scale-95 border ${
                  l.status === 'active'
                    ? 'text-emerald-500 border-emerald-200 hover:bg-emerald-50'
                    : 'text-amber-500 border-amber-200 hover:bg-amber-50'
                }`}>
                {l.status === 'active' ? '✓ 已售出' : '↻ 重新上架'}
              </button>
              <button onClick={() => deleteListing(l.id)}
                className="text-xs font-bold text-gray-300 hover:text-red-400 border border-gray-150 rounded-xl px-2 py-1.5 shrink-0 transition-all active:scale-95 hover:border-red-200">
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
