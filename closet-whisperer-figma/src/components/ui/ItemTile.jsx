import React from 'react';
import { Trash2, RefreshCcw } from 'lucide-react';
import Badge from './Badge.jsx';

export default function ItemTile({ item, compact = false, onDelete, onToggleStatus }) {
  return (
    <article className="bg-white border border-border-subtle rounded-lg overflow-hidden flex flex-col shadow-card relative group">
      <div className={`bg-cream-100 relative ${compact ? 'aspect-[4/5]' : 'aspect-[4/5]'}`}>
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this item?')) {
                  onDelete();
                }
              }}
              className="p-1.5 bg-white hover:bg-cream-50 text-red-500 rounded-full shadow border border-border-subtle transition-opacity md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 z-10"
              aria-label="Delete item"
            >
              <Trash2 size={16} />
            </button>
          )}
          {onToggleStatus && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(item.id, item.status);
              }}
              className="p-1.5 bg-white hover:bg-cream-50 text-ink-muted hover:text-ink-primary rounded-full shadow border border-border-subtle transition-opacity md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 z-10"
              aria-label={item.status === 'Clean' ? 'Mark as dirty' : 'Mark as clean'}
              title={item.status === 'Clean' ? 'Mark as dirty' : 'Mark as clean'}
            >
              <RefreshCcw size={16} />
            </button>
          )}
        </div>
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
