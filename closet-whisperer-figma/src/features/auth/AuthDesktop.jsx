import React from 'react';
import { Sparkles, CloudSun, RefreshCcw } from 'lucide-react';
import AppLogo from '../../components/ui/AppLogo.jsx';
import Button from '../../components/ui/Button.jsx';
import Checkbox from '../../components/ui/Checkbox.jsx';
import AuthFields from './AuthFields.jsx';
import AuthToggle from './AuthToggle.jsx';

const FEATURES = [
  { icon: Sparkles, title: 'AI Recognition', detail: 'Auto-tags type, color, style' },
  { icon: CloudSun, title: 'Weather Fit', detail: 'Temp, UV, humidity, wind' },
  { icon: RefreshCcw, title: 'Anti-Repetition', detail: 'Avoids duplicate looks' },
];

export default function AuthDesktop({ mode, setMode, form, setField, submit, submitting, error }) {
  const isLogin = mode === 'login';
  return (
    <div className="min-h-screen bg-canvas flex">
      <section className="flex-1 flex flex-col justify-center gap-10 pl-20 pr-14 py-20">
        <AppLogo layout="inline" />
        <div className="flex flex-col gap-6">
          <h1 className="font-display font-black text-[56px] leading-[64px] text-ink-primary">
            Your wardrobe, weather-aware and AI-guided.
          </h1>
          <p className="font-sans text-lg leading-[26px] text-ink-secondary max-w-[640px]">
            A fast morning interface for cataloging garments, getting outfit recommendations,
            tracking laundry, and previewing the look on your visual persona.
          </p>
        </div>
        <div className="flex gap-4">
          {FEATURES.map(({ icon: Icon, title, detail }) => (
            <div
              key={title}
              className="flex-1 flex flex-col gap-2 bg-white rounded-[28px] p-5"
            >
              <span className="flex items-center justify-center size-7 rounded-full bg-cream-100 text-brand-accent">
                <Icon size={16} strokeWidth={1.75} />
              </span>
              <p className="font-medium text-sm text-ink-primary">{title}</p>
              <p className="text-sm text-ink-muted">{detail}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="flex-1 flex items-center justify-center pl-14 pr-20 py-20">
        <div
          className="w-[440px] bg-white border border-border-subtle rounded-[28px] p-8 flex flex-col gap-6"
          style={{ boxShadow: '0 12px 32px rgba(27,20,16,0.1)' }}
        >
          <AuthToggle mode={mode} onChange={setMode} />
          <header className="flex flex-col gap-1">
            <h2 className="font-display font-semibold text-[32px] leading-[40px] text-ink-primary">
              {isLogin ? 'Welcome back' : 'Create your closet'}
            </h2>
            <p className="text-sm text-ink-muted">
              {isLogin
                ? "Get today's outfit before your coffee gets cold."
                : 'Set up your AI wardrobe profile in minutes.'}
            </p>
          </header>
          <form className="flex flex-col gap-5 w-full" onSubmit={submit}>
            <AuthFields mode={mode} form={form} setField={setField} />
            {isLogin && (
              <div className="flex items-center justify-between w-full">
                <Checkbox
                  checked={form.keepSignedIn}
                  onChange={setField('keepSignedIn')}
                  label="Keep me signed in"
                />
                <button type="button" className="text-sm font-medium text-brand-accent">
                  Forgot password?
                </button>
              </div>
            )}
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <Button type="submit" full disabled={submitting}>
              {submitting ? 'Working…' : isLogin ? 'Login to dashboard' : 'Create my closet'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
