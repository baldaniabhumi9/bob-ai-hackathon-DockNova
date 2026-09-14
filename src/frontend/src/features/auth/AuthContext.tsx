import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, LoginCredentials, SignupData, AuthContextType } from './types';
import { authService, generateMockJWT } from '@/services/authService';

export const STORAGE_KEY_USER = 'docknova_auth_user';
export const STORAGE_KEY_TOKEN = 'docknova_jwt_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_TOKEN);
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore & verify session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);

        if (storedUser && storedToken) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
        } else {
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        setUser(null);
        setToken(null);
      } finally {
        // Small delay to prevent flash of content
        setTimeout(() => {
          setIsLoading(false);
        }, 150);
      }
    };

    initAuth();
  }, []);

  const updateRole = (newRole: UserRole) => {
    if (!user) return;
    const updatedUser: User = { ...user, role: newRole };
    const newToken = generateMockJWT(updatedUser);

    setUser(updatedUser);
    setToken(newToken);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
  };

  const login = async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    try {
      const { user: authedUser, token: authToken } = await authService.login(credentials);

      setUser(authedUser);
      setToken(authToken);

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authedUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, authToken);

      setIsLoading(false);
      return { success: true, user: authedUser };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Authentication failed' };
    }
  };

  const signup = async (
    data: SignupData
  ): Promise<{ success: boolean; user?: User; error?: string }> => {
    setIsLoading(true);
    try {
      const { user: registeredUser, token: authToken } = await authService.signup(data);

      setUser(registeredUser);
      setToken(authToken);

      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(registeredUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, authToken);

      setIsLoading(false);
      return { success: true, user: registeredUser };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  };

  const currentRole: UserRole = user?.role || 'user';

  return (
    <AuthContext.Provider
      value={{
        user,
        role: currentRole,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        signup,
        logout,
        updateRole,
        setRole: updateRole, // Alias for backward compatibility
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
