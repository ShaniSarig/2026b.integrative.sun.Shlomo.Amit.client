import { useState, useCallback, useMemo } from 'react';
import { recommendationApi, inventoryApi } from '../api/closetApi.js';

export function useOutfit(user) {
  const [outfit, setOutfit] = useState(null);
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

  const generate = useCallback(async (hints) => {
    if (!auth || !user?.profileId) return;
    setLoading(true);
    setError(null);
    try {
      const [newOutfit, items] = await Promise.all([
        recommendationApi.generateOutfit(auth, user.profileId, hints),
        inventoryApi.listItems(auth, user.profileId, 0, 100, true),
      ]);
      const map = {};
      (items || []).forEach((it) => {
        if (it.id?.objectId) map[it.id.objectId] = it;
      });
      setItemsMap(map);
      setOutfit(newOutfit);
      return { outfit: newOutfit, itemsMap: map };
    } catch (err) {
      console.error('Failed to generate outfit', err);
      setError(err?.message || 'Failed to generate outfit');
    } finally {
      setLoading(false);
    }
  }, [auth, user?.profileId]);

  const confirm = useCallback(async () => {
    if (!auth || !outfit?.id?.id) return;
    try {
      const updated = await recommendationApi.confirmOutfit(outfit.id.id, auth);
      setOutfit(updated ?? { ...outfit, confirmed: true });
    } catch (err) {
      console.error('Failed to confirm outfit', err);
      setError(err?.message || 'Failed to confirm outfit');
    }
  }, [auth, outfit]);

  const rate = useCallback(async (score) => {
    if (!auth || !outfit?.id?.id) return;
    try {
      const updated = await recommendationApi.rateOutfit(outfit.id.id, score, auth);
      setOutfit(updated ?? { ...outfit, userRating: score > 0 ? 'LIKE' : 'DISLIKE' });
    } catch (err) {
      console.error('Failed to rate outfit', err);
      setError(err?.message || 'Failed to rate outfit');
    }
  }, [auth, outfit]);

  const remove = useCallback(async () => {
    if (!auth || !outfit?.id?.id) return;
    try {
      await recommendationApi.deleteOutfit(outfit.id.id, auth);
      setOutfit(null);
    } catch (err) {
      console.error('Failed to delete outfit', err);
      setError(err?.message || 'Failed to delete outfit');
    }
  }, [auth, outfit]);

  return { outfit, itemsMap, loading, error, generate, confirm, rate, remove };
}
