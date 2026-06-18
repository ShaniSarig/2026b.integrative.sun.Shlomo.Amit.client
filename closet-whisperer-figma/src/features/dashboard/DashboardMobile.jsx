import React from 'react';
import { Sparkles, Thermometer, RefreshCcw, ChevronRight } from 'lucide-react';
import { demoOutfits, demoWeather, demoItems, demoHistory } from '../../data/mockData.js';
import Metric from '../../components/ui/Metric.jsx';
import ItemTile from '../../components/ui/ItemTile.jsx';
import OutfitHero from './OutfitHero.jsx';
import WeatherCard from './WeatherCard.jsx';

export default function DashboardMobile({ user }) {
  return (
    <div className="px-5 flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-ink-muted">Good morning,</p>
        <h1 className="font-display font-bold text-3xl text-ink-primary">
          {user?.name?.split(' ')[0] ?? 'Shani'}
        </h1>
      </header>

      <OutfitHero outfit={demoOutfits[0]} />

      <div className="grid grid-cols-3 gap-3">
        <Metric icon={Sparkles} label="Confidence" value="94%" />
        <Metric icon={Thermometer} label="Thermal" value="Cozy" />
        <Metric icon={RefreshCcw} label="Repeat risk" value="Low" />
      </div>

      <WeatherCard weather={demoWeather} />

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-ink-primary">Recommended</h2>
          <button className="text-sm text-brand-accent flex items-center gap-1">
            See all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {demoItems.slice(0, 4).map((item) => (
            <ItemTile key={item.id} item={item} compact />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display font-bold text-xl text-ink-primary">Lately worn</h2>
        <ul className="flex flex-col gap-2">
          {demoHistory.slice(0, 3).map((h) => (
            <li
              key={h.day}
              className="bg-white border border-border-subtle rounded-md px-4 py-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-ink-primary">{h.outfit}</p>
                <p className="text-xs text-ink-muted">{h.day} · {h.weather}</p>
              </div>
              <span className="font-display font-bold text-base text-brand-accent">
                {h.score}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
