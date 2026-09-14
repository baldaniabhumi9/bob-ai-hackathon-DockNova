import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, LoginCredentials, SignupData, AuthContextType } from './types';

const STORAGE_KEY_USER = 'docknova_auth_user';
const STORAGE_KEY_ROLE = 'docknova_user_role';

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

  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const storedRole = localStorage.getItem(STORAGE_KEY_ROLE) as UserRole | null;
      if (storedRole && ['manager', 'user', 'admin'].includes(storedRole)) {
        return storedRole;
      }
      return 'manager';
    } catch {
      return 'manager';
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_ROLE, user.role);
      setRoleState(user.role);
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem(STORAGE_KEY_ROLE, newRole);
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    }
  };

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600)); // Smooth UX transition

    // Validation
    if (!credentials.email || !credentials.password) {
      setIsLoading(false);
      return { success: false, error: 'Email and password are required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      setIsLoading(false);
      return { success: false, error: 'Invalid email address format.' };
    }

    // Determine role based on email or default to 'manager'
    let assignedRole: UserRole = 'manager';
    if (credentials.email.includes('admin')) {
      assignedRole = 'admin';
    } else if (credentials.email.includes('vessel') || credentials.email.includes('user') || credentials.email.includes('operator')) {
      assignedRole = 'user';
    }

    const authenticatedUser: User = {
      id: `usr_${Date.now()}`,
      name: credentials.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email: credentials.email,
      role: assignedRole,
      company: 'DockNova Maritime Systems',
    };

    setUser(authenticatedUser);
    setRole(assignedRole);
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (!data.fullName || !data.email || !data.password) {
      setIsLoading(false);
      return { success: false, error: 'Please fill in all required fields.' };
    }

    if (data.password !== data.confirmPassword) {
      setIsLoading(false);
      return { success: false, error: 'Passwords do not match.' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.fullName,
      email: data.email,
      role: data.role,
      company: data.company || 'DockNova Alliance',
    };

    setUser(newUser);
    setRole(data.role);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        setRole,
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
