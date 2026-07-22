'use client';
import { X, Loader2 } from 'lucide-react';
import React from 'react';

interface FormModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitLabel?: string;
  children: React.ReactNode;
}

export default function FormModal({
  open,
  title,
  onClose,
  onSubmit,
  loading,
  submitLabel = 'Save Changes',
  children,
}: FormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0e1117] border border-white/15 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/10 shrink-0">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
            {children}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 pt-4 border-t border-white/10 flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 text-sm font-medium transition disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-600/20"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
