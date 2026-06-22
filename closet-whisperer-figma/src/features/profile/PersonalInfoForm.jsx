import React, { useState } from 'react';
import { User, AtSign, Mail, Lock, Calendar, ChevronDown } from 'lucide-react';
import TextField from '../../components/ui/TextField.jsx';
import Button from '../../components/ui/Button.jsx';
import { authApi } from '../../api/closetApi.js';

export default function PersonalInfoForm({ user }) {
  const [form, setForm] = useState({
    username: user?.username ?? 'shani',
    name: user?.name ?? 'Shani',
    email: user?.email ?? 'demo@closetwhisperer.app',
    dateOfBirth: user?.dateOfBirth ?? '',
    gender: user?.gender ?? '',
    currentPassword: '',
    newPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const set = (k) => (e) => {
    setSaved(false);
    setSaveError(null);
    setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    try {
      const payload = {
        username: form.username,
        avatar: form.name,
        gender: form.gender || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        ...(form.newPassword ? { password: form.newPassword } : {}),
      };
      const passwordToUse = form.currentPassword || user.password;
      await authApi.updateUser(user.systemId, user.email, passwordToUse, payload);
      setSaved(true);
    } catch (err) {
      setSaveError(err?.message || 'Failed to save personal info');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-5 w-full"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          label="Username"
          icon={AtSign}
          value={form.username}
          onChange={set('username')}
          placeholder="shani"
          autoComplete="username"
        />
        <TextField
          label="Full name"
          icon={User}
          value={form.name}
          onChange={set('name')}
          placeholder="Your name"
          autoComplete="name"
        />
        <TextField
          label="Email"
          icon={Mail}
          type="email"
          value={form.email}
          onChange={set('email')}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <TextField
          label="Date of birth"
          icon={Calendar}
          type="date"
          value={form.dateOfBirth}
          onChange={set('dateOfBirth')}
          autoComplete="bday"
        />
        <label className="flex flex-col gap-2">
          <span className="font-sans font-medium text-sm leading-[18px] text-ink-primary">
            Gender
          </span>
          <div className="flex items-center gap-3 px-5 py-[14px] bg-elevated border border-border-subtle rounded-md focus-within:border-border-strong relative">
            <User size={20} className="text-ink-muted shrink-0" strokeWidth={1.75} />
            <select
              value={form.gender}
              onChange={set('gender')}
              className="flex-1 bg-transparent outline-none text-base leading-6 text-ink-primary appearance-none cursor-pointer pr-8"
            >
              <option value="" disabled hidden>Select gender</option>
              <option value="Male" className="bg-white text-ink-primary">Male</option>
              <option value="Female" className="bg-white text-ink-primary">Female</option>
              <option value="Other" className="bg-white text-ink-primary">Other</option>
              <option value="Prefer not to say" className="bg-white text-ink-primary">Prefer not to say</option>
            </select>
            <ChevronDown size={18} className="text-ink-muted pointer-events-none absolute right-5" />
          </div>
        </label>
      </div>

      <div className="pt-4 border-t border-border-subtle">
        <h3 className="font-display font-semibold text-lg text-ink-primary mb-3">
          Change password
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Current password"
            icon={Lock}
            type="password"
            value={form.currentPassword}
            onChange={set('currentPassword')}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <TextField
            label="New password"
            icon={Lock}
            type="password"
            value={form.newPassword}
            onChange={set('newPassword')}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
        </div>
      </div>

      {saveError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2">{saveError}</p>
      )}
      {saved && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-2">Personal info saved!</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save personal info'}</Button>
        <Button variant="secondary" type="reset" onClick={() => { setSaved(false); setSaveError(null); }}>Reset</Button>
      </div>
    </form>
  );
}
