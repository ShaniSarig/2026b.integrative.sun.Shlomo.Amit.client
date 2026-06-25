import React from 'react';
import { Shirt } from 'lucide-react';
import { useHistory } from '../../hooks/useHistory.js';
import HistoryCard from './HistoryCard.jsx';

export default function HistoryMobile({ user }) {
  const { history, itemsMap, loading, error, rate } = useHistory(user);

  return (
    <div className="px-5 pb-5 flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-3xl text-ink-primary">Wear history</h1>
        <p className="text-sm text-ink-muted">Every outfit you've confirmed, with ratings.</p>
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
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-ink-muted">
          <Shirt size={32} className="opacity-30" />
          <p className="text-sm">No wear history yet. Confirm an outfit to start tracking!</p>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="flex flex-col gap-3">
          {history.map((h) => (
            <HistoryCard
              key={h.id?.objectId ?? h.dateCreated}
              entry={h}
              itemsMap={itemsMap}
              onRate={rate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
