import React from 'react';
import AppLogo from '../../components/ui/AppLogo.jsx';
import Button from '../../components/ui/Button.jsx';
import Checkbox from '../../components/ui/Checkbox.jsx';
import AuthFields from './AuthFields.jsx';

export default function AuthMobile({ mode, setMode, form, setField, submit, submitting, error }) {
  const isLogin = mode === 'login';
  return (
    <div className="min-h-full bg-canvas flex flex-col items-center px-6 pt-10 pb-8 gap-8">
      <AppLogo />
      <header className="flex flex-col items-center gap-2 w-full">
        <h1 className="font-display font-bold text-[30px] leading-[38px] text-ink-primary">
          {isLogin ? 'Welcome back' : 'Create your closet'}
        </h1>
        <p className="font-sans text-base text-ink-secondary leading-6 text-center">
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
      <p className="text-sm text-ink-muted flex gap-1">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button
          type="button"
          onClick={() => setMode(isLogin ? 'register' : 'login')}
          className="font-medium text-brand-accent"
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}
