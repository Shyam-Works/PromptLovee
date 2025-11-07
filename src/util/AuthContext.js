// util/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for session on initial load (GET /api/auth/login)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/login');
        if (res.ok) {
          const data = await res.json();
          setUser(data.data); // Set user data
        }
      } catch (error) {
        console.log('No active session found.');
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.data);
      return { success: true };
    } else {
      return { success: false, error: data.error || 'Login failed' };
    }
  };

  const logout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    setUser(null);
  };
  
  const register = async (username, password) => {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
        // Auto-login after successful registration
        return await login(username, password);
    } else {
        const errorData = await res.json();
        return { success: false, error: errorData.error || 'Registration failed' };
    }
  };

  if (isLoading) {
    // Prevent rendering app until auth check is complete
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-pink-600">Checking session...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};