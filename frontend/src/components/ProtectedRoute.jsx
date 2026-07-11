import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-red-200 border-t-red-400 rounded-full animate-spin" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
}
