import React from 'react';

export default function PreferenceRow({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-sans font-medium text-sm leading-[18px] text-ink-primary">{label}</span>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 rounded-md text-sm transition-colors border ${
              value === opt.value
                ? 'bg-brand-primary text-ink-inverse border-brand-primary'
                : 'bg-white text-ink-secondary border-border-subtle hover:border-brand-primary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
