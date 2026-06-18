import React from 'react';
import { Sparkles } from 'lucide-react';
import Badge from '../../components/ui/Badge.jsx';

export default function OutfitHero({ outfit }) {
  return (
    <div className="rounded-lg bg-taupe-700 text-ink-inverse p-6 flex flex-col gap-4 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-cream-200 opacity-80">
            Today's outfit
          </p>
          <h2 className="font-display font-bold text-3xl leading-tight mt-1">
            {outfit?.title ?? 'Morning commute'}
          </h2>
          <p className="text-sm text-cream-200 mt-1">
            {outfit?.items ?? 'Cream shirt, navy chinos, white sneakers'}
          </p>
        </div>
        <Badge tone="good" className="bg-cream-100 text-taupe-700 border-none">
          <Sparkles size={12} /> {outfit?.score ?? '94%'}
        </Badge>
      </div>
      <p className="text-sm text-cream-200 opacity-90">
        {outfit?.reason ?? 'Best for 24°C, clear sky with light wind.'}
      </p>
    </div>
  );
}
