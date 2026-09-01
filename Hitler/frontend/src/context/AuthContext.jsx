import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('admin_password') || 'admin123';
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          // Keep offline state intact if API is unavailable
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyAdminPassword = (inputPass) => {
    return inputPass === adminPassword;
  };

  const updateAdminPassword = (currentPass, newPass) => {
    if (currentPass !== adminPassword) {
      return { success: false, message: "Hozirgi parol noto'g'ri kiritildi!" };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: "Yangi parol kamida 4 ta belgidan iborat bo'lishi kerak!" };
    }
    setAdminPassword(newPass);
    localStorage.setItem('admin_password', newPass);
    return { success: true, message: "Admin paroli muvaffaqiyatli o'zgartirildi!" };
  };

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      token, 
      login, 
      logout, 
      isAdmin, 
      loading,
      adminPassword,
      verifyAdminPassword,
      updateAdminPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

