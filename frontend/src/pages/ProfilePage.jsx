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
  const [tab, setTab] = useState('listings');
  const [listings, setListings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [rating, setRating] = useState(null);
  const [reviewTxn, setReviewTxn] = useState(null);
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  useEffect(() => {
    client.get('/listings/mine').then(res => setListings(res.data));
    client.get('/transactions').then(res => setTransactions(res.data));
    if (user) {
      client.get(`/reviews/user/${user.id}`).then(res => setRating(res.data)).catch(() => {});
    }
  }, [user]);

  const toggleStatus = async (l) => {
    const newStatus = l.status === 'active' ? 'sold' : 'active';
    await client.patch(`/listings/${l.id}/status?status=${newStatus}`);
    setListings(prev => prev.map(x => x.id === l.id ? { ...x, status: newStatus } : x));
    if (newStatus === 'sold') {
      await client.post('/transactions', { listing_id: l.id });
      const txns = await client.get('/transactions');
      setTransactions(txns.data);
    }
    toast(newStatus === 'sold' ? '已标记售出，买家可在交易记录中评价你' : '已重新上架', 'success');
  };

  const deleteListing = async (id) => {
    if (!confirm('确定删除？')) return;
    await client.delete(`/listings/${id}`);
    setListings(prev => prev.filter(l => l.id !== id));
    toast('已删除');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewTxn) return;
    await client.post('/reviews', {
      transaction_id: reviewTxn.id,
      reviewee_id: reviewTxn.seller_id === user.id ? reviewTxn.buyer_id : reviewTxn.seller_id,
      rating: revRating,
      comment: revComment,
    });
    toast('评价成功！⭐', 'success');
    setReviewTxn(null);
    setRevComment('');
    setRevRating(5);
    const txns = await client.get('/transactions');
    setTransactions(txns.data);
    if (user) {
      const r = await client.get(`/reviews/user/${user.id}`);
      setRating(r.data);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl border border-gray-50 shadow-sm p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-md">
            {user?.nickname?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold text-gray-900 truncate">{user?.nickname}</h1>
            <p className="text-sm text-gray-400 truncate font-medium">{user?.email}</p>
            {rating && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-sm text-amber-400">{'★'.repeat(Math.round(rating.average))}</span>
                <span className="text-xs text-gray-400 font-bold">{rating.average} ({rating.count}条)</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Link to="/messages" className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-4 py-2 rounded-2xl text-sm font-bold active:scale-95">💬 消息</Link>
          <Link to="/create" className="border-2 border-orange-200 text-orange-500 px-4 py-2 rounded-2xl text-sm font-bold active:scale-95">+ 发布</Link>
        </div>
      </div>

      <div className="flex gap-1 mb-4 bg-gray-100 rounded-2xl p-1">
        {[
          { k: 'listings', l: '📦 上架' },
          { k: 'history', l: '📋 交易' },
          { k: 'reviews', l: '⭐ 评价' },
        ].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tab === t.k ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400'}`}>
            {t.l}
          </button>
        ))}
      </div>

      {tab === 'listings' && (
        <div className="space-y-3">
          {listings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-50">
              <p className="text-gray-400 font-bold">还没有发布任何书籍</p>
            </div>
          ) : (
            listings.map(l => (
              <div key={l.id} className="bg-white rounded-2xl border border-gray-50 p-4 flex items-center gap-3 min-w-0">
                <div className="flex-1 min-w-0">
                  <Link to={`/listings/${l.id}`} className="font-bold text-gray-800 hover:text-orange-500 text-sm truncate block">{l.textbook_title}</Link>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-extrabold text-pink-500">HK${l.price}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.status === 'active' ? 'text-emerald-500 bg-emerald-50' : 'text-gray-400 bg-gray-50'}`}>
                      {l.status === 'active' ? '🟢 售卖中' : '⚪ 已售出'}
                    </span>
                  </div>
                </div>
                <button onClick={() => toggleStatus(l)}
                  className={`text-xs font-bold rounded-xl px-2.5 py-1.5 shrink-0 border ${l.status === 'active' ? 'text-emerald-500 border-emerald-200' : 'text-amber-500 border-amber-200'}`}>
                  {l.status === 'active' ? '✓ 已售出' : '↻ 重新上架'}
                </button>
                <button onClick={() => deleteListing(l.id)}
                  className="text-xs text-gray-300 hover:text-red-400 border border-gray-150 rounded-xl px-2 py-1.5 shrink-0">🗑</button>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-50">
              <p className="text-gray-400 font-bold">暂无交易记录</p>
            </div>
          ) : (
            transactions.map(t => (
              <div key={t.id} className="bg-white rounded-2xl border border-gray-50 p-4 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-800 text-sm truncate">{t.textbook_title}</span>
                  <span className="text-xs text-gray-400 shrink-0">{new Date(t.completed_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>HK${t.price}</span>
                  <span>·</span>
                  <span>{t.buyer_id === user.id ? '你购买了' : '你售出了'}</span>
                </div>
                {!t.reviewed && t.buyer_id === user.id && (
                  <button onClick={() => setReviewTxn(t)}
                    className="mt-2 text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-xl hover:bg-amber-100">
                    ⭐ 评价卖家
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="space-y-3">
          {!rating || rating.reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-50">
              <p className="text-gray-400 font-bold">暂无评价</p>
            </div>
          ) : (
            rating.reviews.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-50 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-800 text-sm">{r.reviewer_nickname}</span>
                  <span className="text-amber-400 text-sm">{'★'.repeat(r.rating)}</span>
                  <span className="text-xs text-gray-400 ml-auto">{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                {r.comment && <p className="text-sm text-gray-500">{r.comment}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {reviewTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setReviewTxn(null)} />
          <form onSubmit={submitReview} className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-extrabold mb-1">评价交易</h3>
            <p className="text-xs text-gray-400 mb-4 truncate">{reviewTxn.textbook_title}</p>
            <div className="flex gap-1 mb-4">
              {[1,2,3,4,5].map(v => (
                <button key={v} type="button" onClick={() => setRevRating(v)}
                  className={`text-2xl ${v <= revRating ? 'text-amber-400' : 'text-gray-200'}`}>★</button>
              ))}
            </div>
            <textarea value={revComment} onChange={e => setRevComment(e.target.value)}
              placeholder="写下你的评价..."
              className="w-full border border-gray-100 rounded-xl px-3 py-2 text-sm mb-4" rows={2} />
            <button type="submit"
              className="w-full bg-amber-400 text-white py-2.5 rounded-xl font-bold text-sm active:scale-95">
              提交评价
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
