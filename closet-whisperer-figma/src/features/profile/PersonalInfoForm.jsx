import React, { useState } from 'react';
import { User, AtSign, Mail, Lock, Calendar, ChevronDown } from 'lucide-react';
import TextField from '../../components/ui/TextField.jsx';
import Button from '../../components/ui/Button.jsx';

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
        <label className="flex flex-col gap-2">
          <span className="font-sans font-medium text-sm leading-[18px] text-ink-primary">
            Gender
          </span>
          <div className="flex items-center gap-3 px-5 py-[14px] bg-elevated border border-border-subtle rounded-md focus-within:border-border-strong relative">
            <User size={20} className="text-ink-muted shrink-0" strokeWidth={1.75} />
            <select
              value={form.gender}
              onChange={set('gender')}
              required
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

      <div className="flex gap-3">
        <Button type="submit">Save personal info</Button>
        <Button variant="secondary" type="reset">Reset</Button>
      </div>
    </form>
  );
}
