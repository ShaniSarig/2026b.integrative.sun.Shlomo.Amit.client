import React from 'react';
import Badge from '../../components/ui/Badge.jsx';
import { useHistory } from '../../hooks/useHistory.js';

function formatDay(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatOutfit(h) {
  if (!h.items || h.items.length === 0) return '—';
  return h.items.map((it) => it.role || 'Item').join(', ');
}

export default function HistoryMobile({ user }) {
  const { history, loading, error } = useHistory(user);

  return (
    <div className="px-5 flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-3xl text-ink-primary">Wear history</h1>
        <p className="text-sm text-ink-muted">Track which looks you've worn lately.</p>
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      {loading && (
        <p className="text-center py-10 text-ink-muted">Loading wear history…</p>
      )}

      {!loading && history.length === 0 && !error && (
        <p className="text-center py-10 text-ink-muted">No wear history yet.</p>
      )}

      <ul className="flex flex-col gap-3">
        {!loading && history.map((h) => (
          <li
            key={h.id?.id ?? h.dateCreated}
            className="bg-white border border-border-subtle rounded-md p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {formatDay(h.dateCreated)}
              </span>
              <div className="flex gap-1">
                {h.userRating === 'LIKE' && <Badge tone="good">Liked</Badge>}
                {h.userRating === 'DISLIKE' && <Badge tone="warn">Disliked</Badge>}
                {h.confirmed && <Badge tone="good">✓</Badge>}
              </div>
            </div>
            <p className="font-display font-semibold text-base text-ink-primary">{formatOutfit(h)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
