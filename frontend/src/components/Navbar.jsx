import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-blue-600 shrink-0">HKTextbook</Link>

        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-600 text-2xl leading-none">
          {open ? '✕' : '☰'}
        </button>

        <div className="hidden md:flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/create" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg">+ Sell</Link>
              <Link to="/messages" className="text-gray-500">Messages</Link>
              <Link to="/profile" className="text-gray-700 truncate max-w-[80px]">{user?.nickname}</Link>
              <button onClick={logout} className="text-gray-400">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-blue-600">Login</Link>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/create" onClick={() => setOpen(false)} className="text-blue-600 font-medium">+ Sell a Textbook</Link>
              <Link to="/messages" onClick={() => setOpen(false)} className="text-gray-700">Messages</Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="text-gray-700">{user?.nickname}</Link>
              <button onClick={() => { logout(); setOpen(false); }} className="text-left text-gray-400">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-blue-600">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
