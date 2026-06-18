import React, { useState } from 'react';
import { demoProfile } from '../../data/mockData.js';
import TextField from '../../components/ui/TextField.jsx';
import Button from '../../components/ui/Button.jsx';

export default function ProfileForm() {
  const [profile, setProfile] = useState(demoProfile);
  const set = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }));
  return (
    <form className="flex flex-col gap-5 w-full" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="Height" value={profile.height} onChange={set('height')} />
        <TextField label="Weight" value={profile.weight} onChange={set('weight')} />
        <TextField label="Thermal sensitivity" value={profile.thermalSensitivity} onChange={set('thermalSensitivity')} />
        <TextField label="Style preference" value={profile.stylePreference} onChange={set('stylePreference')} />
        <TextField label="Skin tone" value={profile.skinTone} onChange={set('skinTone')} />
        <TextField label="Hair color" value={profile.hairColor} onChange={set('hairColor')} />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}
