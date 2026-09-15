export type UserRole = 'manager' | 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: UserRole;
  company: string;
}

export interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; user?: User; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  switchRole: () => void;
  selectRole: (role: UserRole) => void;
  updateRole: (role: UserRole) => void;
  setRole: (role: UserRole) => void;
}

