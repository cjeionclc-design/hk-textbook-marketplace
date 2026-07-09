import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from './Toast';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast('Logged out', 'info');
    navigate('/');
    setOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tight shrink-0">
          <span className="text-indigo-600">HK</span><span className="text-gray-800">Textbook</span>
        </Link>

        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-500 text-xl leading-none">
          {open ? '✕' : '☰'}
        </button>

        <div className="hidden md:flex items-center gap-4 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-full font-medium transition-colors">+ Sell</Link>
              <Link to="/messages" className="text-gray-500 hover:text-gray-700 transition-colors">Messages</Link>
              <Link to="/profile" className="text-gray-700 hover:text-gray-900 font-medium truncate max-w-[100px] transition-colors">{user?.nickname}</Link>
              <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 transition-colors">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">Login</Link>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <Link to="/create" onClick={() => setOpen(false)} className="text-indigo-600 font-medium">+ Sell a Textbook</Link>
              <Link to="/messages" onClick={() => setOpen(false)} className="text-gray-700">Messages</Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="text-gray-700">{user?.nickname}</Link>
              <button onClick={handleLogout} className="text-left text-gray-400">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-indigo-600">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
