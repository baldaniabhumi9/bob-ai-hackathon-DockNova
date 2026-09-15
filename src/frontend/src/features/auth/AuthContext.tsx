import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, LoginCredentials, SignupData, AuthContextType } from './types';
import { authService, generateMockJWT } from '@/services/authService';

export const STORAGE_KEY_USER = 'docknova_auth_user';
export const STORAGE_KEY_TOKEN = 'docknova_jwt_token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      if (storedToken && authService.verifyToken(storedToken) && storedUser) {
        return JSON.parse(storedUser);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      if (storedToken && authService.verifyToken(storedToken)) {
        return storedToken;
      }
      return null;
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

        if (storedToken && authService.verifyToken(storedToken) && storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
        } else {
          // If no valid token exists, do NOT hydrate role from localStorage
          localStorage.removeItem(STORAGE_KEY_USER);
          localStorage.removeItem(STORAGE_KEY_TOKEN);
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
        setTimeout(() => {
          setIsLoading(false);
        }, 150);
      }
    };

    initAuth();
  }, []);

  /**
   * Explicit Switch Role Action:
   * Clears the active session (treated as logout + re-selection on RoleSelectionPage).
   */
  const switchRole = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  };

  /**
   * Select & provision role during initial login or on RoleSelectionPage
   */
  const selectRole = (newRole: UserRole) => {
    const baseUser: User = user || {
      id: `usr_${Date.now()}`,
      name: newRole === 'admin' ? 'Marcus Drake' : newRole === 'user' ? 'Elena Rostova' : 'Capt. Vance Alexander',
      email: newRole === 'admin' ? 'admin@docknova.com' : newRole === 'user' ? 'operator@docknova.com' : 'captain@docknova.com',
      role: newRole,
      company: newRole === 'admin' ? 'DockNova Systems Admin' : newRole === 'user' ? 'Carrier Operations' : 'Port Authority',
    };
    const updatedUser: User = { ...baseUser, role: newRole };
    const newToken = generateMockJWT(updatedUser);

    setUser(updatedUser);
    setToken(newToken);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
  };

  /**
   * Gate in-place role mutation on active authenticated sessions.
   * Role can only change via explicit switchRole -> RoleSelectionPage flow.
   */
  const updateRole = (newRole: UserRole) => {
    if (user && token) {
      console.warn(
        '[AuthContext] In-place role mutation blocked while authenticated. Perform explicit switchRole() to re-select role via RoleSelectionPage.'
      );
      return;
    }
    selectRole(newRole);
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
        switchRole,
        selectRole,
        updateRole,
        setRole: updateRole,
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
