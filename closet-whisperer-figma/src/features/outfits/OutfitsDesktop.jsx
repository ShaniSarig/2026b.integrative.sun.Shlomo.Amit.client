import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import OutfitCard from './OutfitCard.jsx';
import Button from '../../components/ui/Button.jsx';
import { useOutfit } from '../../hooks/useOutfit.js';

export default function OutfitsDesktop({ user, currentOutfit, outfitItemsMap, onOutfitChange }) {
  const { outfit, itemsMap, loading, error, generate, confirm, rateItem, regenerate } = useOutfit(user);

  useEffect(() => {
    onOutfitChange?.(outfit, itemsMap);
  }, [outfit, itemsMap]);

  const displayOutfit = outfit ?? currentOutfit;
  const displayMap = outfit ? itemsMap : (outfitItemsMap ?? {});

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-end justify-between px-10 pt-10 pb-4 shrink-0">
        <div>
          <h1 className="font-display font-bold text-5xl text-ink-primary leading-tight">
            Today's look
          </h1>
          <p className="text-base text-ink-muted mt-1">
            Your AI-curated outfit for today
          </p>
        </div>
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md mx-10 mb-4 px-4 py-3 shrink-0">
          {error}
        </p>
      )}

      {loading && (
        <div className="flex-1 flex items-center justify-center text-ink-muted gap-2">
          <Sparkles size={18} className="animate-pulse" />
          <span>Finding the perfect outfit…</span>
        </div>
      )}

      {!loading && !displayOutfit && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Sparkles size={40} className="text-brand-accent opacity-50" />
          <p className="text-ink-muted text-lg">No outfit yet. Let the AI pick one for you!</p>
          <Button onClick={() => generate()}>Generate outfit</Button>
        </div>
      )}

      {!loading && displayOutfit && (
        <div className="flex-1 px-10 pb-10 min-h-0">
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
