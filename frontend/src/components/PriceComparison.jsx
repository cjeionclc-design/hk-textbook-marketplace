export default function PriceComparison({ originalPrice, price }) {
  const diff = originalPrice - price;
  const pct = originalPrice > 0 ? Math.round((diff / originalPrice) * 100) : 0;

  return (
    <div className="rounded-2xl p-4 sm:p-5 flex flex-wrap items-center gap-3 sm:gap-5" style={{background:'linear-gradient(135deg,#fef2f2,#fff7ed)'}}>
      <div className="text-center">
        <div className="text-xs text-gray-400 font-bold mb-1">原价</div>
        <div className="text-xl font-bold text-gray-300 line-through">HK${originalPrice}</div>
      </div>
      <div className="text-xl text-gray-300">→</div>
      <div className="text-center">
        <div className="text-xs text-gray-400 font-bold mb-1">现价</div>
        <div className="text-2xl sm:text-3xl font-extrabold" style={{color:'#ff6b6b'}}>HK${price}</div>
      </div>
      <div className="sm:ml-auto bg-white rounded-xl px-4 py-2.5 shadow-sm border border-orange-100">
        <div className="text-sm font-extrabold" style={{color:'#ff6b6b'}}>悭 HK${diff}</div>
        <div className="text-xs text-gray-400 font-bold">-{pct}%</div>
      </div>
    </div>
  );
}
