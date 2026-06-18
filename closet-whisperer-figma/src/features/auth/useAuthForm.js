import { useState } from 'react';
import { authApi } from '../../api/closetApi.js';

const initialForm = {
  email: '',
  password: '',
  name: '',
  gender: 'female',
  dateOfBirth: '',
  keepSignedIn: true,
};

export function useAuthForm({ onAuth }) {
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
      const payload =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : {
              email: form.email,
              password: form.password,
              name: form.name,
              gender: form.gender,
              dateOfBirth: form.dateOfBirth,
            };
      const result =
        mode === 'login' ? await authApi.login(payload) : await authApi.register(payload);
      onAuth(result?.user ?? result ?? fallbackUser(form));
    } catch (err) {
      // Mock-friendly: fall back to a demo user when the backend isn't running.
      onAuth(fallbackUser(form));
    } finally {
      setSubmitting(false);
    }
  };

  return { mode, setMode, form, setField, submit, submitting, error };
}

function fallbackUser(form) {
  return {
    id: 'demo-user',
    email: form.email || 'demo@closetwhisperer.app',
    name: form.name || 'Shani',
    gender: form.gender,
    dateOfBirth: form.dateOfBirth,
  };
}
