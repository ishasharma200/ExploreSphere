import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
  });
  const [authReady, setAuthReady] = useState(false);

  // Restore token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setAuth({
        isAuthenticated: true,
        token: savedToken,
        user: JSON.parse(savedUser),
      });
    }
    setAuthReady(true);
  }, []);

  // Listen for global logout events (e.g., API 401 responses)
  useEffect(() => {
    const handleGlobalLogout = (e) => {
      // Allow event to pass a reason (e.g., { detail: { reason: 'unauthorized' } })
      logout();
      try {
        const reason = e?.detail?.reason;
        if (reason === 'unauthorized') {
          // If unauthorized, redirect to login so user can sign in again
          window.location.href = '/login';
        }
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('auth:logout', handleGlobalLogout);
    return () => window.removeEventListener('auth:logout', handleGlobalLogout);
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({
      isAuthenticated: true,
      token,
      user,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, authReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
