import React, { useState } from 'react';
import { User, AtSign, Mail, Lock, Calendar } from 'lucide-react';
import TextField from '../../components/ui/TextField.jsx';
import Button from '../../components/ui/Button.jsx';

export default function PersonalInfoForm({ user }) {
  const [form, setForm] = useState({
    username: user?.username ?? 'shani',
    name: user?.name ?? 'Shani',
    email: user?.email ?? 'demo@closetwhisperer.app',
    dateOfBirth: user?.dateOfBirth ?? '',
    currentPassword: '',
    newPassword: '',
  });
  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));

  return (
    <form
      className="flex flex-col gap-5 w-full"
      onSubmit={(e) => {
        e.preventDefault();
      }}
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

      <div className="flex gap-3">
        <Button type="submit">Save personal info</Button>
        <Button variant="secondary" type="reset">Reset</Button>
      </div>
    </form>
  );
}
