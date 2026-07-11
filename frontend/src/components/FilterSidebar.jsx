export default function FilterSidebar({ filters, onChange, categories }) {
  const activeCount = [filters.category_id, filters.language, filters.condition, filters.min_price, filters.max_price].filter(Boolean).length;

  return (
    <div className="glass p-5 space-y-5 sticky top-20">
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-800">筛选</span>
        {activeCount > 0 && <span className="tag text-white" style={{background:'#ff6b6b'}}>{activeCount}</span>}
      </div>
      <div>
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">科目</label>
        <select value={filters.category_id || ''} onChange={e => onChange({...filters, category_id: e.target.value || null})}
          className="glass-input w-full mt-1.5 !py-2 !text-sm">
          <option value="">全部科目</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name_zh}</option>)}
        </select>
      </div>
      <div>
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">语言</label>
        <select value={filters.language || ''} onChange={e => onChange({...filters, language: e.target.value || null})}
          className="glass-input w-full mt-1.5 !py-2 !text-sm">
          <option value="">全部</option><option value="zh">中文版</option><option value="en">English</option>
        </select>
      </div>
      <div>
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">新旧</label>
        <select value={filters.condition || ''} onChange={e => onChange({...filters, condition: e.target.value || null})}
          className="glass-input w-full mt-1.5 !py-2 !text-sm">
          <option value="">不限</option>
          <option value="5">全新</option><option value="4">轻微使用</option><option value="3">有笔记</option>
          <option value="2">较多痕迹</option><option value="1">破损</option>
        </select>
      </div>
      <div>
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">价格</label>
        <div className="flex gap-2 mt-1.5">
          <input type="number" placeholder="最低" value={filters.min_price || ''}
            onChange={e => onChange({...filters, min_price: e.target.value || null})}
            className="glass-input flex-1 !py-2 !text-sm" />
          <input type="number" placeholder="最高" value={filters.max_price || ''}
            onChange={e => onChange({...filters, max_price: e.target.value || null})}
            className="glass-input flex-1 !py-2 !text-sm" />
        </div>
      </div>
      {activeCount > 0 && (
        <button onClick={() => onChange({})} className="w-full text-sm text-gray-400 hover:text-red-400 font-semibold py-1">清除筛选</button>
      )}
    </div>
  );
}
