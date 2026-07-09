import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">HKTextbook</Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/create" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm">+ Sell</Link>
              <Link to="/messages" className="text-gray-500 text-sm">Messages</Link>
              <Link to="/profile" className="text-gray-700 text-sm">{user?.nickname}</Link>
              <button onClick={logout} className="text-gray-500 text-sm">Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-blue-600 text-sm">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
