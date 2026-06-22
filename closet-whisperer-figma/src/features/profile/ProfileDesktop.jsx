import React, { useState } from 'react';
import ProfileForm from './ProfileForm.jsx';
import PersonaCard from './PersonaCard.jsx';
import PersonalInfoForm from './PersonalInfoForm.jsx';
import ProfileTabs from './ProfileTabs.jsx';
import { useProfile } from '../../hooks/useProfile.js';

export default function ProfileDesktop({ user }) {
  const [tab, setTab] = useState('personal');
  const { profile, loading, saving, saveBiometrics, savePreferences } = useProfile(user);

  return (
    <div className="px-10 py-10 max-w-[1200px] mx-auto flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-5xl text-ink-primary leading-tight">
          Profile
        </h1>
        <p className="text-base text-ink-muted">
          {tab === 'personal'
            ? 'Account details and password.'
            : 'Body, palette, and style inputs your stylist uses every morning.'}
        </p>
      </header>
      <div className="max-w-[480px]">
        <ProfileTabs active={tab} onChange={setTab} />
      </div>
      <div className="grid grid-cols-[1fr_360px] gap-8 items-start">
        <div className="bg-white border border-border-subtle rounded-lg p-8 shadow-card">
          {tab === 'personal' ? (
            <PersonalInfoForm user={user} />
          ) : loading ? (
            <p className="text-ink-muted text-sm">Loading profile…</p>
          ) : (
            <ProfileForm
              user={user}
              profile={profile}
              saving={saving}
              onSaveBiometrics={saveBiometrics}
              onSavePreferences={savePreferences}
            />
          )}
        </div>
        <PersonaCard user={user} />
      </div>
    </div>
  );
}
