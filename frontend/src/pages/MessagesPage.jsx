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
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-6">💬 消息</h1>
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-50 p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded-lg w-24 mb-2" />
                  <div className="h-3 bg-gray-50 rounded-lg w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-6">💬 消息</h1>
      {conversations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-50 shadow-sm">
          <div className="text-6xl mb-3">💬</div>
          <p className="text-gray-400 font-bold">还没有消息</p>
          <p className="text-gray-300 text-sm mt-1 font-medium">浏览书籍并联系卖家开始对话</p>
          <Link to="/search" className="inline-block mt-3 text-orange-500 font-bold text-sm hover:text-orange-600">去逛逛 →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map(c => (
            <Link key={`${c.partner_id}-${c.listing_id}`}
              to={`/chat/${c.partner_id}?listing=${c.listing_id || ''}`}
              className="block bg-white rounded-2xl border border-gray-50 hover:border-orange-200 hover:shadow-sm transition-all p-4 min-w-0 active:scale-[0.99]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                  {c.partner_nickname?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-gray-800 text-sm truncate">{c.partner_nickname}</span>
                    <span className="text-xs text-gray-400 font-medium shrink-0">{new Date(c.last_message_at).toLocaleDateString()}</span>
                  </div>
                  {c.listing_title && (
                    <span className="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full font-bold">re: {c.listing_title}</span>
                  )}
                  <p className="text-sm text-gray-500 mt-1 truncate font-medium">{c.last_message}</p>
                </div>
                {c.unread_count > 0 && (
                  <span className="bg-gradient-to-r from-red-400 to-pink-400 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0">{c.unread_count}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
