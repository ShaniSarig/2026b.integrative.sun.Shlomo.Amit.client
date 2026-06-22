import React, { useState } from 'react';
import ProfileForm from './ProfileForm.jsx';
import PersonaCard from './PersonaCard.jsx';
import PersonalInfoForm from './PersonalInfoForm.jsx';
import ProfileTabs from './ProfileTabs.jsx';
import { useProfile } from '../../hooks/useProfile.js';

export default function ProfileMobile({ user }) {
  const [tab, setTab] = useState('personal');
  const { profile, loading, saving, saveBiometrics, savePreferences } = useProfile(user);

  return (
    <div className="px-5 flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-3xl text-ink-primary">Profile</h1>
        <p className="text-sm text-ink-muted">
          {tab === 'personal'
            ? 'Update your account details.'
            : 'Tune the inputs your stylist uses.'}
        </p>
      </header>
      <ProfileTabs active={tab} onChange={setTab} />
      {tab === 'personal' ? (
        <PersonalInfoForm user={user} />
      ) : (
        <>
          <PersonaCard user={user} />
          {loading ? (
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
        </>
      )}
    </div>
  );
}
