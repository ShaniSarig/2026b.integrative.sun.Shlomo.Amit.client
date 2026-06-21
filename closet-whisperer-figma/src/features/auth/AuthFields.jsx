import React from 'react';
import { Mail, Lock, User, Calendar, ChevronDown } from 'lucide-react';
import TextField from '../../components/ui/TextField.jsx';

export default function AuthFields({ mode, form, setField }) {
  return (
    <div className="flex flex-col gap-5 w-full">
      {mode === 'register' && (
        <>
          <TextField
            label="Full Name"
            icon={User}
            value={form.name}
            onChange={setField('name')}
            placeholder="Your full name"
            autoComplete="name"
            required
          />
          <TextField
            label="Username"
            icon={User}
            value={form.username}
            onChange={setField('username')}
            placeholder="Your username"
            autoComplete="username"
            required
          />
          <TextField
            label="Date of Birth"
            icon={Calendar}
            type="date"
            value={form.dateOfBirth}
            onChange={setField('dateOfBirth')}
            required
          />
          <label className="flex flex-col gap-2">
            <span className="font-sans font-medium text-sm leading-[18px] text-ink-primary">
              Gender
            </span>
            <div className="flex items-center gap-3 px-5 py-[14px] bg-elevated border border-border-subtle rounded-md focus-within:border-border-strong relative">
              <User size={20} className="text-ink-muted shrink-0" strokeWidth={1.75} />
              <select
                value={form.gender}
                onChange={setField('gender')}
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
        </>
      )}
      <TextField
        label="Email"
        icon={Mail}
        type="email"
        value={form.email}
        onChange={setField('email')}
        placeholder="you@example.com"
        autoComplete="email"
        required
      />
      <TextField
        label="Password"
        icon={Lock}
        type="password"
        value={form.password}
        onChange={setField('password')}
        placeholder="••••••••"
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        required
      />
    </div>
  );
}
