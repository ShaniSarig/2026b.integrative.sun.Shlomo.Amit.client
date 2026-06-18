import React from 'react';
import { demoOutfits, demoWeather } from '../../data/mockData.js';
import OutfitCard from './OutfitCard.jsx';
import Button from '../../components/ui/Button.jsx';

export default function OutfitsDesktop() {
  return (
    <div className="px-10 py-10 max-w-[1400px] mx-auto flex flex-col gap-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display font-bold text-5xl text-ink-primary leading-tight">
            Today's looks
          </h1>
          <p className="text-base text-ink-muted mt-1">
            Curated for {demoWeather.temp}° · {demoWeather.condition}
          </p>
        </div>
        <Button variant="secondary">Regenerate suggestions</Button>
      </header>
      <div className="grid grid-cols-3 gap-6">
        {demoOutfits.map((o, idx) => (
          <OutfitCard key={o.title} outfit={o} large={idx === 0} />
        ))}
      </div>
    </div>
  );
}
