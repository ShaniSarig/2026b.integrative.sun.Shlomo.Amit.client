import React from 'react';
import { demoUsers } from '../../data/mockData.js';
import Badge from '../../components/ui/Badge.jsx';
import Metric from '../../components/ui/Metric.jsx';
import { Users, AlertTriangle, Activity } from 'lucide-react';

export default function AdminMobile() {
  return (
    <div className="px-5 flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-3xl text-ink-primary">Admin</h1>
        <p className="text-sm text-ink-muted">Service health and user oversight.</p>
      </header>
      <div className="grid grid-cols-3 gap-3">
        <Metric icon={Users} label="Users" value="4" />
        <Metric icon={Activity} label="Uptime" value="99.9%" />
        <Metric icon={AlertTriangle} label="Flags" value="1" />
      </div>
      <section className="flex flex-col gap-2">
        <h2 className="font-display font-bold text-xl text-ink-primary">Users</h2>
        {demoUsers.map((u) => (
          <div
            key={u.email}
            className="bg-white border border-border-subtle rounded-md p-4 flex items-center justify-between"
          >
            <div className="min-w-0">
              <p className="font-medium text-sm text-ink-primary">{u.name}</p>
              <p className="text-xs text-ink-muted truncate">{u.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={u.status === 'Flagged' ? 'bad' : 'good'}>{u.status}</Badge>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
