import { useState, useEffect, useCallback, useMemo } from 'react';
import { profileApi } from '../api/closetApi.js';

export function useProfile(user) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const auth = useMemo(() => {
    if (!user) return null;
    return {
      userSystemID: user.systemId,
      userEmail: user.email,
      userPassword: user.password,
    };
  }, [user]);

  useEffect(() => {
    if (!auth) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    profileApi.getProfileByEmail(auth)
      .then((res) => { if (!cancelled) setProfile(res); })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load profile');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [auth]);

  const saveBiometrics = useCallback(async (payload) => {
    if (!auth || !user?.profileId) return;
    setSaving(true);
    try {
      const updated = await profileApi.updateBiometrics(user.profileId, auth, payload);
      if (updated) {
        setProfile(updated);
      } else {
        setProfile((prev) => ({ ...prev, bodyParameters: { ...(prev?.bodyParameters ?? {}), ...payload.bodyParameters } }));
      }
    } finally {
      setSaving(false);
    }
  }, [auth, user?.profileId]);

  const savePreferences = useCallback(async (payload) => {
    if (!auth || !user?.profileId) return;
    setSaving(true);
    try {
      const updated = await profileApi.updatePreferences(user.profileId, auth, payload);
      if (updated) {
        setProfile(updated);
      } else {
        setProfile((prev) => ({ ...prev, ...payload }));
      }
    } finally {
      setSaving(false);
    }
  }, [auth, user?.profileId]);

  return { profile, loading, saving, error, saveBiometrics, savePreferences };
}
