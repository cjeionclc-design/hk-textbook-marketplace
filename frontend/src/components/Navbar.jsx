import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from './Toast';
import { PlusIcon, MegaphoneIcon, MessageIcon, UserIcon, LoginIcon, MenuIcon, CloseIcon, StarIcon } from './Icon';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-lg tracking-tight shrink-0 select-none">
            <span className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{background:'linear-gradient(135deg,#ff6b6b,#ee5a24)'}}>H</span>
            <span style={{color:'#ff6b6b'}}>HK</span><span className="text-gray-800">Textbook</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 ml-4">
            <Link to="/create" className="btn btn-primary text-sm">+ 发布</Link>
            <Link to="/wanted" className="btn btn-ghost text-sm">求购</Link>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={() => setOpen(!open)} className="md:hidden btn w-9 h-9 flex items-center justify-center p-0 text-gray-400">
            {open ? <CloseIcon className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
          </button>
          <div className="hidden md:flex items-center gap-2 text-sm font-semibold">
            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="p-2 text-gray-400 hover:text-red-400 transition-colors"><StarIcon className="w-5 h-5" /></Link>
                <Link to="/messages" className="p-2 text-gray-400 hover:text-red-400 transition-colors"><MessageIcon className="w-5 h-5" /></Link>
                <Link to="/profile" className="btn btn-ghost px-3 py-1.5 text-gray-600 text-xs truncate max-w-[100px]"><UserIcon className="w-3.5 h-3.5" />{user?.nickname}</Link>
                <button onClick={() => { logout(); toast('已登出'); navigate('/'); }} className="text-gray-400 hover:text-gray-600 text-xs px-1">登出</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-ghost"><LoginIcon className="w-4 h-4" /> 登录</Link>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-3 text-sm font-semibold">
          <Link to="/create" onClick={() => setOpen(false)} className="btn btn-primary justify-center">+ 发布书籍</Link>
          <Link to="/wanted" onClick={() => setOpen(false)} className="btn btn-ghost justify-center">求购广场</Link>
          {isAuthenticated ? (
            <>
              <Link to="/favorites" onClick={() => setOpen(false)} className="btn justify-center text-gray-600">⭐ 收藏</Link>
              <Link to="/messages" onClick={() => setOpen(false)} className="btn justify-center text-gray-600">💬 消息</Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="btn justify-center text-gray-600">{user?.nickname}</Link>
              <button onClick={() => { logout(); toast('已登出'); navigate('/'); setOpen(false); }} className="text-gray-400 py-2">登出</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="btn btn-ghost justify-center">登录</Link>
          )}
        </div>
      )}
    </nav>
  );
}
