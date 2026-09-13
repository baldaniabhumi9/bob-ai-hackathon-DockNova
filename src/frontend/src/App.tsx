import React, { useState } from 'react';
import { ManagerPage } from './pages/manager';
import { AdminPage } from './pages/admin';
import { UserPage } from './pages/user';

export const App: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <ManagerPage />
    </div>
  );
};

export default App;
