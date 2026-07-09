import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useToast } from '../components/Toast';

export default function RegisterPage() {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(nickname, email, password);
      toast('注册成功!', 'success');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 sm:mt-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">创建账户</h1>
        <p className="text-gray-500 mt-2 text-sm">加入 HKTextbook 二手书社区</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-5 text-sm font-medium">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">昵称</label>
            <input type="text" placeholder="你的名字" value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">邮箱</label>
            <input type="email" placeholder="your@email.com" value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
            <input type="password" placeholder="至少6位" value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all" required />
          </div>
          <button type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-md shadow-indigo-200">
            注册
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          已有账户? <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">登录</Link>
        </p>
      </div>
    </div>
  );
}
