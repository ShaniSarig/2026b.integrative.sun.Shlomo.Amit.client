import React, { useState, useEffect } from 'react';
import TextField from '../../components/ui/TextField.jsx';
import Button from '../../components/ui/Button.jsx';

export default function ProfileForm({ user, profile, saving, onSaveBiometrics, onSavePreferences }) {
  const [form, setForm] = useState({
    height: '',
    weight: '',
    thermalSensitivity: '',
    stylePreference: '',
    skinTone: '',
    hairColor: '',
  });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!profile) return;
    setForm({
      height: profile.bodyParameters?.height ?? '',
      weight: profile.bodyParameters?.weight ?? '',
      thermalSensitivity: profile.thermalSensitivity ?? '',
      stylePreference: profile.stylePreference ?? '',
      skinTone: profile.bodyParameters?.skinTone ?? '',
      hairColor: profile.bodyParameters?.hairColor ?? '',
    });
  }, [profile]);

  const set = (k) => (e) => {
    setSaved(false);
    setSaveError(null);
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    setSaveError(null);
    try {
      await Promise.all([
        onSaveBiometrics?.({
          bodyParameters: {
            height: form.height,
            weight: form.weight,
            skinTone: form.skinTone,
            hairColor: form.hairColor,
          },
        }),
        onSavePreferences?.({
          thermalSensitivity: form.thermalSensitivity || undefined,
          stylePreference: form.stylePreference || undefined,
        }),
      ]);
      setSaved(true);
    } catch (err) {
      setSaveError(err?.message || 'Failed to save profile');
    }
  };

  return (
    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="Height" value={form.height} onChange={set('height')} placeholder="e.g. 168 cm" />
        <TextField label="Weight" value={form.weight} onChange={set('weight')} placeholder="e.g. 62 kg" />
        <TextField label="Thermal sensitivity" value={form.thermalSensitivity} onChange={set('thermalSensitivity')} placeholder="NORMAL / SENSITIVE_HEAT / SENSITIVE_COLD" />
        <TextField label="Style preference" value={form.stylePreference} onChange={set('stylePreference')} placeholder="e.g. Smart Casual" />
        <TextField label="Skin tone" value={form.skinTone} onChange={set('skinTone')} placeholder="e.g. Warm neutral" />
        <TextField label="Hair color" value={form.hairColor} onChange={set('hairColor')} placeholder="e.g. Brown" />
      </div>
      {saveError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2">{saveError}</p>
      )}
      {saved && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-2">Saved!</p>
      )}
      <Button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  );
}
