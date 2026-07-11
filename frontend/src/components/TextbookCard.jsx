import { Link } from 'react-router-dom';
import ConditionStars from './ConditionStars';
import { ShopIcon } from './Icon';

const ACCENTS = ['#ff6b6b','#a78bfa','#4ecdc4','#f97316','#6bcb77','#8b5cf6'];

export default function TextbookCard({ listing }) {
  const discount = listing.textbook_original_price > 0
    ? Math.round((1 - listing.price / listing.textbook_original_price) * 100) : 0;
  const accent = ACCENTS[listing.id % ACCENTS.length];

  return (
    <Link to={`/listings/${listing.id}`} className="glass overflow-hidden group flex flex-col">
      {listing.cover_image ? (
        <div className="aspect-[4/3] bg-gray-50 overflow-hidden">
          <img src={listing.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <ShopIcon className="w-10 h-10 text-gray-200" />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="tag text-white" style={{background:accent}}>{listing.textbook_category_name_zh}</span>
          <span className="text-[11px] text-gray-400 font-semibold">{listing.textbook_language === 'zh' ? '中文版' : 'English'}</span>
          {listing.location && <span className="text-[11px] text-gray-400 ml-auto">📍{listing.location}</span>}
        </div>
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-sm leading-snug flex-1">{listing.textbook_title}</h3>
        <ConditionStars condition={listing.condition} showLabel />
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-xl font-extrabold" style={{color:accent}}>HK${listing.price}</span>
          <span className="text-xs text-gray-300 line-through">HK${listing.textbook_original_price}</span>
          {discount > 0 && <span className="text-[11px] font-bold text-white px-1.5 py-0.5 rounded-md shrink-0" style={{background:accent}}>-{discount}%</span>}
        </div>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100/50">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{background:accent}}>
            {listing.seller_nickname?.[0]?.toUpperCase()}
          </div>
          <span className="text-xs text-gray-400 font-medium truncate">{listing.seller_nickname}</span>
          <span className="text-[11px] text-gray-300 ml-auto">{new Date(listing.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
