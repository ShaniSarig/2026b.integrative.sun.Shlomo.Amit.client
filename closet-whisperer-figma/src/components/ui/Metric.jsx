import React from 'react';
import Card from './Card.jsx';

export default function Metric({ icon: Icon, label, value, detail, accent = 'taupe' }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="flex items-center justify-center size-9 rounded-md bg-cream-100 text-brand-accent">
            <Icon size={18} strokeWidth={1.75} />
          </span>
        )}
        <span className="text-sm text-ink-muted">{label}</span>
      </div>
      <div className="font-display text-3xl font-bold text-ink-primary leading-tight">
        {value}
      </div>
      {detail && <p className="text-sm text-ink-muted">{detail}</p>}
    </Card>
  );
}
