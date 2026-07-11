export default function PriceComparison({ originalPrice, price }) {
  const diff = originalPrice - price;
  const pct = originalPrice > 0 ? Math.round((diff / originalPrice) * 100) : 0;

  return (
    <div className="rounded-2xl p-4 sm:p-5 space-y-3"
      style={{background:'rgba(255,255,255,0.5)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.6)'}}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] text-gray-400 font-bold mb-0.5">原价</div>
          <div className="text-lg font-bold text-gray-300 line-through">HK${originalPrice}</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-gray-400 font-bold mb-0.5">现价</div>
          <div className="text-2xl sm:text-3xl font-extrabold" style={{color:'#ff6b6b'}}>HK${price}</div>
        </div>
      </div>
      <div className="flex items-center justify-between glass px-4 py-2.5 !rounded-xl">
        <span className="text-sm font-extrabold" style={{color:'#ff6b6b'}}>悭 HK${diff}</span>
        <span className="text-xs text-gray-400 font-bold">-{pct}%</span>
      </div>
    </div>
  );
}
