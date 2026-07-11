import { StarIcon } from './Icon';

const LABELS = ['', '破损严重', '较多笔记', '轻微痕迹', '接近全新', '全新未用'];

export default function ConditionStars({ condition, showLabel = false }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <StarIcon key={i} className={`w-3.5 h-3.5 ${i <= condition ? '' : 'text-gray-200'}`}
          style={i <= condition ? {color:'#ff7b3d', fill:'#ff7b3d'} : {}} />
      ))}
      {showLabel && (
        <span className="text-xs ml-1.5 font-bold text-gray-500">{LABELS[condition]}</span>
      )}
    </span>
  );
}
