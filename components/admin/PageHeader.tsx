import { LucideIcon, Plus, RefreshCw } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onAdd?: () => void;
  addLabel?: string;
  onRefresh?: () => void;
  loading?: boolean;
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  onAdd,
  addLabel = 'Add New',
  onRefresh,
  loading,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">{title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-blue-600/25 transition"
          >
            <Plus className="w-4 h-4" />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
