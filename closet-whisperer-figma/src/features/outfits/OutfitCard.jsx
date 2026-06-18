import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import Badge from '../../components/ui/Badge.jsx';

export default function OutfitCard({ outfit, large = false }) {
  return (
    <article className="bg-white border border-border-subtle rounded-lg overflow-hidden shadow-card flex flex-col">
      <div className={`bg-cream-100 grid grid-cols-3 gap-1 p-3 ${large ? 'aspect-[4/3]' : 'aspect-[5/4]'}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-cream-200 rounded-sm" />
        ))}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-lg text-ink-primary leading-tight">
            {outfit.title}
          </h3>
          <button className="text-ink-muted hover:text-brand-accent" aria-label="Save outfit">
            <Heart size={18} />
          </button>
        </div>
        <p className="text-sm text-ink-muted">{outfit.items}</p>
        <div className="flex items-center justify-between mt-1">
          <Badge tone="good"><Sparkles size={12} /> {outfit.score}</Badge>
          <span className="text-xs text-ink-muted">{outfit.reason}</span>
        </div>
      </div>
    </article>
  );
}
