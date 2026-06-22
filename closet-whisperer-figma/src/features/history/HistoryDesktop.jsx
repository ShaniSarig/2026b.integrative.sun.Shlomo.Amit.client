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

function ratingLabel(rating) {
  if (rating === 'LIKE') return 'Liked';
  if (rating === 'DISLIKE') return 'Disliked';
  return '—';
}

export default function HistoryDesktop({ user }) {
  const { history, loading, error } = useHistory(user);

  return (
    <div className="px-10 py-10 max-w-[1200px] mx-auto flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-5xl text-ink-primary leading-tight">
          Wear history
        </h1>
        <p className="text-base text-ink-muted">
          Outfit performance, by day. Repeat scores help avoid duplicates.
        </p>
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
        <p className="text-center py-10 text-ink-muted">No wear history yet. Start by generating and confirming an outfit!</p>
      )}

      {!loading && history.length > 0 && (
        <div className="bg-white border border-border-subtle rounded-lg overflow-hidden shadow-card">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-ink-muted uppercase text-xs tracking-wide">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Day</th>
                <th className="text-left px-6 py-3 font-medium">Outfit</th>
                <th className="text-left px-6 py-3 font-medium">Rating</th>
                <th className="text-right px-6 py-3 font-medium">Confirmed</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id?.id ?? h.dateCreated} className="border-t border-border-subtle">
                  <td className="px-6 py-4 font-medium text-ink-primary">{formatDay(h.dateCreated)}</td>
                  <td className="px-6 py-4 text-ink-secondary">{formatOutfit(h)}</td>
                  <td className="px-6 py-4 text-ink-muted">
                    {h.userRating === 'LIKE' && <Badge tone="good">Liked</Badge>}
                    {h.userRating === 'DISLIKE' && <Badge tone="warn">Disliked</Badge>}
                    {!h.userRating && <span>—</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {h.confirmed ? <Badge tone="good">Yes</Badge> : <span className="text-ink-muted">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
