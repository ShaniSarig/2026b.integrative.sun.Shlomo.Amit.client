import React, { useState, useEffect } from 'react';
import { useViewport } from './hooks/useViewport.js';
import AuthFlow from './features/auth/AuthFlow.jsx';
import MobileShell from './layout/MobileShell.jsx';
import DesktopShell from './layout/DesktopShell.jsx';
import { adminApi } from './api/closetApi.js';

import DashboardMobile from './features/dashboard/DashboardMobile.jsx';
import DashboardDesktop from './features/dashboard/DashboardDesktop.jsx';
import ClosetMobile from './features/closet/ClosetMobile.jsx';
import ClosetDesktop from './features/closet/ClosetDesktop.jsx';
import AddItemMobile from './features/add-item/AddItemMobile.jsx';
import AddItemDesktop from './features/add-item/AddItemDesktop.jsx';
import OutfitsMobile from './features/outfits/OutfitsMobile.jsx';
import OutfitsDesktop from './features/outfits/OutfitsDesktop.jsx';
import HistoryMobile from './features/history/HistoryMobile.jsx';
import HistoryDesktop from './features/history/HistoryDesktop.jsx';
import ProfileMobile from './features/profile/ProfileMobile.jsx';
import ProfileDesktop from './features/profile/ProfileDesktop.jsx';
import AdminMobile from './features/admin/AdminMobile.jsx';
import AdminDesktop from './features/admin/AdminDesktop.jsx';

const SCREENS = {
  dashboard: { mobile: DashboardMobile, desktop: DashboardDesktop },
  closet: { mobile: ClosetMobile, desktop: ClosetDesktop },
  add: { mobile: AddItemMobile, desktop: AddItemDesktop },
  outfits: { mobile: OutfitsMobile, desktop: OutfitsDesktop },
  history: { mobile: HistoryMobile, desktop: HistoryDesktop },
  profile: { mobile: ProfileMobile, desktop: ProfileDesktop },
  admin: { mobile: AdminMobile, desktop: AdminDesktop },
};

export default function App() {
  const { variant } = useViewport();
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cw_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to load session', e);
      return null;
    }
  });
  const [active, setActive] = useState('dashboard');
  const [currentOutfit, setCurrentOutfit] = useState(null);
  const [outfitItemsMap, setOutfitItemsMap] = useState({});
  const [config, setConfig] = useState({
    brandName: 'The Closet Whisperer',
    brandIcon: '✨',
    errorLogin: 'Invalid credentials',
    errorRegister: 'Email is invalid',
    errorConflict: 'User already exists',
    errorUnauthorized: 'Access unauthorized',
    errorForbidden: 'Access forbidden',
    errorNotFound: 'Requested resource not found',
    errorBadRequest: 'Bad request or missing details',
    errorNoOutfits: 'No matching clothes found for outfit recommendation',
    errorNetwork: 'Could not connect to service',
    errorServer: 'Internal server error occurred',
  });

  window.__brandConfig = config;

  useEffect(() => {
    if (user) {
      localStorage.setItem('cw_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cw_user');
    }
  }, [user]);

  useEffect(() => {
    adminApi.getConfig()
      .then((res) => {
        if (res) {
          setConfig(res);
        }
      })
      .catch((err) => console.error('Failed to load admin config', err));
  }, []);

  if (!user) {
    return <AuthFlow onAuth={setUser} config={config} />;
  }

  const safeActive = active === 'admin' && user?.role !== 'ADMIN' ? 'dashboard' : active;
  const Active = SCREENS[safeActive][variant];
  const Shell = variant === 'mobile' ? MobileShell : DesktopShell;

  return (
    <Shell
      active={safeActive}
      onNavigate={setActive}
      onSignOut={() => setUser(null)}
      user={user}
      config={config}
    >
      <Active
        user={user}
        onNavigate={setActive}
        config={config}
        onConfigChange={setConfig}
        currentOutfit={currentOutfit}
        outfitItemsMap={outfitItemsMap}
        onOutfitChange={(o, map) => { setCurrentOutfit(o); setOutfitItemsMap(map ?? {}); }}
      />
    </Shell>
  );
}
