import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { UserIcon, MailIcon, LockIcon, RegisterIcon } from '../components/Icon';

export default function RegisterPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try { await register(nickname, email, password); toast('注册成功！'); navigate('/'); }
    catch (err) { setError(err.response?.data?.detail || '注册失败'); }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 sm:mt-16">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'linear-gradient(135deg,#a78bfa,#8b5cf6)'}}>
          <RegisterIcon className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800">加入我们</h1>
        <p className="text-gray-400 mt-1.5 text-sm font-medium">创建 HKTextbook 账户</p>
      </div>
      <div className="card p-6">
        {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm font-semibold">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">昵称</label>
            <input type="text" placeholder="你的名字" value={nickname} onChange={e => setNickname(e.target.value)}
              className="input-field w-full" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">邮箱</label>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
              className="input-field w-full" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">密码</label>
            <input type="password" placeholder="至少6位" value={password} onChange={e => setPassword(e.target.value)}
              className="input-field w-full" required />
          </div>
          <button type="submit" className="btn w-full justify-center py-3 text-base text-white" style={{background:'linear-gradient(135deg,#a78bfa,#8b5cf6)'}}>注册</button>
        </form>
        <p className="mt-5 text-center text-gray-400 text-sm font-medium">
          已有账户？ <Link to="/login" className="font-bold" style={{color:'#ff6b6b'}}>立即登录</Link>
        </p>
      </div>
    </div>
  );
}
