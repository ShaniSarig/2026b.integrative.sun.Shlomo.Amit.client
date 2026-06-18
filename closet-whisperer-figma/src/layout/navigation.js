import {
  LayoutDashboard,
  Shirt,
  PlusSquare,
  Sparkles,
  History,
  User,
  ShieldCheck,
} from 'lucide-react';

export const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'closet', label: 'Closet', icon: Shirt },
  { id: 'add', label: 'Add Item', icon: PlusSquare },
  { id: 'outfits', label: 'Outfits', icon: Sparkles },
  { id: 'history', label: 'History', icon: History },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'admin', label: 'Admin', icon: ShieldCheck },
];

export const MOBILE_NAV = NAV.filter((n) =>
  ['dashboard', 'closet', 'add', 'outfits', 'profile'].includes(n.id),
);
