import React, { createContext, useState, useContext, useEffect } from 'react';
import isTokenValid from '../utils/isTokenValid';

// Create context
const AuthContext = createContext();

// Create provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const isTokenValidContext = () => {
    return isTokenValid();
  };

  const [currentUserId,setCurrentUserId] = useState(localStorage.getItem("id") || '');

  const value = {
    token,
    setToken,
    currentUserId,
    setCurrentUserId,
    isTokenValid: isTokenValidContext
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
