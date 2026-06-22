import React from 'react';
import { Search } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import ItemTile from '../../components/ui/ItemTile.jsx';
import { useClosetFilters, CATEGORIES } from './useClosetFilters.js';

export default function ClosetDesktop({ user, onNavigate }) {
  const { query, setQuery, category, setCategory, items, loading, deleteItem, toggleStatus } = useClosetFilters(user);
  return (
    <div className="px-10 py-10 max-w-[1400px] mx-auto flex flex-col gap-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display font-bold text-5xl text-ink-primary leading-tight">
            Your closet
          </h1>
          <p className="text-base text-ink-muted mt-1">
            {items.length} pieces · weather-ready and tagged
          </p>
        </div>
        <Button onClick={() => onNavigate?.('add')}>+ Add new item</Button>
      </header>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-5 py-3 bg-white border border-border-subtle rounded-md flex-1 max-w-[440px]">
          <Search size={18} className="text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search garments"
            className="flex-1 bg-transparent outline-none text-base text-ink-primary placeholder:text-ink-muted"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-md text-sm border transition-colors ${
                category === c
                  ? 'bg-brand-primary text-ink-inverse border-brand-primary'
                  : 'bg-white text-ink-secondary border-border-subtle hover:border-brand-primary'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-center py-10 text-ink-muted">Loading your wardrobe...</p>}
      <div className="grid grid-cols-4 gap-5">
        {!loading && items.map((it) => (
          <ItemTile key={it.id} item={it} onDelete={() => deleteItem(it.id)} onToggleStatus={(id, status) => toggleStatus(id, status)} />
        ))}
      </div>
    </div>
  );
}
