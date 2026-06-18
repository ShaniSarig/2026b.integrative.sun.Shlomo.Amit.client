import React from 'react';

const TABS = [
  { id: 'personal', label: 'Personal info' },
  { id: 'style', label: 'Style & body' },
];

export default function ProfileTabs({ active, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-[#DDD3C4] rounded-xl w-full">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
            active === t.id
              ? 'bg-white text-ink-primary shadow-card'
              : 'text-ink-muted hover:text-ink-primary'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
