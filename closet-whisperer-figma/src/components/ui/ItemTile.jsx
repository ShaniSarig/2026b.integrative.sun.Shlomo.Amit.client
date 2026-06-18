import React from 'react';
import Badge from './Badge.jsx';

export default function ItemTile({ item, compact = false }) {
  return (
    <article className="bg-white border border-border-subtle rounded-lg overflow-hidden flex flex-col shadow-card">
      <div className={`bg-cream-100 ${compact ? 'aspect-[4/5]' : 'aspect-[4/5]'}`}>
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <p className="font-medium text-sm text-ink-primary truncate">{item.name}</p>
        <p className="text-xs text-ink-muted">{item.category} · {item.color}</p>
        {!compact && (
          <div className="flex gap-1.5 mt-1 flex-wrap">
            <Badge tone="neutral">{item.style}</Badge>
            <Badge tone={item.status === 'Clean' ? 'good' : 'warn'}>
              {item.status}
            </Badge>
          </div>
        )}
      </div>
    </article>
  );
}
