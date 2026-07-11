const LABELS = ['', '破损严重', '较多笔记', '轻微痕迹', '接近全新', '全新未用'];

export default function ConditionStars({ condition, showLabel = false }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-3.5 h-3.5 ${i <= condition ? '' : 'text-gray-200'}`}
          viewBox="0 0 20 20" fill={i <= condition ? 'url(#starGrad)' : 'none'} stroke={i <= condition ? 'url(#starGrad)' : '#d1d5db'} strokeWidth={1}>
          <defs><linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ff6b6b"/><stop offset="100%" stopColor="#f97316"/></linearGradient></defs>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {showLabel && <span className="text-xs ml-1.5 font-bold text-gray-500">{LABELS[condition]}</span>}
    </span>
  );
}
