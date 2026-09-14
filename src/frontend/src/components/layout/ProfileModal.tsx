import React, { useEffect, useState } from 'react';
import { colors, radius, spacing } from '@/design-system';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ManagerProfile, SHIFT_OPTIONS, TIMEZONE_OPTIONS } from '@/features/profile';

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ManagerProfile;
  initialMode?: 'view' | 'edit';
  onSave: (updated: ManagerProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  initialMode = 'view',
  onSave,
}) => {
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode);
  const [form, setForm] = useState<ManagerProfile>(profile);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Reset local state whenever the modal is (re)opened.
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setForm(profile);
      setShowSavedMessage(false);
    }
  }, [isOpen, initialMode, profile]);

  if (!isOpen) return null;

  const updateField = <K extends keyof ManagerProfile>(key: K, value: ManagerProfile[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(form);
    setShowSavedMessage(true);
    setMode('view');
    window.setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const infoRow = (label: string, value: string) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: radius.sm,
        border: `1px solid ${colors.surfaceBorder}`,
        padding: `${spacing.sm} ${spacing.md}`,
      }}
    >
      <span style={{ fontSize: '0.8125rem', color: colors.secondaryText }}>{label}</span>
      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: colors.primaryText }}>{value}</span>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Port Manager Profile">
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {/* Avatar + headline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: colors.surfaceHover,
              border: `1px solid ${colors.surfaceBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: colors.primaryText,
              flexShrink: 0,
            }}
          >
            {form.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: colors.primaryText }}>{form.name}</div>
            <Badge variant="cyan">{form.role}</Badge>
          </div>
        </div>

        {mode === 'view' ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {infoRow('Port', form.port)}
              {infoRow('Email', form.email)}
              {infoRow('Phone', form.phone)}
              {infoRow('Shift', form.shift)}
              {infoRow('Timezone', form.timezone)}
            </div>

            {showSavedMessage && (
              <span style={{ fontSize: '0.8125rem', color: colors.success, fontWeight: 600 }}>
                ✅ Profile updated successfully.
              </span>
            )}

            <Button variant="primary" onClick={() => setMode('edit')}>
              Edit Profile
            </Button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <Input
                label="Name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
              <Select
                label="Shift"
                value={form.shift}
                onChange={(e) => updateField('shift', e.target.value)}
                options={SHIFT_OPTIONS}
              />
              <Select
                label="Timezone"
                value={form.timezone}
                onChange={(e) => updateField('timezone', e.target.value)}
                options={TIMEZONE_OPTIONS}
              />
            </div>

            <div style={{ display: 'flex', gap: spacing.sm }}>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => { setForm(profile); setMode('view'); }}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ProfileModal;
