import React from 'react';
import { UserLayout } from '@/layouts/UserLayout';
import { Card } from '@/components/ui/Card';

export const UserPage: React.FC = () => {
  return (
    <UserLayout pageTitle="Terminal Operator Console">
      <Card title="Operator Ownership Boundary" subtitle="Terminal & Vessel Operations placeholder">
        <p style={{ margin: 0, color: '#94A3B8' }}>
          This page represents the dedicated ownership area for Operator views.
        </p>
      </Card>
    </UserLayout>
  );
};

export default UserPage;
