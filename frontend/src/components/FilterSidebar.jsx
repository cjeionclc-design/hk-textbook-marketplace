export default function FilterSidebar({ filters, onChange, categories }) {
  return (
    <div className="bg-white rounded-xl border p-4 space-y-5">
      <div>
        <label className="text-sm font-medium text-gray-700">Subject</label>
        <select value={filters.category_id || ''}
          onChange={e => onChange({ ...filters, category_id: e.target.value || null })}
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm">
          <option value="">All Subjects</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name_zh}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Language</label>
        <select value={filters.language || ''}
          onChange={e => onChange({ ...filters, language: e.target.value || null })}
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm">
          <option value="">All</option>
          <option value="zh">中文版</option>
          <option value="en">English</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Condition</label>
        <select value={filters.condition || ''}
          onChange={e => onChange({ ...filters, condition: e.target.value || null })}
          className="w-full border rounded-lg px-3 py-2 mt-1 text-sm">
          <option value="">Any</option>
          <option value="5">⭐⭐⭐⭐⭐ New</option>
          <option value="4">⭐⭐⭐⭐ Light use</option>
          <option value="3">⭐⭐⭐ Some notes</option>
          <option value="2">⭐⭐ Many highlights</option>
          <option value="1">⭐ Damaged</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Price Range</label>
        <div className="flex gap-2 mt-1">
          <input type="number" placeholder="Min" value={filters.min_price || ''}
            onChange={e => onChange({ ...filters, min_price: e.target.value || null })}
            className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="number" placeholder="Max" value={filters.max_price || ''}
            onChange={e => onChange({ ...filters, max_price: e.target.value || null })}
            className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>

      <button onClick={() => onChange({})}
        className="w-full text-sm text-gray-500 hover:text-gray-700 py-1">
        Clear Filters
      </button>
    </div>
  );
}
