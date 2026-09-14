import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { LoginPage, SignupPage, RoleSelectionPage, UnauthorizedPage } from './pages/auth';
import { ManagerPage } from './pages/manager';
import { AdminPage } from './pages/admin';
import { UserPage } from './pages/user';
import { VesselDetailPage } from './pages/user/VesselDetailPage';
import { AlternateRoutingPage } from './pages/user/AlternateRoutingPage';
import { NotificationsPage } from './pages/user/NotificationsPage';

// Root redirect component based on authentication state
const RootRedirect: React.FC = () => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return null; // ProtectedRoute or AuthLoadingScreen handles loading
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const targetDashboard = role === 'admin' ? '/admin' : role === 'user' ? '/user' : '/manager';
  return <Navigate to={targetDashboard} replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Role Selection (Requires any authenticated user) */}
          <Route
            path="/select-role"
            element={
              <ProtectedRoute allowedRoles={['manager', 'user', 'admin']}>
                <RoleSelectionPage />
              </ProtectedRoute>
            }
          />

          {/* Vessel Passport Detail Routes (Specific routes before wildcards) */}
          <Route
            path="/user/vessel/:id"
            element={
              <ProtectedRoute allowedRoles={['user', 'manager', 'admin']}>
                <VesselDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vessels/:id"
            element={
              <ProtectedRoute allowedRoles={['user', 'manager', 'admin']}>
                <VesselDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Alternate Routing Advisor Routes */}
          <Route
            path="/user/routes"
            element={
              <ProtectedRoute allowedRoles={['user', 'manager', 'admin']}>
                <AlternateRoutingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routes"
            element={
              <ProtectedRoute allowedRoles={['user', 'manager', 'admin']}>
                <AlternateRoutingPage />
              </ProtectedRoute>
            }
          />

          {/* Notifications Center Routes */}
          <Route
            path="/user/notifications"
            element={
              <ProtectedRoute allowedRoles={['user', 'manager', 'admin']}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute allowedRoles={['user', 'manager', 'admin']}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Role-Based Routes */}
          {/* 1. Port Manager Dashboard (allowedRoles: ['manager']) */}
          <Route
            path="/manager/*"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerPage />
              </ProtectedRoute>
            }
          />

          {/* 2. Vessel Operator Console (allowedRoles: ['user']) */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserPage />
              </ProtectedRoute>
            }
          />

          {/* 3. System Administrator Console (allowedRoles: ['admin']) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Root & Fallback */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
