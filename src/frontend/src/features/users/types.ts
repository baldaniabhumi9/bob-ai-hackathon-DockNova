export type UserRole = 'manager' | 'user' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
  status: UserStatus;
  lastActive: string;
  avatarColor?: string;
  mfaStatus?: 'Enforced Hardware Key' | 'Authenticator App' | 'SMS Verify' | 'None';
  createdAt: string;
  title?: string;
}

export interface UserStats {
  total: number;
  active: number;
  pending: number;
}
