export type AuditActionType = 'Create' | 'Update' | 'Delete' | 'Login' | 'Reroute';

export type AuditSeverity = 'Info' | 'Warning' | 'Critical';

export interface AuditUser {
  name: string;
  email: string;
  role: string;
  avatar: string;
  avatarBg?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string; // e.g. "2026-09-14 07:28:10 UTC"
  isoDate: string; // ISO string for filtering e.g. "2026-09-14T07:28:10Z"
  relativeTime: string; // e.g. "15 minutes ago"
  user: AuditUser;
  action: AuditActionType;
  entity: string;
  details: string;
  fullDetails?: string;
  severity: AuditSeverity;
  ipAddress: string;
  hash?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditFilterState {
  searchTerm: string;
  actionFilter: string; // 'all' or AuditActionType
  userFilter: string; // 'all' or user email/name
  severityFilter: string; // 'all' or AuditSeverity
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  viewMode: 'table' | 'timeline';
}
