import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import ConditionStars from '../components/ConditionStars';
import PriceComparison from '../components/PriceComparison';
import { DetailSkeleton } from '../components/Skeleton';
import useAuth from '../hooks/useAuth';

export default function TextbookDetail() {
  const { listingId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/listings/${listingId}`).then(res => setListing(res.data)).finally(() => setLoading(false));
  }, [listingId]);

  if (loading) return <DetailSkeleton />;
  if (!listing) return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">😕</div>
      <p className="text-gray-400 font-bold">找不到这本书</p>
    </div>
  );

  const photos = listing.photos ? JSON.parse(listing.photos) : [];
  const isOwner = user?.id === listing.seller_id;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/search" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-orange-500 mb-6 transition-colors font-bold">← 返回搜索</Link>

      <div className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden min-w-0">
        {listing.cover_image && (
          <div className="aspect-[16/9] bg-gray-50">
            <img src={listing.cover_image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold text-white bg-gradient-to-r from-orange-400 to-pink-400 px-3 py-1 rounded-full">{listing.textbook_category_name_zh}</span>
          <span className="text-xs text-gray-400 font-bold">{listing.textbook_language === 'zh' ? '📘 中文版' : '📙 English'}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 break-words tracking-tight">{listing.textbook_title}</h1>

        {(listing.textbook_publisher || listing.textbook_isbn) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5 text-xs text-gray-400 font-medium">
            {listing.textbook_publisher && <span>🏢 {listing.textbook_publisher}</span>}
            {listing.textbook_isbn && <span>📋 {listing.textbook_isbn}</span>}
          </div>
        )}

        <PriceComparison originalPrice={listing.textbook_original_price} price={listing.price} />

        <div className="mt-5 flex items-center gap-3">
          <span className="text-sm text-gray-500 font-bold">新旧程度:</span>
          <ConditionStars condition={listing.condition} showLabel />
        </div>

        {listing.notes && (
          <div className="mt-5 p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-sm text-gray-600 whitespace-pre-wrap break-words font-medium">💬 {listing.notes}</p>
          </div>
        )}

        {photos.length > 0 && (
          <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
            {photos.map((p, i) => (
              <img key={i} src={p} alt="" className="w-40 h-40 object-cover rounded-2xl border border-gray-100 shrink-0" />
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between pt-5 border-t border-gray-50 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md shadow-orange-200">
              {listing.seller_nickname?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-gray-800 text-sm truncate">{listing.seller_nickname}</div>
              <div className="text-xs text-gray-400 font-medium">发布于 {new Date(listing.created_at).toLocaleDateString()}</div>
            </div>
          </div>
          {isAuthenticated && !isOwner && (
            <Link to={`/chat/${listing.seller_id}?listing=${listing.id}`}
              className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-orange-200 transition-all hover:scale-105 active:scale-95 shrink-0">
              💬 联系卖家
            </Link>
          )}
          {isOwner && (
            <span className="text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-full font-bold shrink-0">你的上架 👑</span>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
