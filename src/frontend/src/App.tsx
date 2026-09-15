import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { LandingPage } from './pages/landing';
import { LoginPage, SignupPage, RoleSelectionPage, UnauthorizedPage } from './pages/auth';
import { ManagerPage } from './pages/manager';
import { AdminPage } from './pages/admin';
import { UserPage } from './pages/user';
import { VesselDetailPage } from './pages/user/VesselDetailPage';
import { AlternateRoutingPage } from './pages/user/AlternateRoutingPage';
import { NotificationsPage } from './pages/user/NotificationsPage';
import { CopilotPage } from './pages/user/CopilotPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Entry Landing & Auth Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/select-role" element={<RoleSelectionPage />} />

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

              {/* AI Copilot (IBM Bob) Routes */}
              <Route
                path="/user/copilot"
                element={
                  <ProtectedRoute allowedRoles={['user', 'manager', 'admin']}>
                    <CopilotPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/copilot"
                element={
                  <ProtectedRoute allowedRoles={['user', 'manager', 'admin']}>
                    <CopilotPage />
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

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
