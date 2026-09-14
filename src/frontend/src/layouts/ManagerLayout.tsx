import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NavItem } from '@/components/layout/Sidebar';
import { ProfileMenu } from '@/components/layout/ProfileMenu';
import { ProfileModal } from '@/components/layout/ProfileModal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { colors, spacing } from '@/design-system';
import { ManagerProfile, DEFAULT_MANAGER_PROFILE } from '@/features/profile';

export interface ManagerLayoutProps {
  children: React.ReactNode;
  activeNavItemId?: string;
  onNavItemSelect?: (id: string) => void;
  pageTitle?: string;
}

const MANAGER_NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'congestion', label: 'Congestion' },
  { id: 'ripple', label: 'Ripple Effect' },
  { id: 'vessels', label: 'Vessels' },
  { id: 'berths', label: 'Berths' },
  { id: 'cranes', label: 'Cranes' },
  { id: 'optimisation', label: 'Optimisation' },
  { id: 'simulation', label: 'What-If Simulator' },
  { id: 'plan72h', label: '72-Hour Plan' },
  { id: 'copilot', label: 'AI Copilot' },
];

const MANAGER_BOTTOM_ITEMS: NavItem[] = [
  { id: 'settings', label: 'Settings' },
];

export interface ManagerLayoutProps {
  children: React.ReactNode;
  activeNavItemId?: string;
  onNavItemSelect?: (id: string) => void;
  pageTitle?: string;
  headerSlot?: React.ReactNode;
}

export const ManagerLayout: React.FC<ManagerLayoutProps> = ({
  children,
  activeNavItemId = 'overview',
  onNavItemSelect,
  pageTitle = 'Port Control Tower',
  headerSlot,
}) => {
  const [profile, setProfile] = useState<ManagerProfile>(DEFAULT_MANAGER_PROFILE);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalMode, setProfileModalMode] = useState<'view' | 'edit'>('view');
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);

  const openProfileModal = (mode: 'view' | 'edit') => {
    setProfileModalMode(mode);
    setIsProfileModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleSelectSettings = () => {
    setIsMenuOpen(false);
    onNavItemSelect?.('settings');
  };

  const handleSignOutConfirmed = () => {
    // Mock sign-out action only — no real authentication/logout implemented.
    setIsSignOutConfirmOpen(false);
  };

  return (
    <>
      {isMenuOpen && (
        <div
          onClick={() => setIsMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
        />
      )}
      <DashboardLayout
        roleTitle="MANAGER"
        userRole="Manager"
        userName={profile.name}
        navItems={MANAGER_NAV_ITEMS}
        bottomItems={MANAGER_BOTTOM_ITEMS}
        activeNavItemId={activeNavItemId}
        onNavItemSelect={onNavItemSelect}
        pageTitle={pageTitle}
        headerSlot={headerSlot}
        onProfileClick={() => setIsMenuOpen((open) => !open)}
        profilePopover={
          isMenuOpen ? (
            <ProfileMenu
              onSelectProfile={() => openProfileModal('view')}
              onSelectEditProfile={() => openProfileModal('edit')}
              onSelectSettings={handleSelectSettings}
              onSelectSignOut={() => {
                setIsMenuOpen(false);
                setIsSignOutConfirmOpen(true);
              }}
            />
          ) : undefined
        }
      >
        {children}
      </DashboardLayout>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        initialMode={profileModalMode}
        onSave={(updated) => setProfile(updated)}
      />

      {isSignOutConfirmOpen && (
        <Modal
          isOpen={isSignOutConfirmOpen}
          onClose={() => setIsSignOutConfirmOpen(false)}
          title="Sign Out"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: colors.secondaryText }}>
              Are you sure you want to sign out of DockNova Control Tower?
            </p>
            <div style={{ display: 'flex', gap: spacing.sm }}>
              <Button variant="danger" onClick={handleSignOutConfirmed}>
                Sign Out
              </Button>
              <Button variant="secondary" onClick={() => setIsSignOutConfirmOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
