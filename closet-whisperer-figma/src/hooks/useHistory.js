import { useState, useEffect, useCallback, useMemo } from 'react';
import { historyApi, inventoryApi } from '../api/closetApi.js';

export function useHistory(user) {
  const [history, setHistory] = useState([]);
  const [itemsMap, setItemsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = useMemo(() => {
    if (!user) return null;
    return {
      userSystemID: user.systemId,
      userEmail: user.email,
      userPassword: user.password,
    };
  }, [user]);

  const reload = useCallback(async () => {
    if (!auth || !user?.profileId) return;
    setLoading(true);
    setError(null);
    try {
      const [historyRes, itemsRes] = await Promise.all([
        historyApi.listWearHistory(auth, user.profileId, 0, 20),
        inventoryApi.listItems(auth, user.profileId, 0, 200, false),
      ]);
      setHistory(historyRes || []);
      const map = {};
      (itemsRes || []).forEach((item) => {
        const id = item.id?.objectId;
        if (id) map[id] = item;
      });
      setItemsMap(map);
    } catch (err) {
      console.error('Failed to load wear history', err);
      setError(err?.message || 'Failed to load wear history');
    } finally {
      setLoading(false);
    }
  }, [auth, user?.profileId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const rate = useCallback(async (outfitId, score) => {
    if (!auth || !outfitId) return;
    const rating = score > 0 ? 'LIKE' : 'DISLIKE';
    // optimistic update
    setHistory((prev) =>
      prev.map((h) => (h.id?.objectId === outfitId ? { ...h, userRating: rating } : h))
    );
    try {
      const updated = await historyApi.rateOutfit(outfitId, score, auth);
      if (updated) {
        setHistory((prev) =>
          prev.map((h) => (h.id?.objectId === outfitId ? updated : h))
        );
      }
    } catch (err) {
      console.error('Failed to rate outfit', err);
      reload(); // revert on failure
    }
  }, [auth, reload]);

  return { history, itemsMap, loading, error, reload, rate };
}
