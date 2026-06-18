import React from 'react';
import { Sparkles, Thermometer, RefreshCcw, ChevronRight } from 'lucide-react';
import { demoOutfits, demoWeather, demoItems, demoHistory } from '../../data/mockData.js';
import Metric from '../../components/ui/Metric.jsx';
import ItemTile from '../../components/ui/ItemTile.jsx';
import OutfitHero from './OutfitHero.jsx';
import WeatherCard from './WeatherCard.jsx';

export default function DashboardDesktop({ user }) {
  return (
    <div className="px-10 py-10 max-w-[1400px] mx-auto">
      <header className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm text-ink-muted">Good morning,</p>
          <h1 className="font-display font-bold text-5xl text-ink-primary leading-tight">
            {user?.name?.split(' ')[0] ?? 'Shani'}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-ink-muted">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          <p className="font-display font-semibold text-2xl text-ink-primary">{demoWeather.temp}° · {demoWeather.location}</p>
        </div>
      </header>

      <div className="grid grid-cols-[1fr_360px] gap-6">
        <div className="flex flex-col gap-6 min-w-0">
          <OutfitHero outfit={demoOutfits[0]} />

          <div className="grid grid-cols-3 gap-4">
            <Metric icon={Sparkles} label="Confidence" value="94%" detail="Above this week's average" />
            <Metric icon={Thermometer} label="Thermal fit" value="Cozy" detail="Matched to 24°C" />
            <Metric icon={RefreshCcw} label="Repeat risk" value="Low" detail="No clashes in 14 days" />
          </div>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-2xl text-ink-primary">Recommended for you</h2>
              <button className="text-sm font-medium text-brand-accent flex items-center gap-1">
                Browse closet <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {demoItems.slice(0, 4).map((item) => (
                <ItemTile key={item.id} item={item} />
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <WeatherCard weather={demoWeather} />
          <section className="flex flex-col gap-3">
            <h2 className="font-display font-bold text-lg text-ink-primary">Lately worn</h2>
            <ul className="flex flex-col gap-2">
              {demoHistory.slice(0, 4).map((h) => (
                <li
                  key={h.day}
                  className="bg-white border border-border-subtle rounded-md px-4 py-3 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-primary truncate">{h.outfit}</p>
                    <p className="text-xs text-ink-muted">{h.day} · {h.weather}</p>
                  </div>
                  <span className="font-display font-bold text-base text-brand-accent shrink-0">
                    {h.score}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
