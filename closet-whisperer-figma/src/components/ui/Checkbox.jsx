import React from 'react';
import { Check } from 'lucide-react';

export default function Checkbox({ checked, onChange, label, className = '' }) {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer select-none ${className}`}>
      <span
        className={`flex items-center justify-center size-[22px] rounded-sm border-[1.5px] ${
          checked
            ? 'bg-brand-primary border-brand-primary'
            : 'bg-white border-border-strong'
        }`}
        onClick={() => onChange?.(!checked)}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
      >
        {checked && <Check size={14} strokeWidth={3} className="text-ink-inverse" />}
      </span>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="sr-only"
      />
      {label && <span className="text-sm text-ink-primary">{label}</span>}
    </label>
  );
}
