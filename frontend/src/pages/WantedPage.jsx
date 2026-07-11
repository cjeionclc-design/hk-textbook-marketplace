import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useToast } from '../components/Toast';
import useAuth from '../hooks/useAuth';

export default function WantedPage() {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [wanted, setWanted] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [language, setLanguage] = useState('en');
  const [maxPrice, setMaxPrice] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    Promise.all([
      client.get('/wanted'),
      client.get('/categories'),
    ]).then(([wRes, cRes]) => {
      setWanted(wRes.data);
      setCategories(cRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await client.post('/wanted', {
        title, category_id: parseInt(categoryId), language,
        max_price: parseFloat(maxPrice) || 0, description: desc,
      });
      setWanted(prev => [res.data, ...prev]);
      setShowForm(false);
      setTitle(''); setCategoryId(''); setMaxPrice(''); setDesc('');
      toast('求购发布成功！📢', 'success');
    } catch (err) {
      toast(err.response?.data?.detail || '发布失败', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800">📢 求购广场</h1>
        {isAuthenticated && (
          <button onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-md active:scale-95">
            {showForm ? '取消' : '+ 发布求购'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-50 shadow-sm p-5 mb-6 space-y-4">
          <input type="text" placeholder="书名 *" required value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <select value={categoryId} required
              onChange={e => setCategoryId(e.target.value)}
              className="border border-gray-100 rounded-xl px-3 py-2.5 text-sm">
              <option value="">选择科目</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name_zh}</option>)}
            </select>
            <select value={language}
              onChange={e => setLanguage(e.target.value)}
              className="border border-gray-100 rounded-xl px-3 py-2.5 text-sm">
              <option value="en">📙 English</option>
              <option value="zh">📘 中文版</option>
            </select>
            <input type="number" step="0.01" placeholder="最高预算" value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              className="border border-gray-100 rounded-xl px-3 py-2.5 text-sm" />
          </div>
          <textarea placeholder="补充说明..." value={desc}
            onChange={e => setDesc(e.target.value)}
            className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm" rows={2} />
          <button type="submit"
            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-3 rounded-xl font-bold text-sm shadow-md active:scale-95">
            🚀 发布求购
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : wanted.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-50">
          <div className="text-5xl mb-3">📢</div>
          <p className="text-gray-400 font-bold">暂无求购需求</p>
        </div>
      ) : (
        <div className="space-y-3">
          {wanted.map(w => (
            <div key={w.id} className="bg-white rounded-2xl border border-gray-50 p-4 flex items-start gap-4 min-w-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">{w.category_name_zh}</span>
                  <span className="text-xs text-gray-400">{w.language === 'zh' ? '中文版' : 'English'}</span>
                  {w.status === 'closed' && <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">已结束</span>}
                </div>
                <h3 className="font-bold text-gray-800 text-sm">{w.title}</h3>
                {w.max_price > 0 && <p className="text-sm text-pink-500 font-bold mt-1">预算 HK${w.max_price}</p>}
                {w.description && <p className="text-xs text-gray-400 mt-1">{w.description}</p>}
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white flex items-center justify-center text-[10px] font-bold">{w.user_nickname?.[0]?.toUpperCase()}</div>
                  <span className="text-xs text-gray-400">{w.user_nickname}</span>
                  <span className="text-xs text-gray-300">{new Date(w.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {isAuthenticated && (
                <Link to={`/chat/${w.user_id}`}
                  className="bg-purple-50 text-purple-500 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 hover:bg-purple-100">
                  💬 联系
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
