import React from 'react';
import { colors, radius, spacing } from '@/design-system';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    fontSize: '0.875rem',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: colors.background,
    color: colors.secondaryText,
    fontWeight: 600,
    borderBottom: `1px solid ${colors.surfaceBorder}`,
  };

  const tdStyle: React.CSSProperties = {
    padding: `${spacing.sm} ${spacing.md}`,
    borderBottom: `1px solid ${colors.surfaceBorder}`,
    color: colors.primaryText,
  };

  return (
    <div style={{ overflowX: 'auto', borderRadius: radius.md, border: `1px solid ${colors.surfaceBorder}` }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={thStyle}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ ...tdStyle, textAlign: 'center', color: colors.mutedText, padding: spacing.lg }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => (
                  <td key={col.key} style={tdStyle}>
                    {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
