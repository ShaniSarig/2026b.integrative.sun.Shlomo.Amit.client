import React from 'react';
import { demoUsers } from '../../data/mockData.js';
import Badge from '../../components/ui/Badge.jsx';
import Metric from '../../components/ui/Metric.jsx';
import { Users, AlertTriangle, Activity, Database } from 'lucide-react';

export default function AdminDesktop() {
  return (
    <div className="px-10 py-10 max-w-[1400px] mx-auto flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-display font-bold text-5xl text-ink-primary leading-tight">
          Admin panel
        </h1>
        <p className="text-base text-ink-muted">
          Service health, telemetry, and user oversight.
        </p>
      </header>
      <div className="grid grid-cols-4 gap-4">
        <Metric icon={Users} label="Active users" value="4" detail="this week" />
        <Metric icon={Activity} label="Uptime" value="99.9%" detail="last 30 days" />
        <Metric icon={Database} label="Items stored" value="125" detail="total garments" />
        <Metric icon={AlertTriangle} label="Open flags" value="1" detail="moderation queue" />
      </div>
      <section className="bg-white border border-border-subtle rounded-lg overflow-hidden shadow-card">
        <header className="px-6 py-4 border-b border-border-subtle">
          <h2 className="font-display font-semibold text-xl text-ink-primary">Users</h2>
        </header>
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-ink-muted uppercase text-xs tracking-wide">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Name</th>
              <th className="text-left px-6 py-3 font-medium">Email</th>
              <th className="text-left px-6 py-3 font-medium">Items</th>
              <th className="text-left px-6 py-3 font-medium">Role</th>
              <th className="text-right px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {demoUsers.map((u) => (
              <tr key={u.email} className="border-t border-border-subtle">
                <td className="px-6 py-4 font-medium text-ink-primary">{u.name}</td>
                <td className="px-6 py-4 text-ink-muted">{u.email}</td>
                <td className="px-6 py-4 text-ink-secondary">{u.items}</td>
                <td className="px-6 py-4 text-ink-secondary">{u.role}</td>
                <td className="px-6 py-4 text-right">
                  <Badge tone={u.status === 'Flagged' ? 'bad' : 'good'}>{u.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
