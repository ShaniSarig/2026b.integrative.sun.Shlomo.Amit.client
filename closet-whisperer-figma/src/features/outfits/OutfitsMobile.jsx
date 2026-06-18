import React from 'react';
import { demoOutfits } from '../../data/mockData.js';
import OutfitCard from './OutfitCard.jsx';
import Button from '../../components/ui/Button.jsx';

export default function OutfitsMobile() {
  return (
    <div className="px-5 flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-3xl text-ink-primary">Outfits</h1>
        <p className="text-sm text-ink-muted">3 looks for today's weather</p>
      </header>
      <div className="flex flex-col gap-4">
        {demoOutfits.map((o) => (
          <OutfitCard key={o.title} outfit={o} />
        ))}
      </div>
      <Button variant="secondary" full>Regenerate suggestions</Button>
    </div>
  );
}
