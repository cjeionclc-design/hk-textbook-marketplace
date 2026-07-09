import { Link } from 'react-router-dom';
import ConditionStars from './ConditionStars';

export default function TextbookCard({ listing }) {
  const discount = listing.textbook_original_price > 0
    ? Math.round((1 - listing.price / listing.textbook_original_price) * 100)
    : 0;

  return (
    <Link to={`/listings/${listing.id}`}
      className="group block bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-200 p-4 min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{listing.textbook_category_name_zh}</span>
        <span className="text-xs text-gray-400">{listing.textbook_language === 'zh' ? '中文版' : 'English'}</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base group-hover:text-indigo-700 transition-colors">{listing.textbook_title}</h3>
      <ConditionStars condition={listing.condition} showLabel />
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-3">
        <span className="text-xl sm:text-2xl font-extrabold text-red-500">HK${listing.price}</span>
        <span className="text-xs sm:text-sm text-gray-400 line-through">HK${listing.textbook_original_price}</span>
        {discount > 0 && (
          <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full shrink-0">-{discount}%</span>
        )}
      </div>
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
          {listing.seller_nickname?.[0]?.toUpperCase()}
        </div>
        <span className="text-xs text-gray-400 truncate">{listing.seller_nickname}</span>
        <span className="text-xs text-gray-300 ml-auto">{new Date(listing.created_at).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
