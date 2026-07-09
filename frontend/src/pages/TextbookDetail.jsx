import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import ConditionStars from '../components/ConditionStars';
import PriceComparison from '../components/PriceComparison';
import useAuth from '../hooks/useAuth';

export default function TextbookDetail() {
  const { listingId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/listings/${listingId}`).then(res => {
      setListing(res.data);
    }).finally(() => setLoading(false));
  }, [listingId]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
  if (!listing) return <div className="text-center py-20 text-gray-400">Listing not found</div>;

  const photos = listing.photos ? JSON.parse(listing.photos) : [];
  const isOwner = user?.id === listing.seller_id;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/search" className="text-blue-600 text-sm mb-4 inline-block">← Back to search</Link>

      <div className="bg-white rounded-xl border p-4 sm:p-6 min-w-0">
        <div className="text-xs sm:text-sm text-gray-400 mb-1">
          {listing.textbook_category_name_zh} · {listing.textbook_language === 'zh' ? '中文版' : 'English'}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-4 break-words">{listing.textbook_title}</h1>

        {listing.textbook_publisher && (
          <p className="text-sm text-gray-500 mb-1">Publisher: {listing.textbook_publisher}</p>
        )}
        {listing.textbook_isbn && (
          <p className="text-sm text-gray-500 mb-4">ISBN: {listing.textbook_isbn}</p>
        )}

        <PriceComparison originalPrice={listing.textbook_original_price} price={listing.price} />

        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-gray-500">Condition:</span>
          <ConditionStars condition={listing.condition} showLabel />
        </div>

        {listing.notes && (
          <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">{listing.notes}</p>
          </div>
        )}

        {photos.length > 0 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {photos.map((p, i) => (
              <img key={i} src={p} alt="" className="w-32 h-32 object-cover rounded-lg border shrink-0" />
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between pt-4 border-t gap-2">
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{listing.seller_nickname}</div>
            <div className="text-xs text-gray-400">
              Listed {new Date(listing.created_at).toLocaleDateString()}
            </div>
          </div>
          {isAuthenticated && !isOwner && (
            <Link to={`/chat/${listing.seller_id}?listing=${listing.id}`}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium text-sm shrink-0">
              Contact Seller
            </Link>
          )}
          {isOwner && (
            <span className="text-sm text-gray-400 shrink-0">Your listing</span>
          )}
        </div>
      </div>
    </div>
  );
}
