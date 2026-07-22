import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id: number }> {
  columns: Column<T>[];
  rows: T[];
  onEdit?: (row: T) => void;
  onDelete?: (id: number) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export default function DataTable<T extends { id: number }>({
  columns,
  rows,
  onEdit,
  onDelete,
  emptyMessage = 'No records found.',
  loading,
}: DataTableProps<T>) {
  const hasActions = !!(onEdit || onDelete);
  const colSpan = columns.length + (hasActions ? 1 : 0);

  return (
    <div className="bg-[#0e1117] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-xs text-gray-500 uppercase tracking-wider border-b border-white/10">
            <tr>
              {columns.map(col => (
                <th key={col.key} className={`px-5 py-3.5 font-semibold whitespace-nowrap ${col.className ?? ''}`}>
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={colSpan} className="px-5 py-14 text-center text-gray-500 text-sm">
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-5 py-14 text-center text-gray-500 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map(row => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                  {columns.map(col => {
                    const value = (row as Record<string, unknown>)[col.key];
                    return (
                      <td key={col.key} className={`px-5 py-4 text-gray-300 ${col.className ?? ''}`}>
                        {col.render ? col.render(value, row) : String(value ?? '—')}
                      </td>
                    );
                  })}
                  {hasActions && (
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
