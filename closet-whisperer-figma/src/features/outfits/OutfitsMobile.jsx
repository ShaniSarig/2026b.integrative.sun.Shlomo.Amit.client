import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import OutfitCard from './OutfitCard.jsx';
import Button from '../../components/ui/Button.jsx';
import { useOutfit } from '../../hooks/useOutfit.js';

export default function OutfitsMobile({ user, currentOutfit, outfitItemsMap, onOutfitChange }) {
  const { outfit, itemsMap, loading, error, generate, confirm, rateItem, regenerate } = useOutfit(user);

  useEffect(() => {
    onOutfitChange?.(outfit, itemsMap);
  }, [outfit, itemsMap]);

  const displayOutfit = outfit ?? currentOutfit;
  const displayMap = outfit ? itemsMap : (outfitItemsMap ?? {});

  return (
    <div className="flex-1 flex flex-col px-5 pb-4 min-h-0">
      <header className="py-3 shrink-0">
        <h1 className="font-display font-bold text-3xl text-ink-primary">Outfits</h1>
        <p className="text-sm text-ink-muted">Your AI-curated look for today</p>
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-3 shrink-0">
          {error}
        </p>
      )}

      {loading && (
        <div className="flex-1 flex items-center justify-center text-ink-muted gap-2">
          <Sparkles size={16} className="animate-pulse" />
          <span>Finding your outfit…</span>
        </div>
      )}

      {!loading && !displayOutfit && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Sparkles size={32} className="text-brand-accent opacity-50" />
          <p className="text-ink-muted">No outfit yet.</p>
          <Button full onClick={() => generate()}>Generate outfit</Button>
        </div>
      )}

      {!loading && displayOutfit && (
        <div className="flex-1 min-h-0">
          <OutfitCard
            outfit={displayOutfit}
            itemsMap={displayMap}
            large
            onConfirm={() => confirm(displayOutfit?.id?.id)}
            onRegenerate={() => regenerate(displayOutfit?.id?.id)}
            onRateItem={(itemId, score) => rateItem(displayOutfit?.id?.id, itemId, score)}
          />
        </div>
      )}
    </div>
  );
}
