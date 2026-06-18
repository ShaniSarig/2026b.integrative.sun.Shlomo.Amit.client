import React from 'react';
import { Search } from 'lucide-react';
import ItemTile from '../../components/ui/ItemTile.jsx';
import { useClosetFilters, CATEGORIES } from './useClosetFilters.js';

export default function ClosetMobile({ onNavigate }) {
  const { query, setQuery, category, setCategory, items } = useClosetFilters();
  return (
    <div className="px-5 flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <h1 className="font-display font-bold text-3xl text-ink-primary">Closet</h1>
        <button
          onClick={() => onNavigate?.('add')}
          className="px-4 py-2 rounded-md bg-brand-primary text-ink-inverse text-sm font-semibold"
        >
          + Add
        </button>
      </header>

      <div className="flex items-center gap-2 px-4 py-3 bg-white border border-border-subtle rounded-md">
        <Search size={18} className="text-ink-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, color, style"
          className="flex-1 bg-transparent outline-none text-sm text-ink-primary placeholder:text-ink-muted"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-1.5 rounded-md text-sm whitespace-nowrap border ${
              category === c
                ? 'bg-brand-primary text-ink-inverse border-brand-primary'
                : 'bg-white text-ink-secondary border-border-subtle'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="text-sm text-ink-muted">{items.length} pieces</p>

      <div className="grid grid-cols-2 gap-3">
        {items.map((it) => (
          <ItemTile key={it.id} item={it} compact />
        ))}
      </div>
    </div>
  );
}
