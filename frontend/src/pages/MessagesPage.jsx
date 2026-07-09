import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import ProtectedRoute from '../components/ProtectedRoute';

export default function MessagesPage() {
  return <ProtectedRoute><ConversationList /></ProtectedRoute>;
}

function ConversationList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/messages/conversations').then(res => setConversations(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">消息</h1>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-50 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">消息</h1>
      {conversations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">💬</div>
          <p className="text-gray-400 font-medium">还没有消息</p>
          <p className="text-gray-300 text-sm mt-1">浏览书籍并联系卖家开始对话</p>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(c => (
            <Link key={`${c.partner_id}-${c.listing_id}`}
              to={`/chat/${c.partner_id}?listing=${c.listing_id || ''}`}
              className="block bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all p-4 min-w-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
                  {c.partner_nickname?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-gray-800 text-sm truncate">{c.partner_nickname}</span>
                    <span className="text-xs text-gray-400 shrink-0">{new Date(c.last_message_at).toLocaleDateString()}</span>
                  </div>
                  {c.listing_title && (
                    <span className="text-xs text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded font-medium">re: {c.listing_title}</span>
                  )}
                  <p className="text-sm text-gray-500 mt-1 truncate">{c.last_message}</p>
                </div>
                {c.unread_count > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">{c.unread_count}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
