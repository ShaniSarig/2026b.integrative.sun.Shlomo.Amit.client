import { useMemo, useState } from 'react';
import { demoItems } from '../../data/mockData.js';

export const CATEGORIES = ['All', 'Top', 'Bottom', 'Outerwear', 'Shoes', 'Full Body'];

export function useClosetFilters() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demoItems.filter((it) => {
      if (category !== 'All' && it.category !== category) return false;
      if (!q) return true;
      return (
        it.name.toLowerCase().includes(q) ||
        it.color.toLowerCase().includes(q) ||
        it.style.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return { query, setQuery, category, setCategory, items };
}
