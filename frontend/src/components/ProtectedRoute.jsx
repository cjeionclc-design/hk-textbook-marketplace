import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading...</div>;
  }
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
}
