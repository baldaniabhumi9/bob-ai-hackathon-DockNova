import React from 'react';

interface PasswordStrengthBarProps {
  password?: string;
}

export const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ password = '' }) => {
  const calculateStrength = (pwd: string): { score: number; label: string; colorClass: string } => {
    if (!pwd) return { score: 0, label: '', colorClass: 'bg-surface-3' };

    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) || pwd.length >= 12) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', colorClass: 'bg-danger' };
      case 2:
        return { score: 2, label: 'Fair', colorClass: 'bg-warning' };
      case 3:
        return { score: 3, label: 'Good', colorClass: 'bg-primary' };
      case 4:
        return { score: 4, label: 'Strong', colorClass: 'bg-success' };
      default:
        return { score: 1, label: 'Weak', colorClass: 'bg-danger' };
    }
  };

  const { score, label, colorClass } = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5" aria-live="polite">
      <div className="flex justify-between items-center text-xs">
        <span className="text-text-muted">Password Strength</span>
        <span
          className={`font-medium ${
            score === 1
              ? 'text-danger'
              : score === 2
              ? 'text-warning'
              : score === 3
              ? 'text-primary'
              : 'text-success'
          }`}
        >
          {label}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[0, 1, 2, 3].map((segmentIndex) => {
          const isFilled = segmentIndex < score;
          return (
            <div
              key={segmentIndex}
              className={`h-full rounded-full transition-all duration-300 ${
                isFilled ? colorClass : 'bg-surface-3'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
