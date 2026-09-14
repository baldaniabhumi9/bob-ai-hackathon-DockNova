import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuditLogEntry } from './types';
import { INITIAL_MOCK_AUDIT_LOGS } from './mockLogs';
import { AuditHeader } from './components/AuditHeader';
import { AuditFilterBar } from './components/AuditFilterBar';
import { AuditTable } from './components/AuditTable';
import { AuditTimeline } from './components/AuditTimeline';
import { AuditPagination } from './components/AuditPagination';
import { AuditDetailsModal } from './components/AuditDetailsModal';

export const AuditLogsView: React.FC = () => {
  const [logs] = useState<AuditLogEntry[]>(INITIAL_MOCK_AUDIT_LOGS);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modal State
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  // Unique list of user names for filter dropdown
  const uniqueUsers = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.user.name));
    return Array.from(set);
  }, [logs]);

  // Filtered Logs Calculation
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 1. Search term (user name, email, action, entity, details)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = log.user.name.toLowerCase().includes(term);
        const matchesEmail = log.user.email.toLowerCase().includes(term);
        const matchesAction = log.action.toLowerCase().includes(term);
        const matchesEntity = log.entity.toLowerCase().includes(term);
        const matchesDetails = log.details.toLowerCase().includes(term);
        if (!matchesName && !matchesEmail && !matchesAction && !matchesEntity && !matchesDetails) {
          return false;
        }
      }

      // 2. Action Filter
      if (actionFilter !== 'all' && log.action !== actionFilter) {
        return false;
      }

      // 3. User Filter
      if (userFilter !== 'all' && log.user.name !== userFilter) {
        return false;
      }

      // 4. Severity Filter
      if (severityFilter !== 'all' && log.severity !== severityFilter) {
        return false;
      }

      // 5. Date Range Filter
      if (startDate) {
        const logDate = log.isoDate.split('T')[0];
        if (logDate < startDate) return false;
      }
      if (endDate) {
        const logDate = log.isoDate.split('T')[0];
        if (logDate > endDate) return false;
      }

      return true;
    });
  }, [logs, searchTerm, actionFilter, userFilter, severityFilter, startDate, endDate]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, actionFilter, userFilter, severityFilter, startDate, endDate, pageSize]);

  // Paginated Slice
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  const isFiltered =
    searchTerm !== '' ||
    actionFilter !== 'all' ||
    userFilter !== 'all' ||
    severityFilter !== 'all' ||
    startDate !== '' ||
    endDate !== '';

  const handleResetFilters = () => {
    setSearchTerm('');
    setActionFilter('all');
    setUserFilter('all');
    setSeverityFilter('all');
    setStartDate('');
    setEndDate('');
  };

  // CSV Export Handler
  const handleExportCsv = () => {
    const headers = [
      'Log ID',
      'Timestamp',
      'User Name',
      'User Email',
      'Action',
      'Entity',
      'Severity',
      'IP Address',
      'Details',
      'Hash Ledger',
    ];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.user.name.replace(/"/g, '""')}"`,
      l.user.email,
      l.action,
      `"${l.entity.replace(/"/g, '""')}"`,
      l.severity,
      l.ipAddress,
      `"${l.details.replace(/"/g, '""')}"`,
      l.hash || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `docknova_audit_logs_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Title, Date Range Picker, Export */}
      <AuditHeader
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onExportCsv={handleExportCsv}
        totalLogsCount={filteredLogs.length}
      />

      {/* 2. Filters & View Mode Switcher */}
      <AuditFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        actionFilter={actionFilter}
        onActionFilterChange={setActionFilter}
        userFilter={userFilter}
        onUserFilterChange={setUserFilter}
        severityFilter={severityFilter}
        onSeverityFilterChange={setSeverityFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onResetFilters={handleResetFilters}
        isFiltered={isFiltered}
        uniqueUsers={uniqueUsers}
      />

      {/* 3. Main Content: Animated Table or Timeline */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <motion.div
            key="table-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AuditTable
              logs={paginatedLogs}
              onSelectLog={(log) => setSelectedLog(log)}
              onResetFilters={handleResetFilters}
            />
          </motion.div>
        ) : (
          <motion.div
            key="timeline-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AuditTimeline
              logs={paginatedLogs}
              onSelectLog={(log) => setSelectedLog(log)}
              onResetFilters={handleResetFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Pagination Controls */}
      <AuditPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredLogs.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* 5. Log Details Modal */}
      <AuditDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
};

export default AuditLogsView;
