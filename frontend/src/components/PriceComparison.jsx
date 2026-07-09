export default function PriceComparison({ originalPrice, price }) {
  const diff = originalPrice - price;
  const pct = originalPrice > 0 ? Math.round((diff / originalPrice) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-red-50 to-emerald-50 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center gap-3 sm:gap-5">
      <div className="text-center">
        <div className="text-xs text-gray-500 mb-1">原价</div>
        <div className="text-xl font-bold text-gray-400 line-through">HK${originalPrice}</div>
      </div>
      <div className="text-2xl text-gray-300 font-light">→</div>
      <div className="text-center">
        <div className="text-xs text-gray-500 mb-1">现价</div>
        <div className="text-2xl sm:text-3xl font-extrabold text-red-500">HK${price}</div>
      </div>
      <div className="sm:ml-auto text-right bg-white/60 rounded-xl px-4 py-2">
        <div className="text-base font-extrabold text-emerald-600">悭 HK${diff}</div>
        <div className="text-xs text-emerald-500 font-medium">-{pct}%</div>
      </div>
    </div>
  );
}
