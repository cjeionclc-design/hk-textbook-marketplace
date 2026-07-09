import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
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
  const bottomRef = useRef(null);

  const loadMessages = () => {
    const params = {};
    if (listingId) params.listing_id = listingId;
    client.get(`/messages/${partnerId}`, { params }).then(res => setMessages(res.data));
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
      <div className="bg-white rounded-xl border h-[70vh] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-xl px-4 py-2 ${m.sender_id === user.id ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                <div className="text-xs opacity-70 mb-0.5">{m.sender_nickname}</div>
                <p>{m.content}</p>
                <div className="text-xs opacity-50 mt-1">
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={send} className="border-t p-3 flex gap-2">
          <input type="text" value={content} onChange={e => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-2" />
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
