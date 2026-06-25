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
      // Check inventory first — friendly message if closet is empty
      const items = await inventoryApi.listItems(auth, user.profileId, 0, 100, true);
      if (!items || items.length === 0) {
        setError('Your closet is empty. Add some clothes first to generate an outfit!');
        return;
      }

      const newOutfit = await recommendationApi.generateOutfit(auth, user.profileId, hints);

      const map = {};
      items.forEach((it) => {
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

  // outfitId passed explicitly so callbacks never close over stale state
  const confirm = useCallback(async (outfitId) => {
    if (!auth || !outfitId) return;
    try {
      const updated = await recommendationApi.confirmOutfit(outfitId, auth);
      setOutfit((prev) => updated ?? { ...prev, confirmed: true });
    } catch (err) {
      console.error('Failed to confirm outfit', err);
      setError(err?.message || 'Failed to confirm outfit');
    }
  }, [auth]);

  const regenerate = useCallback(async (outfitId, hints) => {
    if (!auth) return;
    // Delete current outfit if there is one
    if (outfitId) {
      try {
        await recommendationApi.deleteOutfit(outfitId, auth);
      } catch {
        // continue even if delete fails
      }
    }
    setOutfit(null);
    return generate(hints);
  }, [auth, generate]);

  const rateItem = useCallback(async (outfitId, itemId, score) => {
    if (!auth || !outfitId || score === 0) return;
    try {
      await recommendationApi.rateOutfitItem(outfitId, itemId, score, auth);
    } catch (err) {
      console.error('Failed to rate outfit item', err);
    }
  }, [auth]);

  return { outfit, itemsMap, loading, error, generate, confirm, regenerate, rateItem };
}
