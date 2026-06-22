import { useMemo, useState, useEffect, useCallback } from 'react';
import { inventoryApi } from '../../api/closetApi.js';

export const CATEGORIES = ['All', 'Top', 'Bottom', 'Outerwear', 'Shoes', 'Full Body'];

export function useClosetFilters(user) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [realItems, setRealItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = useMemo(() => {
    if (!user) return null;
    return {
      userSystemID: user.systemId,
      userEmail: user.email,
      userPassword: user.password
    };
  }, [user]);

  const loadItems = useCallback(async () => {
    if (!auth || !user?.profileId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await inventoryApi.listItems(auth, user.profileId, 0, 100, true);
      const mapped = (res || []).map(it => {
        let style = '';
        let image = '';
        if (it.styleTag && it.styleTag.includes('###')) {
          const parts = it.styleTag.split('###');
          style = parts[0];
          image = parts[1];
        } else if (it.styleTag) {
          style = it.styleTag;
        }

        let cat = 'Top';
        const uCat = (it.category || '').toUpperCase();
        if (uCat === 'BOTTOM') cat = 'Bottom';
        else if (uCat === 'SHOES') cat = 'Shoes';
        else if (uCat === 'OUTERWEAR') cat = 'Outerwear';
        else if (uCat === 'FULL_BODY') cat = 'Full Body';

        return {
          id: it.id?.objectId,
          name: it.subCategory || 'Clothing Item',
          category: cat,
          color: it.color || 'Neutral',
          style: style || 'Casual',
          status: it.status === 'CLEAN' || it.status === 'clean' ? 'Clean' : 'Dirty',
          image: image || null
        };
      });
      setRealItems(mapped);
    } catch (err) {
      console.error('Failed to load items', err);
      setError(err?.message || 'Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [auth, user?.profileId]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return realItems.filter((it) => {
      if (category !== 'All' && it.category !== category) return false;
      if (!q) return true;
      return (
        it.name.toLowerCase().includes(q) ||
        it.color.toLowerCase().includes(q) ||
        it.style.toLowerCase().includes(q)
      );
    });
  }, [realItems, query, category]);

  const deleteItem = useCallback(async (itemId) => {
    if (!auth) return;
    try {
      await inventoryApi.deleteItem(itemId, auth);
      await loadItems();
    } catch (err) {
      console.error('Failed to delete item', err);
      alert('Failed to delete item');
    }
  }, [auth, loadItems]);

  const toggleStatus = useCallback(async (itemId, currentStatus) => {
    if (!auth) return;
    const newStatus = currentStatus === 'Clean' ? 'DIRTY' : 'CLEAN';
    try {
      await inventoryApi.changeStatus(itemId, auth, newStatus);
      await loadItems();
    } catch (err) {
      console.error('Failed to toggle item status', err);
      alert('Failed to update item status');
    }
  }, [auth, loadItems]);

  return { query, setQuery, category, setCategory, items, loading, error, reload: loadItems, deleteItem, toggleStatus };
}
