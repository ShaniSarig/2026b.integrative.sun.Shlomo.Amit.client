import React from 'react';
import { demoHistory } from '../../data/mockData.js';
import Badge from '../../components/ui/Badge.jsx';

export default function HistoryDesktop() {
  return (
    <div className="px-10 py-10 max-w-[1200px] mx-auto flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-5xl text-ink-primary leading-tight">
          Wear history
        </h1>
        <p className="text-base text-ink-muted">
          Outfit performance, by day. Repeat scores help avoid duplicates.
        </p>
      </header>

      <div className="bg-white border border-border-subtle rounded-lg overflow-hidden shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-ink-muted uppercase text-xs tracking-wide">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Day</th>
              <th className="text-left px-6 py-3 font-medium">Outfit</th>
              <th className="text-left px-6 py-3 font-medium">Weather</th>
              <th className="text-right px-6 py-3 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {demoHistory.map((h) => (
              <tr key={h.day} className="border-t border-border-subtle">
                <td className="px-6 py-4 font-medium text-ink-primary">{h.day}</td>
                <td className="px-6 py-4 text-ink-secondary">{h.outfit}</td>
                <td className="px-6 py-4 text-ink-muted">{h.weather}</td>
                <td className="px-6 py-4 text-right">
                  <Badge tone="good">{h.score}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
