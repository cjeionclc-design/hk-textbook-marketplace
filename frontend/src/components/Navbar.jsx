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
    toast('已登出 👋', 'info');
    navigate('/');
    setOpen(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-orange-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold tracking-tight shrink-0 select-none">
          📚 <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">HKTextbook</span>
        </Link>

        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 text-xl leading-none p-1">
          {open ? '✕' : '☰'}
        </button>

        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          {isAuthenticated ? (
            <>
              <Link to="/create" className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white px-4 py-1.5 rounded-full transition-all shadow-md shadow-orange-200 scale-100 hover:scale-105 active:scale-95">+ 卖书</Link>
              <Link to="/wanted" className="text-gray-500 hover:text-purple-500 transition-colors">📢 求购</Link>
              <Link to="/messages" className="text-gray-500 hover:text-orange-500 transition-colors">💬 消息</Link>
              <Link to="/profile" className="text-gray-700 hover:text-pink-500 transition-colors truncate max-w-[100px]">{user?.nickname}</Link>
              <button onClick={handleLogout} className="text-gray-300 hover:text-red-400 transition-colors">登出</button>
            </>
          ) : (
            <Link to="/login" className="text-orange-500 hover:text-orange-600 transition-colors font-bold">登录</Link>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-orange-50 bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium">
          {isAuthenticated ? (
            <>
              <Link to="/create" onClick={() => setOpen(false)} className="text-orange-500">+ 卖书</Link>
              <Link to="/messages" onClick={() => setOpen(false)} className="text-gray-700">💬 消息</Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="text-gray-700">{user?.nickname}</Link>
              <button onClick={handleLogout} className="text-left text-gray-400">登出</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-orange-500">登录</Link>
          )}
        </div>
      )}
    </nav>
  );
}
