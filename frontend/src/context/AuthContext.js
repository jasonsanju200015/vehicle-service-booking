import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const validate = async () => {
      const t = localStorage.getItem('token');
      if (!t) return;
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        setToken(t);
      } catch (err) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    };
    validate();
  }, []);

  const saveToken = (t, u) => { localStorage.setItem('token', t); setToken(t); if (u) setUser(u); };
  const logout = () => { localStorage.removeItem('token'); setToken(null); setUser(null); };
  return <AuthContext.Provider value={{ token, user, saveToken, logout }}>{children}</AuthContext.Provider>;
};
