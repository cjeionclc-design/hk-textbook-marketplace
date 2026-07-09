import { createContext, useState, useEffect, useCallback } from 'react';
import client from '../api/client';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  const refreshUser = useCallback(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      setLoading(false);
      return;
    }
    client.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (token) {
      refreshUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token, refreshUser]);

  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (nickname, email, password) => {
    const res = await client.post('/auth/register', { nickname, email, password });
    localStorage.setItem('token', res.data.access_token);
    setToken(res.data.access_token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}
