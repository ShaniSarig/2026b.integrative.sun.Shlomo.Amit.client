import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/closetApi.js';
import Badge from '../../components/ui/Badge.jsx';
import Metric from '../../components/ui/Metric.jsx';
import { Users, AlertTriangle, Activity, Settings, BarChart2, Shield, Trash2, Save, RefreshCw, Zap } from 'lucide-react';

export default function AdminMobile({ user, config, onConfigChange }) {
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Configuration fields
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

  // Live telemetry
  const [usersList, setUsersList] = useState([]);
  const [commandsList, setCommandsList] = useState([]);
  const [objectsList, setObjectsList] = useState([]);

  // Grok health
  const [grokStatus, setGrokStatus] = useState(null);
  const [grokChecking, setGrokChecking] = useState(false);

  const auth = {
    userSystemID: user?.systemId || 'ambient_invisible_intelligence',
    userEmail: user?.email || '',
    userPassword: user?.password || '1234',
  };

  useEffect(() => {
    if (user) {
      loadTelemetryData();
      if (activeTab === 'ai-health') checkGrokStatus();
    }
  }, [user, activeTab]);

  const checkGrokStatus = async () => {
    setGrokChecking(true);
    try {
      const result = await adminApi.getGrokStatus(auth);
      setGrokStatus(result);
    } catch (err) {
      setGrokStatus({ status: 'network_error', message: err?.message || 'Failed to reach backend', model: 'grok-beta', checkedAt: new Date().toISOString() });
    } finally {
      setGrokChecking(false);
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
      setMessage({ type: 'success', text: 'Settings updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save configuration' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (targetUser, newRole) => {
    try {
      const targetSystemId = targetUser.userId.systemID || targetUser.userId.systemId;
      await adminApi.updateUserRole(auth, targetSystemId, targetUser.userId.email, newRole);
      loadTelemetryData();
      setMessage({ type: 'success', text: 'User role updated!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Role update failed' });
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (!window.confirm(`Delete ${targetUser.userId.email}?`)) return;
    try {
      const targetSystemId = targetUser.userId.systemID || targetUser.userId.systemId;
      await adminApi.deleteUser(auth, targetSystemId, targetUser.userId.email);
      loadTelemetryData();
      setMessage({ type: 'success', text: 'User deleted!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Delete failed' });
    }
  };

  return (
    <div className="px-4 py-4 flex flex-col gap-5 pb-20">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink-primary">Admin Panel</h1>
          <p className="text-xs text-ink-muted">Configure and manage the system.</p>
        </div>
        <button
          onClick={loadTelemetryData}
          disabled={loading}
          className="p-2 border border-border-subtle bg-white rounded-md text-ink-primary shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      {message && (
        <div className={`p-3 rounded-md text-xs border ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-border-subtle gap-2 text-xs">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 pb-3 text-center border-b-2 font-medium transition-all flex justify-center items-center gap-1.5 ${
            activeTab === 'settings' ? 'border-primary-500 text-primary-600 font-semibold' : 'border-transparent text-ink-muted'
          }`}
        >
          <Settings size={14} />
          Settings
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 pb-3 text-center border-b-2 font-medium transition-all flex justify-center items-center gap-1.5 ${
            activeTab === 'users' ? 'border-primary-500 text-primary-600 font-semibold' : 'border-transparent text-ink-muted'
          }`}
        >
          <Shield size={14} />
          Users
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 pb-3 text-center border-b-2 font-medium transition-all flex justify-center items-center gap-1.5 ${
            activeTab === 'analytics' ? 'border-primary-500 text-primary-600 font-semibold' : 'border-transparent text-ink-muted'
          }`}
        >
          <BarChart2 size={14} />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('ai-health')}
          className={`flex-1 pb-3 text-center border-b-2 font-medium transition-all flex justify-center items-center gap-1.5 ${
            activeTab === 'ai-health' ? 'border-primary-500 text-primary-600 font-semibold' : 'border-transparent text-ink-muted'
          }`}
        >
          <Zap size={14} />
          AI
        </button>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveConfig} className="bg-white border border-border-subtle rounded-md p-4 flex flex-col gap-4 shadow-sm text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-ink-secondary">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="px-3 py-1.5 border border-border-subtle rounded text-xs bg-canvas text-ink-primary"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-ink-secondary">Brand Logo Icon (Emoji / URL)</label>
            <input
              type="text"
              value={brandIcon}
              onChange={(e) => setBrandIcon(e.target.value)}
              className="px-3 py-1.5 border border-border-subtle rounded text-xs bg-canvas text-ink-primary"
              required
            />
          </div>
          
          <div className="border-t border-border-subtle my-2 pt-2">
            <p className="font-bold text-ink-primary mb-2">Error Overrides</p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-ink-muted">Login Failure</label>
                <textarea
                  value={errorLogin}
                  onChange={(e) => setErrorLogin(e.target.value)}
                  rows={2}
                  className="px-2 py-1 border border-border-subtle rounded bg-canvas text-ink-primary"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-ink-muted">Invalid Registration Email</label>
                <textarea
                  value={errorRegister}
                  onChange={(e) => setErrorRegister(e.target.value)}
                  rows={2}
                  className="px-2 py-1 border border-border-subtle rounded bg-canvas text-ink-primary"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-ink-muted">Conflict (User Exists)</label>
                <textarea
                  value={errorConflict}
                  onChange={(e) => setErrorConflict(e.target.value)}
                  rows={2}
                  className="px-2 py-1 border border-border-subtle rounded bg-canvas text-ink-primary"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-ink-muted">Unauthorized (401)</label>
                <textarea
                  value={errorUnauthorized}
                  onChange={(e) => setErrorUnauthorized(e.target.value)}
                  rows={2}
                  className="px-2 py-1 border border-border-subtle rounded bg-canvas text-ink-primary"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-ink-muted">Forbidden (403)</label>
                <textarea
                  value={errorForbidden}
                  onChange={(e) => setErrorForbidden(e.target.value)}
                  rows={2}
                  className="px-2 py-1 border border-border-subtle rounded bg-canvas text-ink-primary"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-ink-muted">Not Found (404)</label>
                <textarea
                  value={errorNotFound}
                  onChange={(e) => setErrorNotFound(e.target.value)}
                  rows={2}
                  className="px-2 py-1 border border-border-subtle rounded bg-canvas text-ink-primary"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-ink-muted">Bad Request (400)</label>
                <textarea
                  value={errorBadRequest}
                  onChange={(e) => setErrorBadRequest(e.target.value)}
                  rows={2}
                  className="px-2 py-1 border border-border-subtle rounded bg-canvas text-ink-primary"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-ink-muted">Empty Wardrobe Recommendation</label>
                <textarea
                  value={errorNoOutfits}
                  onChange={(e) => setErrorNoOutfits(e.target.value)}
                  rows={2}
                  className="px-2 py-1 border border-border-subtle rounded bg-canvas text-ink-primary"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-ink-muted">Network Offline</label>
                <textarea
                  value={errorNetwork}
                  onChange={(e) => setErrorNetwork(e.target.value)}
                  rows={2}
                  className="px-2 py-1 border border-border-subtle rounded bg-canvas text-ink-primary"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-ink-muted">Internal Server Fault (500)</label>
                <textarea
                  value={errorServer}
                  onChange={(e) => setErrorServer(e.target.value)}
                  rows={2}
                  className="px-2 py-1 border border-border-subtle rounded bg-canvas text-ink-primary"
                  required
                />
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded font-semibold text-sm shadow-sm"
          >
            <Save size={16} />
            Save Settings
          </button>
        </form>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="flex flex-col gap-3">
          {usersList.length === 0 ? (
            <div className="text-center py-6 text-sm text-ink-muted bg-white border border-border-subtle rounded">No users found.</div>
          ) : (
            usersList.map((u) => {
              const emailVal = u.userId?.email || u.email;
              return (
                <div key={emailVal} className="bg-white border border-border-subtle rounded-md p-4 flex flex-col gap-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-ink-primary">{u.username || u.name}</p>
                      <p className="text-xs text-ink-muted truncate max-w-[200px]">{emailVal}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(u)}
                      className="text-red-600 p-1.5 rounded hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2 border-border-subtle">
                    <span className="text-xs text-ink-muted">Role:</span>
                    <select
                      value={u.role}
                      onChange={(e) => handleUpdateRole(u, e.target.value)}
                      className="bg-canvas border border-border-subtle rounded px-2 py-1 text-xs"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="OPERATOR">OPERATOR</option>
                      <option value="END_USER">END_USER</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* AI Health Tab */}
      {activeTab === 'ai-health' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-border-subtle rounded-md p-4 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-base text-ink-primary flex items-center gap-2">
                <Zap size={16} className="text-primary-500" />
                Grok AI Health
              </h2>
              <button
                onClick={checkGrokStatus}
                disabled={grokChecking}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs font-semibold disabled:opacity-50"
              >
                <RefreshCw size={12} className={grokChecking ? 'animate-spin' : ''} />
                {grokChecking ? 'Checking…' : 'Check Now'}
              </button>
            </div>

            {!grokStatus && !grokChecking && (
              <p className="text-xs text-ink-muted text-center py-4">Tap "Check Now" to test the Grok API.</p>
            )}

            {grokChecking && (
              <div className="flex items-center justify-center py-6 gap-2 text-ink-muted">
                <RefreshCw size={16} className="animate-spin text-primary-500" />
                <span className="text-xs">Pinging Grok API…</span>
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
                <div className="flex flex-col gap-3">
                  <div className={`flex items-start gap-3 p-3 rounded-md border ${meta.bg} ${meta.border}`}>
                    <span className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${meta.dot} ${grokStatus.status === 'ok' ? 'animate-pulse' : ''}`} />
                    <div>
                      <p className={`font-semibold text-sm ${meta.text}`}>{meta.label}</p>
                      <p className={`text-xs mt-0.5 ${meta.text} opacity-80`}>{grokStatus.message}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-canvas border border-border-subtle rounded p-3 flex flex-col gap-0.5">
                      <span className="text-ink-muted uppercase tracking-wide text-[10px]">Model</span>
                      <span className="font-bold text-ink-primary font-mono">{grokStatus.model || '—'}</span>
                    </div>
                    <div className="bg-canvas border border-border-subtle rounded p-3 flex flex-col gap-0.5">
                      <span className="text-ink-muted uppercase tracking-wide text-[10px]">Latency</span>
                      <span className="font-bold text-ink-primary">{grokStatus.latencyMs != null ? `${grokStatus.latencyMs}ms` : '—'}</span>
                    </div>
                  </div>

                  {grokStatus.tokenUsage && (
                    <div className="bg-canvas border border-border-subtle rounded p-3 flex flex-col gap-2">
                      <p className="text-[10px] font-semibold text-ink-muted uppercase tracking-wide">Token Usage (probe)</p>
                      <div className="flex gap-4 text-xs">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-ink-muted">Prompt</span>
                          <span className="font-bold text-ink-primary">{grokStatus.tokenUsage.promptTokens ?? '—'}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-ink-muted">Completion</span>
                          <span className="font-bold text-ink-primary">{grokStatus.tokenUsage.completionTokens ?? '—'}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-ink-muted">Total</span>
                          <span className="font-bold text-primary-600">{grokStatus.tokenUsage.totalTokens ?? '—'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-ink-muted">
                    Checked at {grokStatus.checkedAt ? new Date(grokStatus.checkedAt).toLocaleTimeString() : '—'}. Credit balance visible at console.x.ai.
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Metric icon={Users} label="Users" value={usersList.length.toString()} />
            <Metric icon={Activity} label="Logs" value={commandsList.length.toString()} />
          </div>
          <div className="bg-white border border-border-subtle rounded p-3 flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-ink-primary uppercase tracking-wide">System Commands Log</h3>
            <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto">
              {commandsList.length === 0 ? (
                <p className="text-xs text-ink-muted text-center py-4">No records found.</p>
              ) : (
                commandsList.slice(0, 20).map((c, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] border-b pb-1 border-cream-100">
                    <span className="font-semibold text-ink-primary">{c.commandName}</span>
                    <span className="text-ink-muted truncate max-w-[100px]">{c.invokedBy?.userId?.email || c.userId}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
