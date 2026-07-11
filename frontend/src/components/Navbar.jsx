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
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/" className="flex items-center gap-1.5 font-extrabold text-base sm:text-lg tracking-tight shrink-0 select-none">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{background:'linear-gradient(135deg,#ff6b6b,#ee5a24)'}}>H</span>
            <span className="hidden sm:inline"><span style={{color:'#ff6b6b'}}>HK</span><span className="text-gray-800">Textbook</span></span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link to="/create" className="btn btn-primary !min-h-0 !py-1.5 !px-3 sm:!py-2 sm:!px-3.5 !text-xs sm:!text-sm !rounded-lg"><PlusIcon className="w-3.5 h-3.5" />发布</Link>
            <Link to="/wanted" className="btn btn-ghost !min-h-0 !py-1.5 !px-3 sm:!py-2 sm:!px-3.5 !text-xs sm:!text-sm !rounded-lg">求购</Link>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setOpen(!open)} className="md:hidden btn btn-ghost !min-h-0 !py-1.5 !px-2.5 !text-xs !rounded-lg">
            {open ? <CloseIcon className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
          </button>
          <div className="hidden md:flex items-center gap-1.5 text-sm font-semibold">
            {isAuthenticated ? (
              <>
                <Link to="/favorites" className="btn btn-ghost !min-h-0 !py-1.5 !px-2 !rounded-lg"><StarIcon className="w-4 h-4" /></Link>
                <Link to="/messages" className="btn btn-ghost !min-h-0 !py-1.5 !px-2 !rounded-lg"><MessageIcon className="w-4 h-4" /></Link>
                <Link to="/profile" className="btn btn-ghost !min-h-0 !py-1.5 !px-3 !text-xs !rounded-lg max-w-[100px] truncate">{user?.nickname}</Link>
                <button onClick={() => { logout(); toast('已登出'); navigate('/'); }} className="text-gray-400 text-xs px-1">登出</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-ghost !min-h-0 !py-1.5 !px-3.5 !text-sm !rounded-lg">登录</Link>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass !rounded-none !border-0 !border-t space-y-2 p-4">
          {isAuthenticated ? (
            <>
              <Link to="/favorites" onClick={() => setOpen(false)} className="btn btn-ghost w-full justify-start text-gray-700">⭐ 收藏</Link>
              <Link to="/messages" onClick={() => setOpen(false)} className="btn btn-ghost w-full justify-start text-gray-700">💬 消息</Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="btn btn-ghost w-full justify-start text-gray-700">{user?.nickname}</Link>
              <button onClick={() => { logout(); toast('已登出'); navigate('/'); setOpen(false); }} className="text-gray-400 py-2 w-full text-left text-sm">登出</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="btn btn-ghost w-full justify-center">登录</Link>
          )}
        </div>
      )}
    </nav>
  );
}
