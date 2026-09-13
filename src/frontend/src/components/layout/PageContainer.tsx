import React from 'react';
import { colors, spacing } from '@/design-system';

export interface PageContainerProps {
  children: React.ReactNode;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  const containerStyle: React.CSSProperties = {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
    overflowY: 'auto',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  };

  return <main style={containerStyle}>{children}</main>;
};
