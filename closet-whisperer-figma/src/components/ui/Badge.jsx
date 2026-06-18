import React from 'react';

const TONES = {
  neutral: 'bg-cream-100 text-ink-secondary border border-border-subtle',
  taupe: 'bg-brand-primary/30 text-taupe-700 border border-brand-primary',
  good: 'bg-[#E8EFE3] text-[#3F5A35] border border-[#C8D7BD]',
  warn: 'bg-[#F5EBD7] text-[#8A6A2C] border border-[#E6D2A8]',
  bad: 'bg-[#F2DCD6] text-[#7E342A] border border-[#E2B7AC]',
};

export default function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
