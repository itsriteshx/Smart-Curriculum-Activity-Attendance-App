import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, farmerService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('kisan_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('kisan_token');
      const storedUser = localStorage.getItem('kisan_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Try fetching fresh profile from backend
          const res = await authService.getMe();
          if (res?.data?.data) {
            setUser(res.data.data);
            localStorage.setItem('kisan_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn('Session resume note:', err.message);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const { token: receivedToken, user: receivedUser, farmer } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    if (farmer) setFarmerProfile(farmer);

    localStorage.setItem('kisan_token', receivedToken);
    localStorage.setItem('kisan_user', JSON.stringify(receivedUser));
    return res.data;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);

    localStorage.setItem('kisan_token', receivedToken);
    localStorage.setItem('kisan_user', JSON.stringify(receivedUser));
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setFarmerProfile(null);
    localStorage.removeItem('kisan_token');
    localStorage.removeItem('kisan_user');
  };

  const updateProfile = async (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
    localStorage.setItem('kisan_user', JSON.stringify({ ...user, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        farmerProfile,
        token,
        loading,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        isFarmer: user?.role === 'farmer' || !user?.role,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
