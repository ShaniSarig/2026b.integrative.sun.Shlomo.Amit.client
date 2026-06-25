import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/closetApi.js';
import Badge from '../../components/ui/Badge.jsx';
import Metric from '../../components/ui/Metric.jsx';
import { Users, AlertTriangle, Activity, Database, Settings, BarChart2, Shield, Trash2, Save, RefreshCw, Zap } from 'lucide-react';

export default function AdminDesktop({ user, config, onConfigChange }) {
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Brand config fields
  const [brandName, setBrandName] = useState(config?.brandName || '');
  const [brandIcon, setBrandIcon] = useState(config?.brandIcon || '');
  const [errorLogin, setErrorLogin] = useState(config?.errorLogin || '');
  const [errorRegister, setErrorRegister] = useState(config?.errorRegister || '');
  const [errorConflict, setErrorConflict] = useState(config?.errorConflict || '');
  const [errorUnauthorized, setErrorUnauthorized] = useState(config?.errorUnauthorized || '');
  const [errorForbidden, setErrorForbidden] = useState(config?.errorForbidden || '');
  const [errorNotFound, setErrorNotFound] = useState(config?.errorNotFound || '');
  const [errorBadRequest, setErrorBadRequest] = useState(config?.errorBadRequest || '');
  const [errorNoOutfits, setErrorNoOutfits] = useState(config?.errorNoOutfits || '');
  const [errorNetwork, setErrorNetwork] = useState(config?.errorNetwork || '');
  const [errorServer, setErrorServer] = useState(config?.errorServer || '');

  // Backend telemetry lists
  const [usersList, setUsersList] = useState([]);
  const [commandsList, setCommandsList] = useState([]);
  const [objectsList, setObjectsList] = useState([]);

  // Grok health
  const [grokStatus, setGrokStatus] = useState(null);
  const [grokChecking, setGrokChecking] = useState(false);

  // OpenAI health
  const [openAiStatus, setOpenAiStatus] = useState(null);
  const [openAiChecking, setOpenAiChecking] = useState(false);

  // Weather health
  const [weatherStatus, setWeatherStatus] = useState(null);
  const [weatherChecking, setWeatherChecking] = useState(false);

  // Auth queries helper
  const auth = {
    userSystemID: user?.systemId || 'ambient_invisible_intelligence',
    userEmail: user?.email || '',
    userPassword: user?.password || '1234',
  };

  useEffect(() => {
    if (user) {
      loadTelemetryData();
      if (activeTab === 'ai-health') { checkGrokStatus(); checkOpenAiStatus(); checkWeatherStatus(); }
    }
  }, [user, activeTab]);

  const checkGrokStatus = async () => {
    setGrokChecking(true);
    try {
      const result = await adminApi.getGrokStatus(auth);
      setGrokStatus(result);
    } catch (err) {
      setGrokStatus({ status: 'network_error', message: err?.message || 'Failed to reach backend', model: 'grok-3', checkedAt: new Date().toISOString() });
    } finally {
      setGrokChecking(false);
    }
  };

  const checkOpenAiStatus = async () => {
    setOpenAiChecking(true);
    try {
      const result = await adminApi.getOpenAiStatus(auth);
      setOpenAiStatus(result);
    } catch (err) {
      setOpenAiStatus({ status: 'network_error', message: err?.message || 'Failed to reach backend', model: 'gpt-4o', checkedAt: new Date().toISOString() });
    } finally {
      setOpenAiChecking(false);
    }
  };

  const checkWeatherStatus = async () => {
    setWeatherChecking(true);
    try {
      const result = await adminApi.getWeatherStatus(auth);
      setWeatherStatus(result);
    } catch (err) {
      setWeatherStatus({ status: 'network_error', message: err?.message || 'Failed to reach backend', checkedAt: new Date().toISOString() });
    } finally {
      setWeatherChecking(false);
    }
  };

  const loadTelemetryData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await adminApi.listUsers(auth, 0, 100);
        setUsersList(res || []);
      } else if (activeTab === 'analytics') {
        const [cmds, objs, usrs] = await Promise.all([
          adminApi.listCommands(auth, 0, 100).catch(() => []),
          adminApi.listObjects(auth, 0, 100).catch(() => []),
          adminApi.listUsers(auth, 0, 100).catch(() => []),
        ]);
        setCommandsList(cmds || []);
        setObjectsList(objs || []);
        setUsersList(usrs || []);
      }
    } catch (err) {
      console.error('Failed to load telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const updated = { 
        brandName, brandIcon, errorLogin, errorRegister, 
        errorConflict, errorUnauthorized, errorForbidden, 
        errorNotFound, errorBadRequest, errorNoOutfits, 
        errorNetwork, errorServer 
      };
      await adminApi.updateConfig(auth, updated);
      onConfigChange(updated);
      window.__brandConfig = updated;
      setMessage({ type: 'success', text: 'Brand settings and all error message rules updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err?.payload?.message || err?.message || 'Failed to save config' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (targetUser, newRole) => {
    try {
      const targetSystemId = targetUser.userId.systemID || targetUser.userId.systemId;
      await adminApi.updateUserRole(auth, targetSystemId, targetUser.userId.email, newRole);
      loadTelemetryData();
      setMessage({ type: 'success', text: `Role updated to ${newRole} for ${targetUser.userId.email}` });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update user role' });
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (!window.confirm(`Are you sure you want to delete user ${targetUser.userId.email}?`)) return;
    try {
      const targetSystemId = targetUser.userId.systemID || targetUser.userId.systemId;
      await adminApi.deleteUser(auth, targetSystemId, targetUser.userId.email);
      loadTelemetryData();
      setMessage({ type: 'success', text: 'User deleted successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete user' });
    }
  };

  const handlePurge = async (type) => {
    if (!window.confirm(`CRITICAL WARNING: Are you sure you want to delete ALL ${type}? This action is irreversible.`)) return;
    setLoading(true);
    try {
      if (type === 'commands') {
        await adminApi.deleteAllCommands(auth);
      } else if (type === 'users') {
        await adminApi.deleteAllUsers(auth);
      } else if (type === 'objects') {
        await adminApi.deleteAllObjects(auth);
      }
      setMessage({ type: 'success', text: `All ${type} purged successfully!` });
      loadTelemetryData();
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to purge ${type}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-10 py-10 max-w-[1400px] mx-auto flex flex-col gap-8">
      <header className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="font-display font-bold text-5xl text-ink-primary leading-tight">
            Admin Panel
          </h1>
          <p className="text-base text-ink-muted">
            Configure system messaging, user controls, and monitor platform activity.
          </p>
        </div>
        <button
          onClick={loadTelemetryData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-border-subtle bg-white rounded-md text-sm font-medium hover:bg-cream-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </header>

      {message && (
        <div className={`p-4 rounded-md border text-sm flex justify-between items-center ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="font-bold hover:opacity-75">×</button>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-border-subtle gap-6">
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'settings' ? 'border-primary-500 text-primary-600 font-semibold' : 'border-transparent text-ink-muted hover:text-ink-primary'
          }`}
        >
          <Settings size={16} />
          Brand & Messaging Settings
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'users' ? 'border-primary-500 text-primary-600 font-semibold' : 'border-transparent text-ink-muted hover:text-ink-primary'
          }`}
        >
          <Shield size={16} />
          User Management
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'analytics' ? 'border-primary-500 text-primary-600 font-semibold' : 'border-transparent text-ink-muted hover:text-ink-primary'
          }`}
        >
          <BarChart2 size={16} />
          Analytics & Logs
        </button>
        <button
          onClick={() => setActiveTab('ai-health')}
          className={`pb-4 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'ai-health' ? 'border-primary-500 text-primary-600 font-semibold' : 'border-transparent text-ink-muted hover:text-ink-primary'
          }`}
        >
          <Zap size={16} />
          AI Health
        </button>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveConfig} className="bg-white border border-border-subtle rounded-lg shadow-card p-8 flex flex-col gap-6">
          <h2 className="font-display font-semibold text-2xl text-ink-primary border-b pb-4">
            Branding Configuration
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-ink-secondary">Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. The Closet Whisperer"
                className="px-4 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-canvas text-ink-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-ink-secondary">Brand Logo Icon (Emoji or Image URL)</label>
              <input
                type="text"
                value={brandIcon}
                onChange={(e) => setBrandIcon(e.target.value)}
                placeholder="e.g. ✨ or /app-logo.png"
                className="px-4 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-canvas text-ink-primary"
                required
              />
            </div>
          </div>

          <h2 className="font-display font-semibold text-2xl text-ink-primary border-b pb-4 mt-4">
            Custom User Error Messages
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-ink-secondary">Login Failure Message (401)</label>
              <textarea
                value={errorLogin}
                onChange={(e) => setErrorLogin(e.target.value)}
                placeholder="Message shown when credentials fail"
                rows={2}
                className="px-4 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-canvas text-ink-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-ink-secondary">Registration Failure Message (400 - Invalid Email)</label>
              <textarea
                value={errorRegister}
                onChange={(e) => setErrorRegister(e.target.value)}
                placeholder="Message shown when registration email is invalid"
                rows={2}
                className="px-4 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-canvas text-ink-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-ink-secondary">User Conflict Message (409 - User Already Exists)</label>
              <textarea
                value={errorConflict}
                onChange={(e) => setErrorConflict(e.target.value)}
                placeholder="Message shown when email is already registered"
                rows={2}
                className="px-4 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-canvas text-ink-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-ink-secondary">Unauthorized Action Message (401 - Session Expired)</label>
              <textarea
                value={errorUnauthorized}
                onChange={(e) => setErrorUnauthorized(e.target.value)}
                placeholder="Message shown for unauthenticated actions"
                rows={2}
                className="px-4 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-canvas text-ink-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-ink-secondary">Forbidden Action Message (403 - Role Restrict)</label>
              <textarea
                value={errorForbidden}
                onChange={(e) => setErrorForbidden(e.target.value)}
                placeholder="Message shown when user lacks correct roles"
                rows={2}
                className="px-4 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-canvas text-ink-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-ink-secondary">Resource Not Found Message (404)</label>
              <textarea
                value={errorNotFound}
                onChange={(e) => setErrorNotFound(e.target.value)}
                placeholder="Message shown when a resource doesn't exist"
                rows={2}
                className="px-4 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-canvas text-ink-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-ink-secondary">Bad Request Input Message (400 - Validation Fault)</label>
              <textarea
                value={errorBadRequest}
                onChange={(e) => setErrorBadRequest(e.target.value)}
                placeholder="Message shown for general input constraints"
                rows={2}
                className="px-4 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-canvas text-ink-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-ink-secondary">Empty Wardrobe Message (No Clothes Found)</label>
              <textarea
                value={errorNoOutfits}
                onChange={(e) => setErrorNoOutfits(e.target.value)}
                placeholder="Message shown when outfit recommendations cannot match items"
                rows={2}
                className="px-4 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-canvas text-ink-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-ink-secondary">Network Disconnection Message (Offline)</label>
              <textarea
                value={errorNetwork}
                onChange={(e) => setErrorNetwork(e.target.value)}
                placeholder="Message shown when backend API is offline"
                rows={2}
                className="px-4 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-canvas text-ink-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-ink-secondary">Internal Server Fault Message (500)</label>
              <textarea
                value={errorServer}
                onChange={(e) => setErrorServer(e.target.value)}
                placeholder="Fallback message for internal systems crash"
                rows={2}
                className="px-4 py-2 border border-border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-canvas text-ink-primary"
                required
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-semibold transition-all shadow-md disabled:opacity-50"
            >
              <Save size={18} />
              Save Configuration
            </button>
          </div>
        </form>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <section className="bg-white border border-border-subtle rounded-lg overflow-hidden shadow-card">
          <header className="px-6 py-5 border-b border-border-subtle flex justify-between items-center bg-cream-50">
            <h2 className="font-display font-semibold text-xl text-ink-primary">Registered Users ({usersList.length})</h2>
            <button
              onClick={() => handlePurge('users')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-red-200 text-red-700 hover:bg-red-50 bg-white rounded-md transition-all shadow-sm"
            >
              <Trash2 size={16} />
              Purge All Users
            </button>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-100 text-ink-muted uppercase text-xs tracking-wide border-b border-border-subtle">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">Username</th>
                  <th className="text-left px-6 py-4 font-medium">Email</th>
                  <th className="text-left px-6 py-4 font-medium">System ID</th>
                  <th className="text-left px-6 py-4 font-medium">Role</th>
                  <th className="text-right px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-ink-muted">No users found. Try registering some users.</td>
                  </tr>
                ) : (
                  usersList.map((u) => {
                    const emailVal = u.userId?.email || u.email;
                    const sysIdVal = u.userId?.systemID || u.userId?.systemId || u.systemId;
                    return (
                      <tr key={emailVal} className="border-t border-border-subtle hover:bg-cream-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-ink-primary">{u.username || u.name}</td>
                        <td className="px-6 py-4 text-ink-muted">{emailVal}</td>
                        <td className="px-6 py-4 text-ink-secondary">{sysIdVal}</td>
                        <td className="px-6 py-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u, e.target.value)}
                            className="bg-canvas border border-border-subtle rounded px-2 py-1 text-xs focus:ring-1 focus:ring-primary-500 focus:outline-none"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="OPERATOR">OPERATOR</option>
                            <option value="END_USER">END_USER</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-all inline-flex items-center"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* AI Health Tab */}
      {activeTab === 'ai-health' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-border-subtle rounded-lg shadow-card p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="font-display font-semibold text-2xl text-ink-primary flex items-center gap-2">
                  <Zap size={22} className="text-primary-500" />
                  Grok AI Integration Health
                </h2>
                <p className="text-sm text-ink-muted mt-1">Live connectivity check against the xAI Grok API</p>
              </div>
              <button
                onClick={checkGrokStatus}
                disabled={grokChecking}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-semibold shadow-sm disabled:opacity-50 transition-all"
              >
                <RefreshCw size={16} className={grokChecking ? 'animate-spin' : ''} />
                {grokChecking ? 'Checking…' : 'Run Health Check'}
              </button>
            </div>

            {!grokStatus && !grokChecking && (
              <p className="text-sm text-ink-muted text-center py-8">Click "Run Health Check" to test the Grok API connection.</p>
            )}

            {grokChecking && (
              <div className="flex items-center justify-center py-12 gap-3 text-ink-muted">
                <RefreshCw size={20} className="animate-spin text-primary-500" />
                <span className="text-sm">Pinging Grok API…</span>
              </div>
            )}

            {grokStatus && !grokChecking && (() => {
              const statusMeta = {
                ok:             { label: 'Operational',    bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800',  dot: 'bg-green-500'  },
                not_configured: { label: 'Not Configured', bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-700',   dot: 'bg-gray-400'   },
                invalid_key:    { label: 'Invalid Key',    bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    dot: 'bg-red-500'    },
                no_credits:     { label: 'No Credits',     bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-800',  dot: 'bg-amber-500'  },
                rate_limited:   { label: 'Rate Limited',   bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', dot: 'bg-yellow-500' },
                network_error:  { label: 'Network Error',  bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    dot: 'bg-red-500'    },
                server_error:   { label: 'Server Error',   bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', dot: 'bg-orange-500' },
              };
              const meta = statusMeta[grokStatus.status] || statusMeta.server_error;
              return (
                <div className="flex flex-col gap-6">
                  {/* Status Banner */}
                  <div className={`flex items-start gap-4 p-5 rounded-lg border ${meta.bg} ${meta.border}`}>
                    <span className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${meta.dot} ${grokStatus.status === 'ok' ? 'animate-pulse' : ''}`} />
                    <div>
                      <p className={`font-semibold text-base ${meta.text}`}>{meta.label}</p>
                      <p className={`text-sm mt-0.5 ${meta.text} opacity-80`}>{grokStatus.message}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-canvas border border-border-subtle rounded-lg p-5 flex flex-col gap-1">
                      <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Model</span>
                      <span className="text-lg font-bold text-ink-primary font-mono">{grokStatus.model || '—'}</span>
                    </div>
                    <div className="bg-canvas border border-border-subtle rounded-lg p-5 flex flex-col gap-1">
                      <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Latency</span>
                      <span className="text-lg font-bold text-ink-primary">
                        {grokStatus.latencyMs != null ? `${grokStatus.latencyMs} ms` : '—'}
                      </span>
                    </div>
                    <div className="bg-canvas border border-border-subtle rounded-lg p-5 flex flex-col gap-1">
                      <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Last Checked</span>
                      <span className="text-sm font-medium text-ink-primary">
                        {grokStatus.checkedAt ? new Date(grokStatus.checkedAt).toLocaleTimeString() : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Token Usage */}
                  {grokStatus.tokenUsage && (
                    <div className="border border-border-subtle rounded-lg overflow-hidden">
                      <div className="px-6 py-3 bg-cream-50 border-b border-border-subtle">
                        <h3 className="font-semibold text-sm text-ink-primary">Token Usage (health-check probe)</h3>
                      </div>
                      <div className="grid grid-cols-3 divide-x divide-border-subtle">
                        <div className="px-6 py-5 flex flex-col gap-1">
                          <span className="text-xs text-ink-muted uppercase tracking-wide">Prompt Tokens</span>
                          <span className="text-2xl font-bold text-ink-primary">{grokStatus.tokenUsage.promptTokens ?? '—'}</span>
                        </div>
                        <div className="px-6 py-5 flex flex-col gap-1">
                          <span className="text-xs text-ink-muted uppercase tracking-wide">Completion Tokens</span>
                          <span className="text-2xl font-bold text-ink-primary">{grokStatus.tokenUsage.completionTokens ?? '—'}</span>
                        </div>
                        <div className="px-6 py-5 flex flex-col gap-1">
                          <span className="text-xs text-ink-muted uppercase tracking-wide">Total Tokens</span>
                          <span className="text-2xl font-bold text-primary-600">{grokStatus.tokenUsage.totalTokens ?? '—'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-ink-muted">
                    Token credit balance is managed via the <span className="font-semibold">xAI Console</span> at console.x.ai. The figures above reflect usage from this health-check probe only.
                  </p>
                </div>
              );
            })()}
          </div>

          {/* OpenAI Card */}
          <div className="bg-white border border-border-subtle rounded-lg shadow-card p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="font-display font-semibold text-2xl text-ink-primary flex items-center gap-2">
                  <Zap size={22} className="text-emerald-500" />
                  OpenAI Vision Integration Health
                </h2>
                <p className="text-sm text-ink-muted mt-1">Live connectivity check against the OpenAI GPT-4o Vision API</p>
              </div>
              <button
                onClick={checkOpenAiStatus}
                disabled={openAiChecking}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-semibold shadow-sm disabled:opacity-50 transition-all"
              >
                <RefreshCw size={16} className={openAiChecking ? 'animate-spin' : ''} />
                {openAiChecking ? 'Checking…' : 'Run Health Check'}
              </button>
            </div>

            {!openAiStatus && !openAiChecking && (
              <p className="text-sm text-ink-muted text-center py-8">Click "Run Health Check" to test the OpenAI API connection.</p>
            )}

            {openAiChecking && (
              <div className="flex items-center justify-center py-12 gap-3 text-ink-muted">
                <RefreshCw size={20} className="animate-spin text-emerald-500" />
                <span className="text-sm">Pinging OpenAI API…</span>
              </div>
            )}

            {openAiStatus && !openAiChecking && (() => {
              const statusMeta = {
                ok:             { label: 'Operational',    bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800',  dot: 'bg-green-500'  },
                not_configured: { label: 'Not Configured', bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-700',   dot: 'bg-gray-400'   },
                invalid_key:    { label: 'Invalid Key',    bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    dot: 'bg-red-500'    },
                rate_limited:   { label: 'Rate Limited',   bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', dot: 'bg-yellow-500' },
                network_error:  { label: 'Network Error',  bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    dot: 'bg-red-500'    },
                server_error:   { label: 'Server Error',   bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', dot: 'bg-orange-500' },
              };
              const meta = statusMeta[openAiStatus.status] || statusMeta.server_error;
              return (
                <div className="flex flex-col gap-6">
                  <div className={`flex items-start gap-4 p-5 rounded-lg border ${meta.bg} ${meta.border}`}>
                    <span className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${meta.dot} ${openAiStatus.status === 'ok' ? 'animate-pulse' : ''}`} />
                    <div>
                      <p className={`font-semibold text-base ${meta.text}`}>{meta.label}</p>
                      <p className={`text-sm mt-0.5 ${meta.text} opacity-80`}>{openAiStatus.message}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-canvas border border-border-subtle rounded-lg p-5 flex flex-col gap-1">
                      <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Model</span>
                      <span className="text-lg font-bold text-ink-primary font-mono">{openAiStatus.model || '—'}</span>
                    </div>
                    <div className="bg-canvas border border-border-subtle rounded-lg p-5 flex flex-col gap-1">
                      <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Latency</span>
                      <span className="text-lg font-bold text-ink-primary">
                        {openAiStatus.latencyMs != null ? `${openAiStatus.latencyMs} ms` : '—'}
                      </span>
                    </div>
                    <div className="bg-canvas border border-border-subtle rounded-lg p-5 flex flex-col gap-1">
                      <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Last Checked</span>
                      <span className="text-sm font-medium text-ink-primary">
                        {openAiStatus.checkedAt ? new Date(openAiStatus.checkedAt).toLocaleTimeString() : '—'}
                      </span>
                    </div>
                  </div>

                  {openAiStatus.tokenUsage && (
                    <div className="border border-border-subtle rounded-lg overflow-hidden">
                      <div className="px-6 py-3 bg-cream-50 border-b border-border-subtle">
                        <h3 className="font-semibold text-sm text-ink-primary">Token Usage (health-check probe)</h3>
                      </div>
                      <div className="grid grid-cols-3 divide-x divide-border-subtle">
                        <div className="px-6 py-5 flex flex-col gap-1">
                          <span className="text-xs text-ink-muted uppercase tracking-wide">Prompt Tokens</span>
                          <span className="text-2xl font-bold text-ink-primary">{openAiStatus.tokenUsage.promptTokens ?? '—'}</span>
                        </div>
                        <div className="px-6 py-5 flex flex-col gap-1">
                          <span className="text-xs text-ink-muted uppercase tracking-wide">Completion Tokens</span>
                          <span className="text-2xl font-bold text-ink-primary">{openAiStatus.tokenUsage.completionTokens ?? '—'}</span>
                        </div>
                        <div className="px-6 py-5 flex flex-col gap-1">
                          <span className="text-xs text-ink-muted uppercase tracking-wide">Total Tokens</span>
                          <span className="text-2xl font-bold text-emerald-600">{openAiStatus.tokenUsage.totalTokens ?? '—'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-ink-muted">
                    Usage is billed via your <span className="font-semibold">OpenAI account</span> at platform.openai.com. The figures above reflect usage from this health-check probe only.
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Weather Card */}
          <div className="bg-white border border-border-subtle rounded-lg shadow-card p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="font-display font-semibold text-2xl text-ink-primary flex items-center gap-2">
                  <Zap size={22} className="text-sky-500" />
                  OpenWeatherMap Integration Health
                </h2>
                <p className="text-sm text-ink-muted mt-1">Live connectivity check against the OpenWeatherMap API</p>
              </div>
              <button
                onClick={checkWeatherStatus}
                disabled={weatherChecking}
                className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm font-semibold shadow-sm disabled:opacity-50 transition-all"
              >
                <RefreshCw size={16} className={weatherChecking ? 'animate-spin' : ''} />
                {weatherChecking ? 'Checking…' : 'Run Health Check'}
              </button>
            </div>

            {!weatherStatus && !weatherChecking && (
              <p className="text-sm text-ink-muted text-center py-8">Click "Run Health Check" to test the OpenWeatherMap API connection.</p>
            )}

            {weatherChecking && (
              <div className="flex items-center justify-center py-12 gap-3 text-ink-muted">
                <RefreshCw size={20} className="animate-spin text-sky-500" />
                <span className="text-sm">Pinging OpenWeatherMap API…</span>
              </div>
            )}

            {weatherStatus && !weatherChecking && (() => {
              const statusMeta = {
                ok:             { label: 'Operational',    bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800',  dot: 'bg-green-500'  },
                not_configured: { label: 'Not Configured', bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-700',   dot: 'bg-gray-400'   },
                invalid_key:    { label: 'Invalid Key',    bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    dot: 'bg-red-500'    },
                network_error:  { label: 'Network Error',  bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    dot: 'bg-red-500'    },
                server_error:   { label: 'Server Error',   bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', dot: 'bg-orange-500' },
              };
              const meta = statusMeta[weatherStatus.status] || statusMeta.server_error;
              return (
                <div className="flex flex-col gap-6">
                  <div className={`flex items-start gap-4 p-5 rounded-lg border ${meta.bg} ${meta.border}`}>
                    <span className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${meta.dot} ${weatherStatus.status === 'ok' ? 'animate-pulse' : ''}`} />
                    <div>
                      <p className={`font-semibold text-base ${meta.text}`}>{meta.label}</p>
                      <p className={`text-sm mt-0.5 ${meta.text} opacity-80`}>{weatherStatus.message}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-canvas border border-border-subtle rounded-lg p-5 flex flex-col gap-1">
                      <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Latency</span>
                      <span className="text-lg font-bold text-ink-primary">
                        {weatherStatus.latencyMs != null ? `${weatherStatus.latencyMs} ms` : '—'}
                      </span>
                    </div>
                    <div className="bg-canvas border border-border-subtle rounded-lg p-5 flex flex-col gap-1">
                      <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">Last Checked</span>
                      <span className="text-sm font-medium text-ink-primary">
                        {weatherStatus.checkedAt ? new Date(weatherStatus.checkedAt).toLocaleTimeString() : '—'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-ink-muted">
                    API key is configured via <span className="font-semibold">.env</span> (closetwhisperer.weather.api-key). Manage your quota at openweathermap.org.
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-4 gap-4">
            <Metric icon={Users} label="Total Users" value={usersList.length.toString()} detail="Registered accounts" />
            <Metric icon={Activity} label="Commands Audited" value={commandsList.length.toString()} detail="Logged events" />
            <Metric icon={Database} label="System Objects" value={objectsList.length.toString()} detail="Items and Outfits" />
            <Metric icon={AlertTriangle} label="Status Health" value="100%" detail="Backend online" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Commands list */}
            <section className="bg-white border border-border-subtle rounded-lg overflow-hidden shadow-card flex flex-col">
              <header className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-cream-50">
                <h3 className="font-display font-semibold text-lg text-ink-primary">Recent Commands ({commandsList.length})</h3>
                <button
                  onClick={() => handlePurge('commands')}
                  className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 border border-red-100 rounded transition-all"
                >
                  Clear Logs
                </button>
              </header>
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-cream-100 text-ink-muted uppercase tracking-wider sticky top-0 border-b border-border-subtle">
                    <tr>
                      <th className="text-left px-4 py-2">Name</th>
                      <th className="text-left px-4 py-2">User</th>
                      <th className="text-left px-4 py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commandsList.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-ink-muted">No commands recorded.</td>
                      </tr>
                    ) : (
                      commandsList.slice(0, 50).map((c, i) => (
                        <tr key={i} className="border-t border-border-subtle hover:bg-cream-50/50">
                          <td className="px-4 py-2 font-medium text-ink-primary truncate max-w-[120px]">{c.commandName}</td>
                          <td className="px-4 py-2 text-ink-muted truncate max-w-[100px]">{c.invokedBy?.userId?.email || c.userId}</td>
                          <td className="px-4 py-2 text-ink-secondary">{c.invocationTimestamp ? new Date(c.invocationTimestamp).toLocaleTimeString() : 'N/A'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Objects list */}
            <section className="bg-white border border-border-subtle rounded-lg overflow-hidden shadow-card flex flex-col">
              <header className="px-6 py-4 border-b border-border-subtle flex justify-between items-center bg-cream-50">
                <h3 className="font-display font-semibold text-lg text-ink-primary">Stored Objects ({objectsList.length})</h3>
                <button
                  onClick={() => handlePurge('objects')}
                  className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 border border-red-100 rounded transition-all"
                >
                  Clear Objects
                </button>
              </header>
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-cream-100 text-ink-muted uppercase tracking-wider sticky top-0 border-b border-border-subtle">
                    <tr>
                      <th className="text-left px-4 py-2">Type</th>
                      <th className="text-left px-4 py-2">Alias</th>
                      <th className="text-left px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {objectsList.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-ink-muted">No objects stored.</td>
                      </tr>
                    ) : (
                      objectsList.slice(0, 50).map((o, i) => (
                        <tr key={i} className="border-t border-border-subtle hover:bg-cream-50/50">
                          <td className="px-4 py-2 font-medium text-ink-primary">{o.type}</td>
                          <td className="px-4 py-2 text-ink-muted truncate max-w-[120px]">{o.alias}</td>
                          <td className="px-4 py-2 text-ink-secondary">
                            <Badge tone={o.status === 'dirty' || o.status === 'pending' ? 'bad' : 'good'}>
                              {o.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
