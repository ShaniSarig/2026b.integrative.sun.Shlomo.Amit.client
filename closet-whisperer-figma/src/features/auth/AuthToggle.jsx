import React from 'react';

export default function AuthToggle({ mode, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-[#DDD3C4] rounded-xl w-full">
      {['login', 'register'].map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
            mode === m
              ? 'bg-white text-ink-primary shadow-card'
              : 'text-ink-muted hover:text-ink-primary'
          }`}
        >
          {m === 'login' ? 'Login' : 'Register'}
        </button>
      ))}
    </div>
  );
}
