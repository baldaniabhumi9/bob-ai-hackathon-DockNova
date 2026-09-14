import React from 'react';
import { Users, UserCheck, Clock, ShieldCheck } from 'lucide-react';
import { UserStats } from '../types';

interface UserStatsCardsProps {
  stats: UserStats;
}

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* 1. Total Users */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-1 border border-subtle flex items-center justify-between shadow-sm">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-wider text-text-muted">
            Total Users
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-text-primary mt-1">
            {stats.total}
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Registered platform seats
          </p>
        </div>
        <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
          <Users className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Active Now */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-1 border border-subtle flex items-center justify-between shadow-sm">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-wider text-text-muted">
            Active Now
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-success mt-1">
            {stats.active}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-success mt-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-success animate-ping" />
            <span>Authorized & Online</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-success/10 text-success shrink-0">
          <UserCheck className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Pending Approval */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-1 border border-subtle flex items-center justify-between shadow-sm">
        <div>
          <span className="text-[11px] uppercase font-semibold tracking-wider text-text-muted">
            Pending Approval
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-warning mt-1">
            {stats.pending}
          </div>
          <p className="text-xs text-warning mt-1">
            Awaiting credential audit
          </p>
        </div>
        <div className="p-3 rounded-xl bg-warning/10 text-warning shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
