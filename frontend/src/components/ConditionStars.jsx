const LABELS = ['', '破损严重', '较多笔记', '轻微痕迹', '接近全新', '全新未用'];

export default function ConditionStars({ condition, showLabel = false }) {
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-sm ${i <= condition ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
      ))}
      {showLabel && (
        <span className={`text-xs ml-1.5 font-medium ${
          condition >= 4 ? 'text-emerald-600' : condition === 3 ? 'text-amber-600' : 'text-red-500'
        }`}>{LABELS[condition]}</span>
      )}
    </span>
  );
}
