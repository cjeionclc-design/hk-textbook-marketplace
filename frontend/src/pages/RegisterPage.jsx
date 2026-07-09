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
      toast('注册成功！🎉', 'success');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || '注册失败');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 sm:mt-14">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎓</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">加入我们 🚀</h1>
        <p className="text-gray-400 mt-2 font-medium">创建你的 HKTextbook 账户</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-50 shadow-sm p-6 sm:p-8">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-2xl mb-5 text-sm font-bold">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">😎 昵称</label>
            <input type="text" placeholder="你的名字" value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all font-medium" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">📧 邮箱</label>
            <input type="email" placeholder="your@email.com" value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all font-medium" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">🔒 密码</label>
            <input type="password" placeholder="至少6位" value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-100 rounded-2xl px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:border-orange-300 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all font-medium" required />
          </div>
          <button type="submit"
            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-purple-200 hover:scale-[1.02] active:scale-[0.98]">
            🎉 注册
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm font-medium">
          已有账户？ <Link to="/login" className="text-orange-500 font-bold hover:text-orange-600">立即登录</Link>
        </p>
      </div>
    </div>
  );
}
