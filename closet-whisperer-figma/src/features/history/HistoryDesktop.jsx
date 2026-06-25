import React from 'react';
import { Shirt } from 'lucide-react';
import { useHistory } from '../../hooks/useHistory.js';
import HistoryCard from './HistoryCard.jsx';

export default function HistoryDesktop({ user }) {
  const { history, itemsMap, loading, error, rate } = useHistory(user);

  return (
    <div className="px-10 py-10 max-w-[1200px] mx-auto flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-5xl text-ink-primary leading-tight">
          Wear history
        </h1>
        <p className="text-base text-ink-muted">
          Every outfit you've confirmed, with weather and your ratings.
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
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-ink-muted">
          <Shirt size={40} className="opacity-30" />
          <p>No wear history yet. Confirm an outfit to start tracking!</p>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
