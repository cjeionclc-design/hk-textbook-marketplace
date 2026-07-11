import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { ShopIcon } from '../components/Icon';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try { await login(email, password); toast('欢迎回来！'); navigate('/'); }
    catch (err) { setError(err.response?.data?.detail || '登录失败'); }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 sm:mt-16">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'linear-gradient(135deg,#ff6b6b,#ee5a24)'}}>
          <ShopIcon className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800">欢迎回来</h1>
        <p className="text-gray-400 mt-1.5 text-sm font-medium">登录 HKTextbook</p>
      </div>
      <div className="glass p-6 !rounded-2xl">
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm font-semibold">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">邮箱</label>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
              className="glass-input w-full" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">密码</label>
            <input type="password" placeholder="······" value={password} onChange={e => setPassword(e.target.value)}
              className="glass-input w-full" required />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center py-3 text-base">登录</button>
        </form>
        <p className="mt-5 text-center text-gray-400 text-sm font-medium">
          还没有账户？ <Link to="/register" className="font-bold" style={{color:'#ff6b6b'}}>立即注册</Link>
        </p>
      </div>
    </div>
  );
}
