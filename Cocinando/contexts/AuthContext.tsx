import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { User } from '@/types/api';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
};

type AuthContextType = {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await apiService.getCurrentUser();
        setAuthState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          isAdmin: user?.role === 'admin',
        });
      } catch (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const user = await apiService.login({ email, password });
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
      isAdmin: user.role === 'admin',
    });
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    const user = await apiService.register(data);
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
      isAdmin: user.role === 'admin',
    });
  };

  const logout = async () => {
    await apiService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false,
    });
  };

  const updateProfile = async (userData: Partial<User>) => {
    const updatedUser = await apiService.updateProfile(userData);
    setAuthState(prev => ({
      ...prev,
      user: { ...prev.user, ...updatedUser } as User,
    }));
  };

  const refreshUser = async () => {
    try {
      const user = await apiService.getCurrentUser();
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        isAdmin: user?.role === 'admin',
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
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

export const useIsAuthenticated = () => {
  const { authState } = useAuth();
  return authState.isAuthenticated;
};

export const useIsAdmin = () => {
  const { authState } = useAuth();
  return authState.isAdmin;
};

export const useCurrentUser = () => {
  const { authState } = useAuth();
  return authState.user;
};
