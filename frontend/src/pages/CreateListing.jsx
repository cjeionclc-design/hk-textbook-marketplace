import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
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
      navigate(`/listings/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create listing');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Sell a Textbook</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

      {step === 1 && (
        <div>
          <p className="text-gray-600 mb-3 text-sm">Step 1: Find the textbook</p>
          <input type="text" placeholder="Search by title..."
            onChange={e => searchTextbook(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 mb-4 text-sm" />

          {searchResults.length > 0 && (
            <div className="space-y-2 mb-4">
              {searchResults.map(t => (
                <button key={t.id}
                  onClick={() => { setSelectedTextbook(t); setStep(2); }}
                  className="w-full text-left p-3 border rounded-lg hover:border-blue-400 min-w-0">
                  <div className="font-medium text-sm truncate">{t.title}</div>
                  <div className="text-xs text-gray-400 truncate">
                    {t.publisher} · {t.language === 'zh' ? '中文版' : 'English'} · Original HK${t.original_price}
                  </div>
                </button>
              ))}
            </div>
          )}

          <button onClick={() => setShowNewForm(true)}
            className="text-blue-600 text-sm">
            + Can't find it? Add new textbook
          </button>

          {showNewForm && (
            <form onSubmit={handleCreateNew} className="mt-4 p-4 border rounded-lg space-y-3">
              <input type="text" placeholder="Title *" required
                value={newTextbook.title}
                onChange={e => setNewTextbook({ ...newTextbook, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" placeholder="ISBN"
                  value={newTextbook.isbn}
                  onChange={e => setNewTextbook({ ...newTextbook, isbn: e.target.value })}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                <input type="text" placeholder="Publisher"
                  value={newTextbook.publisher}
                  onChange={e => setNewTextbook({ ...newTextbook, publisher: e.target.value })}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <select value={newTextbook.language}
                  onChange={e => setNewTextbook({ ...newTextbook, language: e.target.value })}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm">
                  <option value="en">English</option>
                  <option value="zh">中文版</option>
                </select>
                <input type="number" step="0.01" placeholder="Original Price *" required
                  value={newTextbook.original_price}
                  onChange={e => setNewTextbook({ ...newTextbook, original_price: e.target.value })}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm" />
              </div>
              <select value={newTextbook.category_id} required
                onChange={e => setNewTextbook({ ...newTextbook, category_id: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="">Select Subject *</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name_zh}</option>
                ))}
              </select>
              <button type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                Create & Continue
              </button>
            </form>
          )}
        </div>
      )}

      {step === 2 && selectedTextbook && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-gray-600 text-sm">Step 2: Set price and condition</p>
          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg min-w-0">
            <div className="font-medium text-sm truncate">{selectedTextbook.title}</div>
            <div className="text-xs sm:text-sm text-gray-500 truncate">
              Original: HK${selectedTextbook.original_price} · {selectedTextbook.language === 'zh' ? '中文版' : 'English'}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Selling Price (HKD) *</label>
            <input type="number" step="0.01" required
              value={price} onChange={e => setPrice(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Condition</label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[1, 2, 3, 4, 5].map(v => (
                <button key={v} type="button"
                  onClick={() => setCondition(v)}
                  className={`flex-1 min-w-[56px] py-2 rounded-lg border text-xs sm:text-sm ${condition === v ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="text-base sm:text-lg">{'★'.repeat(v)}{'☆'.repeat(5 - v)}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                    {['破损','多笔记','有痕迹','轻微','全新'][v - 1]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Photos (max 5)</label>
            <input type="file" accept="image/*" multiple
              onChange={e => setPhotos(Array.from(e.target.files))}
              className="w-full text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Any extra info about the book..."
              className="w-full border rounded-lg px-4 py-2 text-sm" rows={3} />
          </div>

          <button type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-base sm:text-lg">
            Publish Listing
          </button>
        </form>
      )}
    </div>
  );
}
