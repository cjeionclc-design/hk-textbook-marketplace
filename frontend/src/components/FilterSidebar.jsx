export default function FilterSidebar({ filters, onChange, categories }) {
  const activeCount = [filters.category_id, filters.language, filters.condition, filters.min_price, filters.max_price].filter(Boolean).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-800 text-sm">筛选</span>
        {activeCount > 0 && (
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{activeCount}</span>
        )}
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">科目</label>
        <select value={filters.category_id || ''}
          onChange={e => onChange({ ...filters, category_id: e.target.value || null })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mt-1.5 text-sm focus:border-indigo-300 focus:outline-none transition-all">
          <option value="">全部科目</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name_zh}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">语言</label>
        <select value={filters.language || ''}
          onChange={e => onChange({ ...filters, language: e.target.value || null })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mt-1.5 text-sm focus:border-indigo-300 focus:outline-none transition-all">
          <option value="">全部</option>
          <option value="zh">中文版</option>
          <option value="en">English</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">新旧</label>
        <select value={filters.condition || ''}
          onChange={e => onChange({ ...filters, condition: e.target.value || null })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mt-1.5 text-sm focus:border-indigo-300 focus:outline-none transition-all">
          <option value="">不限</option>
          <option value="5">★★★★★ 全新</option>
          <option value="4">★★★★ 轻微使用</option>
          <option value="3">★★★ 有笔记</option>
          <option value="2">★★ 较多痕迹</option>
          <option value="1">★ 破损</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">价格范围</label>
        <div className="flex gap-2 mt-1.5">
          <input type="number" placeholder="最低" value={filters.min_price || ''}
            onChange={e => onChange({ ...filters, min_price: e.target.value || null })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none transition-all" />
          <input type="number" placeholder="最高" value={filters.max_price || ''}
            onChange={e => onChange({ ...filters, max_price: e.target.value || null })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-indigo-300 focus:outline-none transition-all" />
        </div>
      </div>

      {activeCount > 0 && (
        <button onClick={() => onChange({})}
          className="w-full text-sm text-gray-400 hover:text-red-500 py-2 transition-colors font-medium">
          清除筛选
        </button>
      )}
    </div>
  );
}
