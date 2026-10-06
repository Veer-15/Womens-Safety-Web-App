import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.ts';
import { authService } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  updatePermissions: (permissions: { locationGranted?: boolean; smsAcknowledged?: boolean }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sakhi_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and verify session on load
  useEffect(() => {
    async function initAuth() {
      const savedToken = localStorage.getItem('sakhi_token');
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getMe();
        setUser(currentUser);
      } catch (err) {
        console.warn('Invalid session, clearing token');
        localStorage.removeItem('sakhi_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem('sakhi_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.signup({ name, email, phone, password });
      localStorage.setItem('sakhi_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sakhi_token');
    setToken(null);
    setUser(null);
  };

  const updatePermissions = async (permissions: {
    locationGranted?: boolean;
    smsAcknowledged?: boolean;
  }) => {
    try {
      const updated = await authService.updatePermissions(permissions);
      setUser(updated);
    } catch (err) {
      console.error('Failed to update permissions:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        signup,
        logout,
        updatePermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
