import React, { useState } from 'react';
import { useViewport } from './hooks/useViewport.js';
import AuthFlow from './features/auth/AuthFlow.jsx';
import MobileShell from './layout/MobileShell.jsx';
import DesktopShell from './layout/DesktopShell.jsx';

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
  const [user, setUser] = useState(null);
  const [active, setActive] = useState('dashboard');

  if (!user) {
    return <AuthFlow onAuth={setUser} />;
  }

  const Active = SCREENS[active][variant];
  const Shell = variant === 'mobile' ? MobileShell : DesktopShell;

  return (
    <Shell
      active={active}
      onNavigate={setActive}
      onSignOut={() => setUser(null)}
      user={user}
    >
      <Active user={user} onNavigate={setActive} />
    </Shell>
  );
}
