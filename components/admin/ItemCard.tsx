import Image from 'next/image';
import { Edit2, Trash2, ExternalLink } from 'lucide-react';

type AccentColor = 'blue' | 'purple' | 'amber' | 'emerald' | 'rose';

const accentMap: Record<AccentColor, { tag: string; link: string; dot: string }> = {
  blue:    { tag: 'bg-blue-500/10 border-blue-500/20 text-blue-300',    link: 'text-blue-400',    dot: 'bg-blue-400' },
  purple:  { tag: 'bg-purple-500/10 border-purple-500/20 text-purple-300', link: 'text-purple-400',  dot: 'bg-purple-400' },
  amber:   { tag: 'bg-amber-500/10 border-amber-500/20 text-amber-300',  link: 'text-amber-400',   dot: 'bg-amber-400' },
  emerald: { tag: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300', link: 'text-emerald-400', dot: 'bg-emerald-400' },
  rose:    { tag: 'bg-rose-500/10 border-rose-500/20 text-rose-300',    link: 'text-rose-400',    dot: 'bg-rose-400' },
};

interface ItemCardProps {
  id: number;
  image?: string | null;
  title: string;
  description?: string | null;
  url?: string | null;
  tags?: string[];
  urlLabel?: string;
  onEdit: () => void;
  onDelete: () => void;
  accentColor?: AccentColor;
}

export default function ItemCard({
  id,
  image,
  title,
  description,
  url,
  tags,
  urlLabel = 'View Link',
  onEdit,
  onDelete,
  accentColor = 'blue',
}: ItemCardProps) {
  const accent = accentMap[accentColor];

  return (
    <div className="bg-[#0e1117] border border-white/10 rounded-2xl flex flex-col hover:border-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 group">
      {/* Image / Placeholder */}
      {image ? (
        <div className="h-44 overflow-hidden rounded-t-2xl bg-[#141923] shrink-0">
          <Image
            src={image}
            alt={title}
            width={600}
            height={176}
            unoptimized
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-28 rounded-t-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border-b border-white/5 flex items-center justify-center shrink-0">
          <span className="text-5xl font-black text-white/[0.06] select-none">{title.charAt(0)}</span>
        </div>
      )}

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Title */}
        <div>
          <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">{title}</h3>
          {description && (
            <p className="text-xs text-gray-400 mt-1.5 line-clamp-3 leading-relaxed">{description}</p>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 5).map((tag, i) => (
              <span key={i} className={`text-[10px] border px-2 py-0.5 rounded-md font-medium ${accent.tag}`}>
                {tag}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="text-[10px] text-gray-600 px-1 flex items-center">+{tags.length - 5}</span>
            )}
          </div>
        )}

        {/* URL */}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-xs font-medium hover:underline underline-offset-2 ${accent.link}`}
            onClick={e => e.stopPropagation()}
          >
            {urlLabel}
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-white/[0.07]">
          <span className="text-[10px] text-gray-600 font-mono">#{id}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={onEdit}
              title="Edit"
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              title="Delete"
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
