const LABELS = ['', '破损', '多笔记', '有痕迹', '轻微', '全新'];

export default function ConditionStars({ condition, showLabel = false }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= condition ? 'text-yellow-500' : 'text-gray-300'}>★</span>
      ))}
      {showLabel && <span className="text-xs text-gray-500 ml-1">{LABELS[condition]}</span>}
    </span>
  );
}
