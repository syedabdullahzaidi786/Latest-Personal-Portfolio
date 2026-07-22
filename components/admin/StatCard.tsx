import { LucideIcon } from 'lucide-react';

type ColorVariant = 'blue' | 'purple' | 'amber' | 'emerald' | 'rose';

const colorMap: Record<ColorVariant, string> = {
  blue:    'from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400',
  purple:  'from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400',
  amber:   'from-amber-500/20 to-amber-600/5 border-amber-500/30 text-amber-400',
  emerald: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400',
  rose:    'from-rose-500/20 to-rose-600/5 border-rose-500/30 text-rose-400',
};

interface StatCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  color: ColorVariant;
  href?: string;
}

export default function StatCard({ label, count, icon: Icon, color, href }: StatCardProps) {
  const classes = colorMap[color];

  const inner = (
    <div
      className={`relative bg-gradient-to-br ${classes} border rounded-2xl p-5 flex items-center justify-between shadow-lg hover:scale-[1.02] transition-all duration-200 select-none`}
    >
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">{label}</p>
        <p className="text-3xl font-bold text-white tabular-nums">{count}</p>
      </div>
      <Icon className="w-7 h-7 opacity-70" />
    </div>
  );

  if (href) return <a href={href} className="block">{inner}</a>;
  return inner;
}
