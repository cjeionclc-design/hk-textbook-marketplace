import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import client from '../api/client';
import useAuth from '../hooks/useAuth';
import ProtectedRoute from '../components/ProtectedRoute';

export default function ChatPage() {
  return <ProtectedRoute><Chat /></ProtectedRoute>;
}

function Chat() {
  const { partnerId } = useParams();
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('listing') || null;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [partner, setPartner] = useState(null);
  const bottomRef = useRef(null);

  const loadMessages = () => {
    const params = {};
    if (listingId) params.listing_id = listingId;
    client.get(`/messages/${partnerId}`, { params }).then(res => {
      setMessages(res.data);
      if (res.data.length > 0) {
        const last = res.data[res.data.length - 1];
        setPartner(last.sender_id === user.id ? last.sender_nickname : last.sender_nickname);
      }
    });
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [partnerId, listingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await client.post('/messages', {
      receiver_id: parseInt(partnerId),
      listing_id: listingId ? parseInt(listingId) : null,
      content: content.trim(),
    });
    setContent('');
    loadMessages();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-[75vh] sm:h-[78vh] flex flex-col">
        <div className="border-b border-gray-100 px-4 py-3 flex items-center gap-3 shrink-0">
          <Link to="/messages" className="text-gray-400 hover:text-gray-600">←</Link>
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
            {partner?.[0]?.toUpperCase() || '?'}
          </div>
          <span className="font-semibold text-gray-800 text-sm">{partner || 'Loading...'}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-gray-400 text-sm">发送第一条消息开始对话</p>
            </div>
          )}
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 break-words ${
                m.sender_id === user.id
                  ? 'bg-indigo-600 text-white rounded-br-md'
                  : 'bg-white border border-gray-100 shadow-sm rounded-bl-md'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
                <div className={`text-[10px] mt-1.5 ${m.sender_id === user.id ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="border-t border-gray-100 p-3 flex gap-2 bg-white shrink-0">
          <input type="text" value={content} onChange={e => setContent(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-300 focus:outline-none transition-all min-w-0 bg-gray-50" />
          <button type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0 disabled:opacity-50"
            disabled={!content.trim()}>
            发送
          </button>
        </form>
      </div>
    </div>
  );
}
