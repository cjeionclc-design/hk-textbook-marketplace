import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useToast } from '../components/Toast';
import ProtectedRoute from '../components/ProtectedRoute';

export default function CreateListingPage() {
  return (
    <ProtectedRoute>
      <CreateListingForm />
    </ProtectedRoute>
  );
}

function CreateListingForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTextbook, setSelectedTextbook] = useState(null);
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState(3);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTextbook, setNewTextbook] = useState({
    title: '', isbn: '', publisher: '', language: 'en', original_price: '', category_id: ''
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get('/categories').then(res => setCategories(res.data));
  }, []);

  const searchTextbook = async (query) => {
    if (query.length < 2) return;
    const res = await client.get('/textbooks', { params: { search: query } });
    setSearchResults(res.data);
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
      setSelectedTextbook(res.data);
      setShowNewForm(false);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create textbook');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const form = new FormData();
    form.append('textbook_id', selectedTextbook.id);
    form.append('price', price);
    form.append('condition', condition);
    form.append('notes', notes);
    photos.forEach(p => form.append('photos', p));

    try {
      const res = await client.post('/listings', form);
      toast('发布成功！', 'success');
      navigate(`/listings/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create listing');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">发布教科书</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-5 text-sm font-medium">{error}</div>}

      <div className="flex items-center gap-2 mb-8">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'}`}>1</div>
        <div className={`h-0.5 flex-1 rounded transition-all ${step === 2 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>2</div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <p className="text-sm text-gray-500 mb-4">步骤 1: 找到你要卖的书</p>
          <input type="text" placeholder="输入书名搜索..."
            onChange={e => searchTextbook(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-300 focus:outline-none transition-all mb-4" />

          {searchResults.length > 0 && (
            <div className="space-y-2 mb-4">
              {searchResults.map(t => (
                <button key={t.id}
                  onClick={() => { setSelectedTextbook(t); setStep(2); }}
                  className="w-full text-left p-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all min-w-0">
                  <div className="font-semibold text-gray-800 text-sm truncate">{t.title}</div>
                  <div className="text-xs text-gray-400 mt-1 truncate">
                    {t.publisher} · {t.language === 'zh' ? '中文版' : 'English'} · 原价 HK${t.original_price}
                  </div>
                </button>
              ))}
            </div>
          )}

          <button onClick={() => setShowNewForm(!showNewForm)}
            className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors">
            {showNewForm ? '− 取消' : '+ 找不到？添加新书'}
          </button>

          {showNewForm && (
            <form onSubmit={handleCreateNew} className="mt-4 p-5 border border-gray-200 rounded-2xl space-y-3 bg-gray-50/50">
              <input type="text" placeholder="书名 *" required
                value={newTextbook.title}
                onChange={e => setNewTextbook({ ...newTextbook, title: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-indigo-300 focus:outline-none transition-all" />
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" placeholder="ISBN"
                  value={newTextbook.isbn}
                  onChange={e => setNewTextbook({ ...newTextbook, isbn: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-indigo-300 focus:outline-none transition-all" />
                <input type="text" placeholder="出版社"
                  value={newTextbook.publisher}
                  onChange={e => setNewTextbook({ ...newTextbook, publisher: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-indigo-300 focus:outline-none transition-all" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <select value={newTextbook.language}
                  onChange={e => setNewTextbook({ ...newTextbook, language: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-indigo-300 focus:outline-none transition-all">
                  <option value="en">English</option>
                  <option value="zh">中文版</option>
                </select>
                <input type="number" step="0.01" placeholder="原价 (HKD) *" required
                  value={newTextbook.original_price}
                  onChange={e => setNewTextbook({ ...newTextbook, original_price: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-indigo-300 focus:outline-none transition-all" />
              </div>
              <select value={newTextbook.category_id} required
                onChange={e => setNewTextbook({ ...newTextbook, category_id: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:border-indigo-300 focus:outline-none transition-all">
                <option value="">选择科目 *</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name_zh}</option>
                ))}
              </select>
              <button type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
                创建并继续
              </button>
            </form>
          )}
        </div>
      )}

      {step === 2 && selectedTextbook && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-5">
          <p className="text-sm text-gray-500">步骤 2: 设定价格和新旧程度</p>

          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 min-w-0">
            <div className="font-semibold text-gray-800 text-sm truncate">{selectedTextbook.title}</div>
            <div className="text-xs text-gray-500 mt-1 truncate">
              原价: HK${selectedTextbook.original_price} · {selectedTextbook.language === 'zh' ? '中文版' : 'English'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">售价 (HKD) *</label>
            <input type="number" step="0.01" required
              value={price} onChange={e => setPrice(e.target.value)}
              placeholder="e.g. 80"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-300 focus:outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">新旧程度</label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map(v => (
                <button key={v} type="button"
                  onClick={() => setCondition(v)}
                  className={`flex-1 min-w-[56px] py-2.5 rounded-xl border-2 text-xs sm:text-sm transition-all ${
                    condition === v
                      ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}>
                  <div className="text-base sm:text-lg">{'★'.repeat(v)}{'☆'.repeat(5 - v)}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 font-medium">
                    {['破损','较多笔记','轻微痕迹','接近全新','全新未用'][v - 1]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">照片 (最多5张)</label>
            <input type="file" accept="image/*" multiple
              onChange={e => setPhotos(Array.from(e.target.files))}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">备注</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="例如: 只有第一章有highlight..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-300 focus:outline-none transition-all" rows={3} />
          </div>

          <button type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-base transition-colors shadow-lg shadow-indigo-200">
            发布
          </button>
        </form>
      )}
    </div>
  );
}
