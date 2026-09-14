import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Eye, Users, Shield, Anchor } from 'lucide-react';
import { ManagedUser, UserRole, UserStatus } from '../types';
import { StatusToggleSwitch } from './StatusToggleSwitch';

interface UserTableProps {
  users: ManagedUser[];
  onToggleStatus: (userId: string, newStatus: UserStatus) => void;
  onEditUser: (user: ManagedUser) => void;
  onDeleteUser: (user: ManagedUser) => void;
  onViewUser: (user: ManagedUser) => void;
  onResetFilters?: () => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onToggleStatus,
  onEditUser,
  onDeleteUser,
  onViewUser,
  onResetFilters,
}) => {
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'manager':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-warning/10 text-warning border border-warning/30">
            <Anchor className="w-3 h-3" />
            <span>Port Manager</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-secondary/15 text-secondary border border-secondary/30">
            <Shield className="w-3 h-3" />
            <span>System Admin</span>
          </span>
        );
      case 'user':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-primary/10 text-primary border border-primary/30">
            <span>Vessel Operator</span>
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (users.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-surface-1 border border-subtle flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-subtle flex items-center justify-center text-text-muted">
          <Users className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h4 className="font-heading font-bold text-base text-text-primary">
            No users found matching your filters
          </h4>
          <p className="text-xs text-text-secondary max-w-sm">
            Try adjusting your search query, role filter, or status criteria.
          </p>
        </div>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-surface-2 hover:bg-surface-3 border border-subtle text-xs font-semibold text-text-primary transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-surface-1 border border-subtle shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-surface-2/70 border-b border-subtle text-text-muted font-mono uppercase text-[11px]">
              <th className="py-3.5 px-4 font-semibold sticky left-0 bg-surface-2/90 backdrop-blur-sm z-10">
                User
              </th>
              <th className="py-3.5 px-4 font-semibold">Email</th>
              <th className="py-3.5 px-4 font-semibold">Role</th>
              <th className="py-3.5 px-4 font-semibold">Company</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold">Last Active</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-subtle">
            <AnimatePresence mode="popLayout" initial={false}>
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-surface-2/40 transition-colors group"
                >
                  {/* Name + Initials Avatar */}
                  <td className="py-3.5 px-4 sticky left-0 bg-surface-1 group-hover:bg-surface-2/40 transition-colors z-10">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full border border-subtle flex items-center justify-center font-bold text-xs shrink-0 ${
                          user.avatarColor || 'bg-surface-2 text-primary'
                        }`}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading font-semibold text-text-primary text-xs sm:text-[13px] truncate">
                          {user.name}
                        </div>
                        {user.title && (
                          <div className="text-[10px] text-text-muted truncate max-w-[180px]">
                            {user.title}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 font-mono text-xs text-text-secondary">
                    {user.email}
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>

                  {/* Company */}
                  <td className="py-3.5 px-4 font-medium text-text-primary text-xs truncate max-w-[180px]">
                    {user.company}
                  </td>

                  {/* Status Toggle Switch */}
                  <td className="py-3.5 px-4">
                    <StatusToggleSwitch
                      status={user.status}
                      onToggle={(newStatus) => onToggleStatus(user.id, newStatus)}
                    />
                  </td>

                  {/* Last Active */}
                  <td className="py-3.5 px-4 font-mono text-xs text-text-muted">
                    {user.lastActive}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onViewUser(user)}
                        title="View User Credentials"
                        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditUser(user)}
                        title="Edit User"
                        className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteUser(user)}
                        title="Delete User"
                        className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
