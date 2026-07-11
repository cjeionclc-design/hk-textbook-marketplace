import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from './Toast';
import { PlusIcon, MegaphoneIcon, MessageIcon, UserIcon, LoginIcon, MenuIcon, CloseIcon } from './Icon';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast('已登出', 'info');
    navigate('/');
    setOpen(false);
  };

  return (
    <nav className="neo-nav sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-lg font-extrabold tracking-tight shrink-0 select-none flex items-center gap-1.5">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{background:'#ff7b3d'}}>H</span>
            <span style={{color:'#ff7b3d'}}>HK</span><span className="text-gray-700">Textbook</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 ml-4">
            <Link to="/create" className="neo-btn-primary px-4 py-1.5 text-sm flex items-center gap-1.5 shadow-[3px_3px_6px_#e8c8b5,-3px_-3px_6px_#ffffff]">
              <PlusIcon className="w-4 h-4" /> 发布
            </Link>
            <Link to="/wanted" className="neo-btn px-4 py-1.5 text-sm font-bold flex items-center gap-1.5 shadow-[3px_3px_6px_#e0dbd6,-3px_-3px_6px_#ffffff]" style={{color:'#ff7b3d'}}>
              <MegaphoneIcon className="w-4 h-4" /> 求购
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(!open)} className="md:hidden neo-btn w-9 h-9 flex items-center justify-center shadow-[2px_2px_4px_#e0dbd6,-2px_-2px_4px_#ffffff] text-gray-400">
            {open ? <CloseIcon className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
          </button>
          <div className="hidden md:flex items-center gap-3 text-sm font-bold">
            {isAuthenticated ? (
              <>
                <Link to="/messages" className="text-gray-400 hover:text-orange-500 transition-colors p-1"><MessageIcon /></Link>
                <Link to="/profile" className="neo-btn px-3 py-1.5 text-gray-600 shadow-[2px_2px_4px_#e0dbd6,-2px_-2px_4px_#ffffff] truncate max-w-[100px] flex items-center gap-1">
                  <UserIcon className="w-3.5 h-3.5" /> {user?.nickname}
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors text-xs">登出</button>
              </>
            ) : (
              <Link to="/login" className="neo-btn px-4 py-1.5 flex items-center gap-1.5 shadow-[2px_2px_4px_#e0dbd6,-2px_-2px_4px_#ffffff]" style={{color:'#ff7b3d'}}>
                <LoginIcon className="w-4 h-4" /> 登录
              </Link>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-orange-100/50 bg-[#faf8f5] px-4 py-4 flex flex-col gap-3 text-sm font-bold">
          <Link to="/create" onClick={() => setOpen(false)} className="neo-btn-primary text-center py-2 flex items-center justify-center gap-1.5"><PlusIcon className="w-4 h-4" /> 发布书籍</Link>
          <Link to="/wanted" onClick={() => setOpen(false)} className="neo-btn text-center py-2 flex items-center justify-center gap-1.5" style={{color:'#ff7b3d'}}><MegaphoneIcon className="w-4 h-4" /> 求购广场</Link>
          {isAuthenticated ? (
            <>
              <Link to="/messages" onClick={() => setOpen(false)} className="neo-btn px-3 py-2 flex items-center gap-1.5 text-gray-600"><MessageIcon /> 消息</Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="neo-btn px-3 py-2 flex items-center gap-1.5 text-gray-600"><UserIcon /> {user?.nickname}</Link>
              <button onClick={handleLogout} className="text-left text-gray-400 px-3 py-1">登出</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="neo-btn px-3 py-2 text-center flex items-center justify-center gap-1.5" style={{color:'#ff7b3d'}}><LoginIcon /> 登录</Link>
          )}
        </div>
      )}
    </nav>
  );
}
