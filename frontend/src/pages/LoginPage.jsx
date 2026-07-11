import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { MailIcon, LockIcon, LoginIcon, RegisterIcon, ShopIcon } from '../components/Icon';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      await login(email, password);
      toast('欢迎回来！', 'success');
      navigate('/');
    } catch (err) { setError(err.response?.data?.detail || '登录失败'); }
  };

  return (
    <div className="max-w-md mx-auto mt-8 sm:mt-14">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'#ff7b3d'}}>
          <ShopIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">欢迎回来</h1>
        <p className="text-gray-400 mt-2 font-bold">登录你的 HKTextbook 账户</p>
      </div>
      <div className="neo-card p-6 sm:p-8">
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-2xl mb-5 text-sm font-bold">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1.5"><MailIcon className="w-3.5 h-3.5" /> 邮箱</label>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full neo-inset px-4 py-3 text-sm font-bold text-gray-700" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1.5 flex items-center gap-1.5"><LockIcon className="w-3.5 h-3.5" /> 密码</label>
            <input type="password" placeholder="······" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full neo-inset px-4 py-3 text-sm font-bold text-gray-700" required />
          </div>
          <button type="submit" className="w-full neo-btn-primary py-3.5 text-sm flex items-center justify-center gap-1.5">
            <LoginIcon className="w-4 h-4" /> 登录
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400 text-sm font-bold">
          还没有账户？ <Link to="/register" className="font-bold" style={{color:'#ff7b3d'}}>立即注册 <RegisterIcon className="w-3.5 h-3.5 inline" /></Link>
        </p>
      </div>
    </div>
  );
}
