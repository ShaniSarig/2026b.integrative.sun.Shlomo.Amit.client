import { useState, useEffect, useCallback, useMemo } from 'react';
import { historyApi } from '../api/closetApi.js';

export function useHistory(user) {
  const [history, setHistory] = useState([]);
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
      const res = await historyApi.listWearHistory(auth, user.profileId, 0, 20);
      setHistory(res || []);
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

  return { history, loading, error, reload };
}
