import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export const inputClass =
  'w-full bg-[#0a0d13] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition';

export const textareaClass =
  'w-full bg-[#0a0d13] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition resize-none';

export default function FormField({ label, required, hint, children }: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
        {required && (
          <span className="text-red-400 ml-1 normal-case font-normal text-[10px]">required</span>
        )}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed">{hint}</p>}
    </div>
  );
}
