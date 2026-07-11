const LABELS = ['', '破损严重 😢', '较多笔记 📝', '轻微痕迹 👍', '接近全新 ✨', '全新未用 🆕'];

export default function ConditionStars({ condition, showLabel = false }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-sm ${i <= condition ? '' : 'text-gray-200'}`}
          style={i <= condition ? {color:'#ff7b3d'} : {}}>★</span>
      ))}
      {showLabel && (
        <span className="text-xs ml-1.5 font-bold text-gray-500">{LABELS[condition]}</span>
      )}
    </span>
  );
}
