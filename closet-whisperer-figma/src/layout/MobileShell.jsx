import React from 'react';
import { LogOut } from 'lucide-react';
import AppLogo from '../components/ui/AppLogo.jsx';
import { NAV } from './navigation.js';

export default function MobileShell({ active, onNavigate, onSignOut, user, children }) {
  const mobileNav = NAV.filter((n) =>
    ['dashboard', 'closet', 'add', 'outfits', 'profile'].includes(n.id) ||
    (n.id === 'admin' && user?.role === 'ADMIN')
  );
  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="flex items-center justify-between px-5 pt-6 pb-3">
        <AppLogo layout="inline" size={36} withWordmark={false} />
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-muted">Hi, {user?.name?.split(' ')[0] ?? 'you'}</span>
          <button
            type="button"
            onClick={onSignOut}
            aria-label="Sign out"
            className="text-ink-muted hover:text-ink-primary"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <main className="flex-1 pb-24 flex flex-col">{children}</main>
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-border-subtle pb-safe">
        <ul className="flex items-stretch justify-between px-2 py-2">
          {mobileNav.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <li key={id} className="flex-1">
                <button
                  type="button"
                  onClick={() => onNavigate(id)}
                  className={`w-full flex flex-col items-center gap-1 py-1.5 rounded-md ${
                    isActive ? 'text-ink-primary' : 'text-ink-muted'
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="text-[11px] font-medium">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
