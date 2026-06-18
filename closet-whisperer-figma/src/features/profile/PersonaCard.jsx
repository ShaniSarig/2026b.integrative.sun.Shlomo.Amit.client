import React from 'react';
import { Camera } from 'lucide-react';

export default function PersonaCard({ user }) {
  return (
    <div className="bg-white border border-border-subtle rounded-lg p-6 flex flex-col items-center gap-4 shadow-card">
      <div className="size-32 rounded-full bg-cream-100 flex items-center justify-center text-brand-accent">
        <Camera size={32} strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <h3 className="font-display font-bold text-xl text-ink-primary">
          {user?.name ?? 'Your visual persona'}
        </h3>
        <p className="text-sm text-ink-muted mt-1">
          Upload a photo so we can preview outfits on your body shape.
        </p>
      </div>
      <button className="px-5 py-2 rounded-md border border-border-strong text-sm font-medium text-ink-primary">
        Upload persona photo
      </button>
    </div>
  );
}
