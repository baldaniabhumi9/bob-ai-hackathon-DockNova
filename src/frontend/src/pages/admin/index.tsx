import React from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Card } from '@/components/ui/Card';

export const AdminPage: React.FC = () => {
  return (
    <AdminLayout pageTitle="Admin Settings & System Control">
      <Card title="Admin Ownership Boundary" subtitle="System administration and access management placeholder">
        <p style={{ margin: 0, color: '#94A3B8' }}>
          This page represents the dedicated ownership area for Admin developers.
        </p>
      </Card>
    </AdminLayout>
  );
};

export default AdminPage;
