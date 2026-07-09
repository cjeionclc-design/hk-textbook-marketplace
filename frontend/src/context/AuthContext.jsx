import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import client from '../api/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(() => !!localStorage.getItem('token'));
  const userRef = useRef(null);

  const refreshUser = useCallback(async () => {
    try {
      const res = await client.get('/auth/me');
      setUser(res.data);
      userRef.current = res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        userRef.current = null;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && !userRef.current) {
      refreshUser();
    } else if (!token) {
      setUser(null);
      userRef.current = null;
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [token, refreshUser]);

  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password });
    const u = res.data.user;
    localStorage.setItem('token', res.data.access_token);
    userRef.current = u;
    setUser(u);
    setToken(res.data.access_token);
    return res.data;
  };

  const register = async (nickname, email, password) => {
    const res = await client.post('/auth/register', { nickname, email, password });
    const u = res.data.user;
    localStorage.setItem('token', res.data.access_token);
    userRef.current = u;
    setUser(u);
    setToken(res.data.access_token);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    userRef.current = null;
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
