import React from 'react';
import { LogOut } from 'lucide-react';
import AppLogo from '../components/ui/AppLogo.jsx';
import { NAV } from './navigation.js';

export default function DesktopShell({ active, onNavigate, onSignOut, user, children }) {
  return (
    <div className="h-screen flex overflow-hidden bg-canvas">
      <aside className="w-[260px] shrink-0 bg-white border-r border-border-subtle flex flex-col">
        <div className="px-6 pt-8 pb-6">
          <AppLogo layout="inline" size={40} />
        </div>
        <nav className="flex-1 px-3">
          <ul className="flex flex-col gap-1">
            {NAV.filter((n) => n.id !== 'admin' || user?.role === 'ADMIN').map(({ id, label, icon: Icon }) => {
              const isActive = active === id;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-cream-100 text-ink-primary'
                        : 'text-ink-muted hover:text-ink-primary hover:bg-cream-50'
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-border-subtle px-4 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink-primary">{user?.name ?? 'You'}</p>
            <p className="text-xs text-ink-muted truncate max-w-[160px]">
              {user?.email ?? 'demo@closetwhisperer.app'}
            </p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            aria-label="Sign out"
            className="text-ink-muted hover:text-ink-primary"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">{children}</main>
    </div>
  );
}
