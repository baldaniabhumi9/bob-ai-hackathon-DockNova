import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Users, Shield, Download } from 'lucide-react';
import { ManagedUser, UserRole, UserStatus, UserStats } from './types';
import { INITIAL_MOCK_USERS } from './mockUsers';
import { UserStatsCards } from './components/UserStatsCards';
import { UserFilterBar } from './components/UserFilterBar';
import { UserTable } from './components/UserTable';
import { UserPagination } from './components/UserPagination';
import { UserModal } from './components/UserModal';
import { DeleteUserModal } from './components/DeleteUserModal';
import { ViewUserModal } from './components/ViewUserModal';

const STORAGE_KEY = 'docknova_admin_users_v1';

export const UserManagementView: React.FC = () => {
  // Load users from localStorage or initial mock users
  const [users, setUsers] = useState<ManagedUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_MOCK_USERS;
  });

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<ManagedUser | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [userToView, setUserToView] = useState<ManagedUser | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  // Derived Stats
  const stats: UserStats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === 'active').length,
      pending: users.filter((u) => u.status === 'pending').length,
    };
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search across name, email, company
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(term);
        const matchesEmail = user.email.toLowerCase().includes(term);
        const matchesCompany = user.company.toLowerCase().includes(term);
        if (!matchesName && !matchesEmail && !matchesCompany) return false;
      }

      // Role Filter
      if (roleFilter !== 'all' && user.role !== roleFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'all' && user.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter, pageSize]);

  // Handlers
  const handleToggleStatus = (userId: string, newStatus: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (user: ManagedUser) => {
    setEditingUser(user);
    setIsAddEditModalOpen(true);
  };

  const handleSaveUser = (userData: Partial<ManagedUser>) => {
    if (userData.id) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) => (u.id === userData.id ? ({ ...u, ...userData } as ManagedUser) : u))
      );
    } else {
      // Create new user
      const newUser: ManagedUser = {
        id: `usr-${Date.now()}`,
        name: userData.name || 'New Operator',
        email: userData.email || '',
        role: userData.role || 'user',
        company: userData.company || 'Carrier Maritime',
        status: userData.status || 'active',
        lastActive: 'Just now',
        createdAt: new Date().toISOString().split('T')[0],
        title: userData.title,
        mfaStatus: 'Authenticator App',
        avatarColor:
          userData.role === 'manager'
            ? 'bg-warning/20 text-warning'
            : userData.role === 'admin'
            ? 'bg-accent/20 text-accent'
            : 'bg-primary/20 text-primary',
      };
      setUsers((prev) => [newUser, ...prev]);
    }
  };

  const handleOpenDelete = (user: ManagedUser) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    setUserToDelete(null);
  };

  const handleOpenView = (user: ManagedUser) => {
    setUserToView(user);
    setIsViewModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Company', 'Status', 'Last Active', 'Created At'];
    const rows = filteredUsers.map((u) => [
      u.id,
      `"${u.name.replace(/"/g, '""')}"`,
      u.email,
      u.role,
      `"${u.company.replace(/"/g, '""')}"`,
      u.status,
      `"${u.lastActive}"`,
      u.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `docknova_users_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isFiltered = searchTerm !== '' || roleFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Add User Action */}
      <div className="p-5 sm:p-6 rounded-2xl bg-surface-1 border border-subtle shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-text-primary tracking-tight">
              User Management
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-accent/15 text-accent border border-accent/30">
              Role-Based Access Control (RBAC)
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">
            Provision carrier credentials, revoke access, and configure permissions across Port Manager and Operator seats.
          </p>
        </div>

        {/* Add User Button */}
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-xs sm:text-sm font-semibold text-text-primary shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add User</span>
        </button>
      </div>

      {/* 2. Top Stats Row (3 Cards) */}
      <UserStatsCards stats={stats} />

      {/* 3. Search & Filter Bar with Export */}
      <UserFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onExportCsv={handleExportCsv}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* 4. Data Table */}
      <UserTable
        users={paginatedUsers}
        onToggleStatus={handleToggleStatus}
        onEditUser={handleOpenEdit}
        onDeleteUser={handleOpenDelete}
        onViewUser={handleOpenView}
        onResetFilters={handleResetFilters}
      />

      {/* 5. Centered Pagination Controls */}
      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredUsers.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Modals */}
      <UserModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveUser}
        initialUser={editingUser}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        user={userToDelete}
      />

      <ViewUserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={userToView}
      />
    </div>
  );
};

export default UserManagementView;
