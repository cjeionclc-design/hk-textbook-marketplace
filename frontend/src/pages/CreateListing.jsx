import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useToast } from '../components/Toast';
import ProtectedRoute from '../components/ProtectedRoute';

export default function CreateListingPage() {
  return <ProtectedRoute><CreateListingForm /></ProtectedRoute>;
}

function CreateListingForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState(4);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState([]);
  const [newTextbook, setNewTextbook] = useState({
    title: '', isbn: '', publisher: '', language: 'en', original_price: '', category_id: ''
  });

  useEffect(() => {
    client.get('/categories').then(res => setCategories(res.data));
  }, []);

  const doSearch = (q) => {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    client.get('/textbooks', { params: { search: q } })
      .then(res => setSearchResults(res.data))
      .finally(() => setSearching(false));
  };

  const selectBook = (t) => {
    setSelected(t);
    setNewTextbook({ title: t.title, isbn: t.isbn, publisher: t.publisher, language: t.language, original_price: String(t.original_price), category_id: String(t.category_id) });
    setShowNewForm(false);
    setError('');
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleCreateNew = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await client.post('/textbooks', {
        ...newTextbook,
        original_price: parseFloat(newTextbook.original_price),
        category_id: parseInt(newTextbook.category_id),
      });
      selectBook(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || '创建失败');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setError('');
    setSubmitting(true);
    const form = new FormData();
    form.append('textbook_id', selected.id);
    form.append('price', price);
    form.append('condition', String(condition));
    form.append('notes', notes);
    photos.forEach(p => form.append('photos', p));

    try {
      const res = await client.post('/listings', form);
      toast('发布成功！🎉', 'success');
      navigate(`/listings/${res.data.id}`);
    } catch (err) {
      const msg = err.response?.status === 401 ? '请先登录后再发布' : (err.response?.data?.detail || '发布失败');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto pb-20">
      <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">📚 卖书</h1>
      <p className="text-gray-400 text-sm font-medium mb-6">搜书名 → 定价钱 → 发布，超简单！</p>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-500 p-3 rounded-2xl mb-4 text-sm font-bold">{error}</div>
      )}

      {!selected && (
        <div className="bg-white rounded-2xl border border-gray-50 shadow-sm p-4 sm:p-5 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={e => doSearch(e.target.value)}
            placeholder="🔍 输入书名搜索..."
            className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all font-medium"
            autoFocus
          />

          {searching && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-400 rounded-full animate-spin" />
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="mt-3 space-y-2">
              {searchResults.map(t => (
                <button key={t.id} onClick={() => selectBook(t)}
                  className="w-full text-left p-3 border border-gray-100 rounded-xl hover:border-orange-200 hover:shadow-sm transition-all">
                  <div className="font-bold text-gray-800 text-sm">{t.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {t.publisher && `${t.publisher} · `}{t.language === 'zh' ? '中文版' : 'English'} · 原价 HK${t.original_price} · {t.listing_count} 人在卖
                  </div>
                </button>
              ))}
            </div>
          )}

          {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-400 text-sm font-medium mb-3">找不到这本书？</p>
              <button onClick={() => { setShowNewForm(!showNewForm); setError(''); }}
                className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md shadow-orange-200 active:scale-95 transition-all">
                {showNewForm ? '取消' : '➕ 添加新书'}
              </button>
            </div>
          )}

          {showNewForm && (
            <form onSubmit={handleCreateNew} className="mt-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100 space-y-3">
              <p className="text-xs font-bold text-orange-500 mb-2">📝 填写新书信息</p>
              <div className="space-y-3">
                <input type="text" placeholder="书名 *" required value={newTextbook.title}
                  onChange={e => setNewTextbook({ ...newTextbook, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-orange-300 focus:outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="出版社" value={newTextbook.publisher}
                    onChange={e => setNewTextbook({ ...newTextbook, publisher: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-orange-300 focus:outline-none" />
                  <input type="text" placeholder="ISBN" value={newTextbook.isbn}
                    onChange={e => setNewTextbook({ ...newTextbook, isbn: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-orange-300 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select value={newTextbook.language}
                    onChange={e => setNewTextbook({ ...newTextbook, language: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-orange-300 focus:outline-none">
                    <option value="en">📙 English</option>
                    <option value="zh">📘 中文版</option>
                  </select>
                  <input type="number" step="0.01" placeholder="原价 HKD *" required value={newTextbook.original_price}
                    onChange={e => setNewTextbook({ ...newTextbook, original_price: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-orange-300 focus:outline-none" />
                </div>
                <select value={newTextbook.category_id} required
                  onChange={e => setNewTextbook({ ...newTextbook, category_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-orange-300 focus:outline-none">
                  <option value="">选择科目 *</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name_zh}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-bold transition-colors active:scale-95">确认并继续</button>
            </form>
          )}
        </div>
      )}

      {selected && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-50 shadow-sm p-4 sm:p-6 space-y-5">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => { setSelected(null); setShowNewForm(false); setError(''); }} className="text-gray-400 hover:text-gray-600 text-sm font-bold shrink-0">← 返回</button>
            <div className="flex-1 p-3 bg-orange-50 rounded-2xl border border-orange-100 min-w-0">
              <div className="font-bold text-gray-800 text-sm truncate">{selected.title}</div>
              <div className="text-xs text-gray-500 mt-0.5 font-medium truncate">
                原价 HK${selected.original_price} · {selected.language === 'zh' ? '中文版' : 'English'}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">💰 售价 (HKD)</label>
            <input type="number" step="0.01" required value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="e.g. 80"
              className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-lg font-bold bg-gray-50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all" />
            {price && selected.original_price > 0 && (
              <p className="text-xs text-emerald-500 font-bold mt-1.5 ml-1">
                比原价便宜 HK${(selected.original_price - parseFloat(price)).toFixed(0)} 💰
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">⭐ 新旧程度</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { v: 5, e: '🆕', l: '全新' },
                { v: 4, e: '✨', l: '很新' },
                { v: 3, e: '👍', l: '良好' },
                { v: 2, e: '📝', l: '有笔记' },
                { v: 1, e: '😢', l: '破损' },
              ].map(({ v, e, l }) => (
                <button key={v} type="button" onClick={() => setCondition(v)}
                  className={`py-3 rounded-2xl border-2 text-center transition-all active:scale-95 ${
                    condition === v
                      ? 'border-orange-400 bg-orange-50 shadow-sm scale-105'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}>
                  <div className="text-xl">{e}</div>
                  <div className="text-[10px] font-bold text-gray-500 mt-0.5">{l}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">📸 照片 <span className="text-gray-400 font-medium">({photos.length}/5)</span></label>
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-orange-300 transition-colors active:scale-[0.99] bg-gray-50/50">
              <span className="text-2xl">📷</span>
              <span className="text-sm text-gray-400 font-medium">{photos.length > 0 ? `已选 ${photos.length} 张` : '点击拍照或选择照片'}</span>
              <input type="file" accept="image/*" multiple capture="environment"
                onChange={e => setPhotos(prev => [...prev, ...Array.from(e.target.files)].slice(0, 5))}
                className="hidden" />
            </label>
            {photos.length > 0 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {photos.map((p, i) => (
                  <div key={i} className="relative shrink-0">
                    <img src={URL.createObjectURL(p)} alt="" className="w-16 h-16 object-cover rounded-xl border border-gray-100" />
                    <button type="button" onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-400 text-white rounded-full text-xs flex items-center justify-center">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">💬 备注 <span className="text-gray-400 font-normal">（选填）</span></label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="例如：只有第一章有highlight、封面有点皱..."
              className="w-full border border-gray-100 rounded-2xl px-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:border-orange-300 focus:outline-none transition-all" rows={2} />
          </div>

          <button type="submit" disabled={submitting || !price}
            className="w-full bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 disabled:from-gray-300 disabled:to-gray-300 text-white py-4 rounded-2xl font-extrabold text-base transition-all shadow-xl shadow-orange-200 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98]">
            {submitting ? '发布中...' : '🚀 立即发布'}
          </button>
        </form>
      )}
    </div>
  );
}
