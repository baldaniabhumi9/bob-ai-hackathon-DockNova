import React from 'react';
import { colors, radius, spacing, shadows } from '@/design-system';

export interface ProfileMenuProps {
  onSelectProfile: () => void;
  onSelectEditProfile: () => void;
  onSelectSettings: () => void;
  onSelectSignOut: () => void;
}

/**
 * Popover menu anchored above the sidebar's profile section.
 * Positioned absolutely by the parent (Sidebar); this component only
 * renders its own content and styling.
 */
export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  onSelectProfile,
  onSelectEditProfile,
  onSelectSettings,
  onSelectSignOut,
}) => {
  const itemStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    color: colors.primaryText,
    fontSize: '0.8125rem',
    fontWeight: 500,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: radius.sm,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 8px)',
        left: 0,
        right: 0,
        backgroundColor: colors.surfaceHover,
        border: `1px solid ${colors.surfaceBorder}`,
        borderRadius: radius.md,
        boxShadow: shadows.lg,
        padding: spacing.xs,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        zIndex: 50,
      }}
    >
      <button style={itemStyle} onClick={onSelectProfile}>
        👤 Profile
      </button>
      <button style={itemStyle} onClick={onSelectEditProfile}>
        ✏️ Edit Profile
      </button>
      <button style={itemStyle} onClick={onSelectSettings}>
        ⚙️ Control Tower Settings
      </button>
      <div style={{ borderTop: `1px solid ${colors.surfaceBorder}`, margin: `${spacing.xs} 0` }} />
      <button style={{ ...itemStyle, color: colors.critical }} onClick={onSelectSignOut}>
        🚪 Sign Out
      </button>
    </div>
  );
};

export default ProfileMenu;
