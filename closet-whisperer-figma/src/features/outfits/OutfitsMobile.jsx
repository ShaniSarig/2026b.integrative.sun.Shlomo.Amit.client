import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import OutfitCard from './OutfitCard.jsx';
import Button from '../../components/ui/Button.jsx';
import { useOutfit } from '../../hooks/useOutfit.js';

export default function OutfitsMobile({ user, currentOutfit, outfitItemsMap, onOutfitChange }) {
  const { outfit, itemsMap, loading, error, generate, confirm, rate, remove } = useOutfit(user);

  // Propagate changes upward
  useEffect(() => {
    onOutfitChange?.(outfit, itemsMap);
  }, [outfit, itemsMap]);

  const displayOutfit = outfit ?? currentOutfit;
  const displayMap = outfit ? itemsMap : (outfitItemsMap ?? {});

  return (
    <div className="px-5 flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-3xl text-ink-primary">Outfits</h1>
        <p className="text-sm text-ink-muted">Your AI-curated look for today</p>
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16 text-ink-muted gap-2">
          <Sparkles size={16} className="animate-pulse" />
          <span>Finding your outfit…</span>
        </div>
      )}

      {!loading && !displayOutfit && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Sparkles size={32} className="text-brand-accent opacity-50" />
          <p className="text-ink-muted">No outfit yet.</p>
          <Button full onClick={() => generate()}>Generate outfit</Button>
        </div>
      )}

      {!loading && displayOutfit && (
        <OutfitCard
          outfit={displayOutfit}
          itemsMap={displayMap}
          onConfirm={confirm}
          onRate={rate}
          onDelete={remove}
        />
      )}

      <Button variant="secondary" full onClick={() => generate()} disabled={loading}>
        {loading ? 'Generating…' : 'Generate new'}
      </Button>
    </div>
  );
}
