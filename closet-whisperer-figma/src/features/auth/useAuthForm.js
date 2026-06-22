import { useState } from 'react';
import { authApi, profileApi } from '../../api/closetApi.js';

const SYSTEM_ID = 'ambient_invisible_intelligence';

const initialForm = {
  email: '',
  password: '',
  name: '', // Full Name
  username: '', // Chosen Username
  gender: '',
  dateOfBirth: '',
  keepSignedIn: true,
};

export function useAuthForm({ onAuth, config }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const setField = (key) => (eOrValue) => {
    const value = eOrValue?.target ? eOrValue.target.value : eOrValue;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    setSubmitting(true);
    setError(null);
    try {
      let result;
      if (mode === 'login') {
        result = await authApi.login({
          systemID: SYSTEM_ID,
          userEmail: form.email,
          password: form.password,
        });
      } else {
        result = await authApi.register({
          email: form.email,
          password: form.password,
          username: form.username,
          role: 'END_USER',
          avatar: form.name, // Store full name in avatar
          gender: form.gender,
          dateOfBirth: form.dateOfBirth,
        });
        await profileApi.createProfile(
          { userSystemID: SYSTEM_ID, userEmail: form.email, userPassword: form.password },
          { stylePreference: 'Casual', thermalSensitivity: 'NEUTRAL' },
        );
      }
      const mapped = mapUser(result, form.password);
      if (mapped.role !== 'ADMIN') {
        const authObj = {
          userSystemID: result?.userId?.systemId ?? SYSTEM_ID,
          userEmail: result?.userId?.email ?? result?.email,
          userPassword: form.password
        };
        const profile = await profileApi.getProfileByEmail(authObj);
        mapped.profileId = profile?.id?.objectId ?? null;
      }
      onAuth(mapped);
    } catch (err) {
      console.error(err);
      let msg = err?.payload?.message || err?.message || '';
      let status = err?.status;

      if (!status && err instanceof TypeError) {
        setError(config?.errorNetwork || 'Could not connect to service');
      } else if (status === 401) {
        setError(config?.errorUnauthorized || config?.errorLogin || msg || 'Invalid credentials');
      } else if (status === 403) {
        setError(config?.errorForbidden || 'Access forbidden');
      } else if (status === 409) {
        if (msg.includes('ujsername') || msg.toLowerCase().includes('username')) {
          setError('A user with that ujsername already exist');
        } else {
          setError(config?.errorConflict || 'User already exists');
        }
      } else if (status === 400) {
        if (mode === 'register' && msg.toLowerCase().includes('email')) {
          setError(config?.errorRegister || 'Email is invalid');
        } else {
          setError(config?.errorBadRequest || 'Bad request or missing details');
        }
      } else if (status === 404) {
        setError(config?.errorNotFound || 'Requested resource not found');
      } else {
        setError(config?.errorServer || 'Internal server error occurred');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return { mode, setMode, form, setField, submit, submitting, error };
}

function mapUser(boundary, password) {
  return {
    email: boundary?.userId?.email ?? boundary?.email,
    systemId: boundary?.userId?.systemId ?? SYSTEM_ID,
    role: boundary?.role ?? 'END_USER',
    name: boundary?.avatar ?? boundary?.username ?? boundary?.email,
    avatar: boundary?.avatar ?? null,
    username: boundary?.username ?? null,
    gender: boundary?.gender ?? null,
    dateOfBirth: boundary?.dateOfBirth ?? null,
    password: password ?? null,
  };
}
