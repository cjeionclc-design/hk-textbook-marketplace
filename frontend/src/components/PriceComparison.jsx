export default function PriceComparison({ originalPrice, price }) {
  const diff = originalPrice - price;
  const pct = originalPrice > 0 ? Math.round((diff / originalPrice) * 100) : 0;

  return (
    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
      <div className="text-center">
        <div className="text-xs text-gray-500">Original</div>
        <div className="text-lg font-bold text-gray-400 line-through">HK${originalPrice}</div>
      </div>
      <div className="text-2xl text-gray-300">→</div>
      <div className="text-center">
        <div className="text-xs text-gray-500">Now</div>
        <div className="text-2xl font-bold text-red-500">HK${price}</div>
      </div>
      <div className="ml-auto text-right">
        <div className="text-sm font-bold text-green-600">Save HK${diff}</div>
        <div className="text-xs text-green-500">-{pct}% off</div>
      </div>
    </div>
  );
}
