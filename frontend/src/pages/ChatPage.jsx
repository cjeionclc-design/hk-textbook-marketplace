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
      const prev = messages.length;
      if (res.data.length > prev && prev > 0) {
        const newMsg = res.data[res.data.length - 1];
        if (newMsg.sender_id !== user.id && document.hidden && Notification.permission === 'granted') {
          new Notification(`新消息: ${newMsg.sender_nickname}`, { body: newMsg.content, icon: '/favicon.ico' });
        }
      }
      setMessages(res.data);
      if (res.data.length > 0) {
        const last = res.data[res.data.length - 1];
        setPartner(last.sender_nickname);
      }
    });
  };

  useEffect(() => {
    if (Notification.permission === 'default') Notification.requestPermission();
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
      <div className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden h-[75vh] sm:h-[78vh] flex flex-col">
        <div className="border-b border-gray-50 px-4 py-3 flex items-center gap-3 shrink-0 bg-white">
          <Link to="/messages" className="text-gray-400 hover:text-orange-400 text-lg font-bold">←</Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 text-white flex items-center justify-center text-xs font-bold shadow-sm">
            {partner?.[0]?.toUpperCase() || '?'}
          </div>
          <span className="font-bold text-gray-800 text-sm">{partner || '加载中...'}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-orange-50/30 to-white">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-gray-400 font-bold">发送第一条消息开始对话</p>
            </div>
          )}
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 break-words ${
                m.sender_id === user.id
                  ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-br-md shadow-md shadow-orange-200'
                  : 'bg-white border border-gray-100 shadow-sm rounded-bl-md'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{m.content}</p>
                <div className={`text-[10px] mt-1.5 font-medium ${m.sender_id === user.id ? 'text-orange-100' : 'text-gray-400'}`}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="border-t border-gray-50 p-3 flex gap-2 bg-white shrink-0">
          <input type="text" value={content} onChange={e => setContent(e.target.value)}
            placeholder="输入消息..."
            className="flex-1 border border-gray-100 rounded-2xl px-4 py-2.5 text-sm focus:border-orange-300 focus:outline-none transition-all min-w-0 bg-gray-50 font-medium" />
          <button type="submit"
            className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-2xl text-sm font-bold transition-all shrink-0 disabled:opacity-40 active:scale-95"
            disabled={!content.trim()}>
            发送
          </button>
        </form>
      </div>
    </div>
  );
}
