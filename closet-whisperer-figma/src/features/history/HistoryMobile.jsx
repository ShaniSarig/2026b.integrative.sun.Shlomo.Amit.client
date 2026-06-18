import React from 'react';
import { demoHistory } from '../../data/mockData.js';
import Badge from '../../components/ui/Badge.jsx';

export default function HistoryMobile() {
  return (
    <div className="px-5 flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-3xl text-ink-primary">Wear history</h1>
        <p className="text-sm text-ink-muted">Track which looks you've worn lately.</p>
      </header>
      <ul className="flex flex-col gap-3">
        {demoHistory.map((h) => (
          <li
            key={h.day}
            className="bg-white border border-border-subtle rounded-md p-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {h.day}
              </span>
              <Badge tone="good">{h.score}</Badge>
            </div>
            <p className="font-display font-semibold text-base text-ink-primary">{h.outfit}</p>
            <p className="text-xs text-ink-muted">{h.weather}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
