import { Link } from 'react-router-dom';
import ConditionStars from './ConditionStars';

export default function TextbookCard({ listing }) {
  const discount = listing.textbook_original_price > 0
    ? Math.round((1 - listing.price / listing.textbook_original_price) * 100)
    : 0;

  return (
    <Link to={`/listings/${listing.id}`}
      className="group block neo-card overflow-hidden hover:shadow-[12px_12px_24px_#e0dbd6,-12px_-12px_24px_#ffffff] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]">
      {listing.cover_image ? (
        <div className="aspect-[4/3] bg-[#f0ebe3] overflow-hidden">
          <img src={listing.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-[#f5f0eb] flex items-center justify-center rounded-t-3xl">
          <span className="text-5xl opacity-30">📚</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full" style={{background:'#ff7b3d'}}>{listing.textbook_category_name_zh}</span>
          <span className="text-xs text-gray-400 font-bold">{listing.textbook_language === 'zh' ? '📘 中' : '📙 EN'}</span>
        </div>
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-sm sm:text-base">{listing.textbook_title}</h3>
        <ConditionStars condition={listing.condition} showLabel />
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-3">
          <span className="text-xl sm:text-2xl font-extrabold" style={{color:'#ff7b3d'}}>HK${listing.price}</span>
          <span className="text-xs sm:text-sm text-gray-300 line-through">HK${listing.textbook_original_price}</span>
          {discount > 0 && (
            <span className="text-xs font-extrabold text-white px-2 py-0.5 rounded-full shrink-0" style={{background:'#ff7b3d'}}>-{discount}%</span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#e8e3db]">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:'#ff7b3d'}}>
            {listing.seller_nickname?.[0]?.toUpperCase()}
          </div>
          <span className="text-xs text-gray-400 truncate font-bold">{listing.seller_nickname}</span>
          <span className="text-xs text-gray-300 ml-auto">{new Date(listing.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
