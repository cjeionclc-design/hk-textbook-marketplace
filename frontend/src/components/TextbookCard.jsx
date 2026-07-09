import { Link } from 'react-router-dom';
import ConditionStars from './ConditionStars';

export default function TextbookCard({ listing }) {
  const discount = listing.textbook_original_price > 0
    ? Math.round((1 - listing.price / listing.textbook_original_price) * 100)
    : 0;

  return (
    <Link to={`/listings/${listing.id}`}
      className="block bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow p-4">
      <div className="text-xs text-gray-400 mb-1">{listing.textbook_category_name_zh}</div>
      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{listing.textbook_title}</h3>
      <div className="text-xs text-gray-500 mb-2">
        {listing.textbook_language === 'zh' ? '📘 中文版' : '📙 英文版'}
      </div>
      <ConditionStars condition={listing.condition} showLabel />
      <div className="flex items-baseline gap-2 mt-3">
        <span className="text-2xl font-bold text-red-500">HK${listing.price}</span>
        <span className="text-sm text-gray-400 line-through">HK${listing.textbook_original_price}</span>
        {discount > 0 && (
          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">-{discount}%</span>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-2">
        {listing.seller_nickname} · {new Date(listing.created_at).toLocaleDateString()}
      </div>
    </Link>
  );
}
