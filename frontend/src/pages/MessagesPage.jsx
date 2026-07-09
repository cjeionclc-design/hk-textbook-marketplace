import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import ProtectedRoute from '../components/ProtectedRoute';

export default function MessagesPage() {
  return <ProtectedRoute><ConversationList /></ProtectedRoute>;
}

function ConversationList() {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    client.get('/messages/conversations').then(res => setConversations(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Messages</h1>
      {conversations.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">No messages yet</div>
      ) : (
        <div className="space-y-2">
          {conversations.map(c => (
            <Link key={`${c.partner_id}-${c.listing_id}`}
              to={`/chat/${c.partner_id}?listing=${c.listing_id || ''}`}
              className="block bg-white border rounded-xl p-3 sm:p-4 hover:border-blue-300 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <span className="font-medium text-sm truncate block">{c.partner_nickname}</span>
                  {c.listing_title && (
                    <span className="text-xs text-gray-400 truncate block">re: {c.listing_title}</span>
                  )}
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(c.last_message_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1 truncate">{c.last_message}</p>
              {c.unread_count > 0 && (
                <span className="inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded-full mt-1">
                  {c.unread_count} new
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
