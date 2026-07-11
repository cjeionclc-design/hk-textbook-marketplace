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
    <nav className="neo-nav sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-lg font-extrabold tracking-tight shrink-0 select-none">
            📚 <span style={{color:'#ff7b3d'}}>HK</span><span className="text-gray-700">Textbook</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 ml-4">
            <Link to="/create" className="neo-btn-primary px-4 py-1.5 text-sm flex items-center gap-1 shadow-[3px_3px_6px_#e8c8b5,-3px_-3px_6px_#ffffff]">+ 发布</Link>
            <Link to="/wanted" className="neo-btn px-4 py-1.5 text-sm font-bold text-orange-500 flex items-center gap-1 shadow-[3px_3px_6px_#e0dbd6,-3px_-3px_6px_#ffffff]">📢 求购</Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 text-xl leading-none neo-btn w-9 h-9 flex items-center justify-center shadow-[2px_2px_4px_#e0dbd6,-2px_-2px_4px_#ffffff]">
            {open ? '✕' : '☰'}
          </button>
          <div className="hidden md:flex items-center gap-3 text-sm font-bold">
            {isAuthenticated ? (
              <>
                <Link to="/messages" className="text-gray-500 hover:text-orange-500 transition-colors">💬</Link>
                <Link to="/profile" className="neo-btn px-3 py-1.5 text-gray-600 shadow-[2px_2px_4px_#e0dbd6,-2px_-2px_4px_#ffffff] truncate max-w-[100px]">{user?.nickname}</Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors text-xs">登出</button>
              </>
            ) : (
              <Link to="/login" className="neo-btn px-4 py-1.5 text-orange-500 shadow-[2px_2px_4px_#e0dbd6,-2px_-2px_4px_#ffffff]">登录</Link>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-orange-100/50 bg-[#faf8f5] px-4 py-4 flex flex-col gap-3 text-sm font-bold">
          <Link to="/create" onClick={() => setOpen(false)} className="neo-btn-primary text-center py-2">+ 发布书籍</Link>
          <Link to="/wanted" onClick={() => setOpen(false)} className="neo-btn text-center py-2 text-orange-500">📢 求购广场</Link>
          {isAuthenticated ? (
            <>
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
