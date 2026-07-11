import { PriceIcon } from './Icon';

export default function PriceComparison({ originalPrice, price }) {
  const diff = originalPrice - price;
  const pct = originalPrice > 0 ? Math.round((diff / originalPrice) * 100) : 0;

  return (
    <div className="neo-inset p-4 sm:p-5 flex flex-wrap items-center gap-3 sm:gap-5">
      <div className="text-center">
        <div className="text-xs text-gray-400 font-bold mb-1">原价</div>
        <div className="text-xl font-bold text-gray-300 line-through">HK${originalPrice}</div>
      </div>
      <div className="text-2xl text-gray-300">→</div>
      <div className="text-center">
        <div className="text-xs text-gray-400 font-bold mb-1">现价</div>
        <div className="text-2xl sm:text-3xl font-extrabold" style={{color:'#ff7b3d'}}>HK${price}</div>
      </div>
      <div className="sm:ml-auto text-right neo-raised px-4 py-2.5 flex items-center gap-2">
        <PriceIcon className="w-4 h-4" style={{color:'#ff7b3d'}} />
        <div>
          <div className="text-base font-extrabold" style={{color:'#ff7b3d'}}>悭 HK${diff}</div>
          <div className="text-xs text-gray-400 font-bold">-{pct}% off</div>
        </div>
      </div>
    </div>
  );
}
