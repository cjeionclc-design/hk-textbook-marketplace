import { Link } from 'react-router-dom';
import ConditionStars from './ConditionStars';

const COLORS = ['from-orange-400 to-pink-400', 'from-purple-400 to-pink-400', 'from-emerald-400 to-teal-400', 'from-amber-400 to-orange-400'];

export default function TextbookCard({ listing }) {
  const discount = listing.textbook_original_price > 0
    ? Math.round((1 - listing.price / listing.textbook_original_price) * 100)
    : 0;
  const color = COLORS[listing.id % COLORS.length];

  return (
    <Link to={`/listings/${listing.id}`}
      className="group block bg-white rounded-2xl border border-gray-50 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100 transition-all duration-200 overflow-hidden min-w-0 hover:-translate-y-1 active:scale-[0.98]">
      {listing.cover_image ? (
        <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
          <img src={listing.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center">
          <span className="text-4xl">📚</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-white bg-gradient-to-r from-orange-400 to-pink-400 px-2.5 py-1 rounded-full">{listing.textbook_category_name_zh}</span>
          <span className="text-xs text-gray-400 font-medium">{listing.textbook_language === 'zh' ? '📘 中' : '📙 EN'}</span>
        </div>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base group-hover:text-orange-500 transition-colors">{listing.textbook_title}</h3>
        <ConditionStars condition={listing.condition} showLabel />
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-3">
          <span className="text-xl sm:text-2xl font-extrabold text-pink-500">HK${listing.price}</span>
          <span className="text-xs sm:text-sm text-gray-300 line-through">HK${listing.textbook_original_price}</span>
          {discount > 0 && (
            <span className="text-xs font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 text-white px-2 py-0.5 rounded-full shrink-0">-{discount}%</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${color} flex items-center justify-center text-xs font-bold text-white`}>
            {listing.seller_nickname?.[0]?.toUpperCase()}
          </div>
          <span className="text-xs text-gray-400 truncate font-medium">{listing.seller_nickname}</span>
          <span className="text-xs text-gray-300 ml-auto">{new Date(listing.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
