export default function PriceComparison({ originalPrice, price }) {
  const diff = originalPrice - price;
  const pct = originalPrice > 0 ? Math.round((diff / originalPrice) * 100) : 0;

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border-2 border-orange-100 shadow-sm">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-100 to-transparent rounded-bl-3xl" />
      <div className="relative p-4 sm:p-5 flex flex-wrap items-center gap-3 sm:gap-5">
        <div className="text-center">
          <div className="text-xs text-gray-400 font-bold mb-1">原价</div>
          <div className="text-xl font-bold text-gray-300 line-through">HK${originalPrice}</div>
        </div>
        <div className="text-2xl text-gray-300">→</div>
        <div className="text-center">
          <div className="text-xs text-gray-400 font-bold mb-1">现价</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-pink-500">HK${price}</div>
        </div>
        <div className="sm:ml-auto text-right bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl px-4 py-2.5 border border-emerald-100">
          <div className="text-base font-extrabold text-emerald-600">悭 HK${diff} 💰</div>
          <div className="text-xs text-emerald-500 font-bold">-{pct}% off</div>
        </div>
      </div>
    </div>
  );
}
