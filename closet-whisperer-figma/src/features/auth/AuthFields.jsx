import React from 'react';
import { Mail, Lock, User, Calendar } from 'lucide-react';
import TextField from '../../components/ui/TextField.jsx';
import PreferenceRow from './PreferenceRow.jsx';

const GENDERS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
];

export default function AuthFields({ mode, form, setField }) {
  return (
    <div className="flex flex-col gap-5 w-full">
      {mode === 'register' && (
        <TextField
          label="Name"
          icon={User}
          value={form.name}
          onChange={setField('name')}
          placeholder="Your name"
          autoComplete="name"
          required
        />
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
      {mode === 'register' && (
        <>
          <PreferenceRow
            label="Gender"
            value={form.gender}
            options={GENDERS}
            onChange={setField('gender')}
          />
          <TextField
            label="Date of birth"
            icon={Calendar}
            type="date"
            value={form.dateOfBirth}
            onChange={setField('dateOfBirth')}
            autoComplete="bday"
          />
        </>
      )}
    </div>
  );
}
