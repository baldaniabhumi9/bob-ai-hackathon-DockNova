import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { UserRole } from '../types';
import { AuthLoadingScreen } from './AuthLoadingScreen';

export interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // 1. Loading state: full-screen skeleton/spinner
  if (isLoading) {
    return <AuthLoadingScreen message="Verifying maritime security token..." />;
  }

  // 2. Unauthenticated check -> forced to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role-based authorization check
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Authorized: render child component or nested outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
