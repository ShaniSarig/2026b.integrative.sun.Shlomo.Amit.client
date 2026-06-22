import React, { useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import OutfitCard from './OutfitCard.jsx';
import Button from '../../components/ui/Button.jsx';
import { useOutfit } from '../../hooks/useOutfit.js';

export default function OutfitsDesktop({ user, currentOutfit, outfitItemsMap, onOutfitChange }) {
  const { outfit, itemsMap, loading, error, generate, confirm, rate, remove } = useOutfit(user);

  // Sync incoming outfit from parent (e.g. generated on dashboard)
  useEffect(() => {
    if (currentOutfit && !outfit) {
      // The hook manages its own state; parent outfit is just for initialisation hint.
      // We don't forcibly set it here — the user can generate fresh or see current.
    }
  }, []);

  // Propagate changes upward
  useEffect(() => {
    onOutfitChange?.(outfit, itemsMap);
  }, [outfit, itemsMap]);

  const handleGenerate = () => generate();

  const handleConfirm = async () => {
    await confirm();
  };

  const handleRate = async (score) => {
    await rate(score);
  };

  const handleDelete = async () => {
    await remove();
  };

  const displayOutfit = outfit ?? currentOutfit;
  const displayMap = outfit ? itemsMap : (outfitItemsMap ?? {});

  return (
    <div className="px-10 py-10 max-w-[1400px] mx-auto flex flex-col gap-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display font-bold text-5xl text-ink-primary leading-tight">
            Today's look
          </h1>
          <p className="text-base text-ink-muted mt-1">
            Your AI-curated outfit for today
          </p>
        </div>
        <Button variant="secondary" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating…' : 'Generate new'}
        </Button>
      </header>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
          {error}
        </p>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20 text-ink-muted gap-2">
          <Sparkles size={18} className="animate-pulse" />
          <span>Finding the perfect outfit…</span>
        </div>
      )}

      {!loading && !displayOutfit && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Sparkles size={40} className="text-brand-accent opacity-50" />
          <p className="text-ink-muted text-lg">No outfit yet. Let the AI pick one for you!</p>
          <Button onClick={handleGenerate}>Generate outfit</Button>
        </div>
      )}

      {!loading && displayOutfit && (
        <div className="max-w-xl">
          <OutfitCard
            outfit={displayOutfit}
            itemsMap={displayMap}
            large
            onConfirm={handleConfirm}
            onRate={handleRate}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}
