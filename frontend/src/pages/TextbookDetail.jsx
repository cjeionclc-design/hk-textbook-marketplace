import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import ConditionStars from '../components/ConditionStars';
import PriceComparison from '../components/PriceComparison';
import { DetailSkeleton } from '../components/Skeleton';
import { useToast } from '../components/Toast';
import { FlagIcon, MessageIcon, PriceIcon, StarIcon, BackIcon, ShopIcon, RefreshIcon } from '../components/Icon';
import useAuth from '../hooks/useAuth';

export default function TextbookDetail() {
  const { listingId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [favorited, setFavorited] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    client.get(`/listings/${listingId}`).then(res => {
      setListing(res.data);
      if (res.data?.seller_id) {
        client.get(`/stats/user/${res.data.seller_id}`).then(r => setStats(r.data)).catch(() => {});
      }
      try {
        const recent = JSON.parse(localStorage.getItem('recent') || '[]');
        const updated = [parseInt(listingId), ...recent.filter(id => id !== parseInt(listingId))].slice(0, 10);
        localStorage.setItem('recent', JSON.stringify(updated));
      } catch {}
    }).finally(() => setLoading(false));
    if (isAuthenticated) {
      client.get(`/favorites/check/${listingId}`).then(r => setFavorited(r.data.favorited)).catch(() => {});
    }
  }, [listingId]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) return toast('请先登录', 'error');
    try {
      if (favorited) {
        await client.delete(`/favorites/${listingId}`);
        setFavorited(false);
        toast('已取消收藏');
      } else {
        await client.post(`/favorites/${listingId}`);
        setFavorited(true);
        toast('已收藏');
      }
    } catch (e) {}
  };

  const shareListing = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: listing?.textbook_title, text: `HK$${listing?.price} - ${listing?.textbook_title}`, url });
    } else {
      navigator.clipboard.writeText(url);
      toast('链接已复制');
    }
  };

  const submitReport = async (e) => {
    e.preventDefault();
    await client.post('/reports', { listing_id: listing.id, reason: reportReason, description: reportDesc });
    toast('已提交举报');
    setShowReport(false);
    setReportReason(''); setReportDesc('');
  };

  if (loading) return <DetailSkeleton />;
  if (!listing) return (
    <div className="text-center py-20"><div className="mb-4"><ShopIcon className="w-12 h-12 mx-auto text-gray-300" /></div><p className="text-gray-400 font-bold">找不到这本书</p></div>
  );

  const photos = listing.photos ? JSON.parse(listing.photos) : [];
  const isOwner = user?.id === listing.seller_id;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/search" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 font-bold"><BackIcon className="w-4 h-4" /> 返回</Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleFavorite} className="neo-btn p-2" title="收藏">
            <StarIcon className="w-5 h-5" style={favorited ? {color:'#ff7b3d', fill:'#ff7b3d'} : {color:'#ccc'}} />
          </button>
          <button onClick={shareListing} className="neo-btn p-2" title="分享">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          </button>
        </div>
      </div>

      <div className="neo-card overflow-hidden">
        {listing.cover_image && (
          <div className="aspect-[16/9] bg-[#e8e3db]"><img src={listing.cover_image} alt="" className="w-full h-full object-cover" /></div>
        )}
        <div className="p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold text-white px-3 py-1 rounded-full" style={{background:'#ff7b3d'}}>{listing.textbook_category_name_zh}</span>
          <span className="text-xs text-gray-400 font-bold">{listing.textbook_language === 'zh' ? '中文版' : 'English'}</span>
          {listing.location && <span className="text-xs text-gray-400 font-bold">📍 {listing.location}</span>}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2 break-words">{listing.textbook_title}</h1>

        {(listing.textbook_publisher || listing.textbook_isbn) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5 text-xs text-gray-400 font-bold">
            {listing.textbook_publisher && <span>{listing.textbook_publisher}</span>}
            {listing.textbook_isbn && <span>ISBN: {listing.textbook_isbn}</span>}
          </div>
        )}

        <PriceComparison originalPrice={listing.textbook_original_price} price={listing.price} />

        <div className="mt-5 flex items-center gap-3">
          <span className="text-sm text-gray-500 font-bold">新旧程度:</span>
          <ConditionStars condition={listing.condition} showLabel />
        </div>

        {listing.notes && (
          <div className="mt-5 p-4 neo-inset"><p className="text-sm text-gray-600 whitespace-pre-wrap break-words font-medium">{listing.notes}</p></div>
        )}

        {photos.length > 0 && (
          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {photos.map((p, i) => <img key={i} src={p} alt="" className="w-40 h-40 object-cover rounded-2xl shrink-0 neo-raised" />)}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between pt-5 border-t border-[#e8e3db] gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{background:'#ff7b3d'}}>{listing.seller_nickname?.[0]?.toUpperCase()}</div>
            <div className="min-w-0">
              <div className="font-bold text-gray-800 text-sm truncate">{listing.seller_nickname}</div>
              {stats && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span><RefreshIcon className="w-3 h-3 inline" /> {stats.response_rate}%回复率</span>
                  {stats.avg_response_hours > 0 && <span>· ~{stats.avg_response_hours}h内回复</span>}
                </div>
              )}
            </div>
          </div>
          {isAuthenticated && !isOwner && (
            <Link to={`/chat/${listing.seller_id}?listing=${listing.id}`}
              className="neo-btn-primary px-6 py-2.5 text-sm shrink-0 flex items-center gap-1.5">
              <MessageIcon className="w-4 h-4" /> 联系卖家
            </Link>
          )}
          {isOwner && <span className="text-sm text-gray-400 neo-btn px-4 py-2 font-bold shrink-0">你的上架</span>}
        </div>
        {isAuthenticated && !isOwner && (
          <button onClick={() => setShowReport(true)} className="mt-3 text-xs text-gray-300 hover:text-red-400 transition-colors font-bold flex items-center gap-1"><FlagIcon className="w-3 h-3" /> 举报</button>
        )}
      </div>
      </div>

      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowReport(false)} />
          <form onSubmit={submitReport} className="relative neo-card p-6 max-w-sm w-full">
            <h3 className="text-lg font-extrabold text-gray-800 mb-1">举报内容</h3>
            <select value={reportReason} required onChange={e => setReportReason(e.target.value)}
              className="w-full neo-inset px-3 py-2.5 text-sm mt-3 font-bold text-gray-600">
              <option value="">选择原因</option>
              <option value="fake">虚假信息</option><option value="spam">垃圾广告</option>
              <option value="inappropriate">不当内容</option><option value="scam">诈骗</option><option value="other">其他</option>
            </select>
            <textarea value={reportDesc} onChange={e => setReportDesc(e.target.value)} placeholder="补充说明..." className="w-full neo-inset px-3 py-2 text-sm my-3" rows={2} />
            <button type="submit" className="w-full text-white py-2.5 rounded-2xl font-bold text-sm active:scale-95" style={{background:'#ff7b3d'}}>提交举报</button>
          </form>
        </div>
      )}
    </div>
  );
}
