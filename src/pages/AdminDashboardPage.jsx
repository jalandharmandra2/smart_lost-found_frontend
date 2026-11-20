import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Search,
  Sparkles,
  Inbox,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  UserCheck,
  UserX,
  Layers,
  Activity
} from 'lucide-react';
import api from '../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        api.get('/dashboard/stats/'),
        api.get('/dashboard/users/'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleUserActive = async (userId, currentActive) => {
    try {
      setActionLoading(true);
      await api.patch(`/dashboard/users/${userId}/`, {
        is_active: !currentActive,
      });
      setStatusMessage(`User #${userId} status updated.`);
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to update user.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      setActionLoading(true);
      await api.patch(`/dashboard/users/${userId}/`, {
        role: newRole,
      });
      setStatusMessage(`User #${userId} role changed to ${newRole}.`);
      await fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Failed to update role.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const overview = stats?.overview || {};
  const charts = stats?.charts || {};
  const recent = stats?.recent_activity || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-black">Platform Administration Console</h1>
          </div>
          <p className="text-xs text-slate-300">
            System metrics, user privileges, content moderation, AI match monitoring, and claim disputes.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 self-start md:self-auto transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Statistical Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Total Users</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{overview.total_users || 0}</div>
          <p className="text-[10px] text-slate-400 mt-1">Registered members</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-rose-600">Lost Reports</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-2">{overview.total_lost_items || 0}</div>
          <p className="text-[10px] text-slate-400 mt-1">Active lost listings</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600">Found Reports</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-2">{overview.total_found_items || 0}</div>
          <p className="text-[10px] text-slate-400 mt-1">Custody holdings</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-brand-600">AI Matches</div>
          <div className="text-2xl font-extrabold text-brand-600 mt-2">{overview.total_matches || 0}</div>
          <p className="text-[10px] text-amber-600 font-semibold mt-1">
            {overview.high_matches || 0} High Confidence
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-purple-600">Recovered Items</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-2">{overview.recovered_items || 0}</div>
          <p className="text-[10px] text-slate-400 mt-1">Successful returns</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Activity & Metrics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          User Management ({users.length})
        </button>
      </div>

      {/* Tab: Overview & Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Claims Status Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Claims</span>
              <p className="text-2xl font-black mt-1">{overview.pending_claims || 0}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <span className="text-xs font-bold uppercase tracking-wider">Approved Claims</span>
              <p className="text-2xl font-black mt-1">{overview.approved_claims || 0}</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
              <span className="text-xs font-bold uppercase tracking-wider">Rejected Claims</span>
              <p className="text-2xl font-black mt-1">{overview.rejected_claims || 0}</p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900">
              <span className="text-xs font-bold uppercase tracking-wider">Disputed Claims</span>
              <p className="text-2xl font-black mt-1">{overview.disputed_claims || 0}</p>
            </div>
          </div>

          {/* Recent Claims & Matches Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Claims */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-purple-600" />
                <span>Recent Ownership Claims</span>
              </h3>

              <div className="divide-y divide-slate-100">
                {recent.claims?.length > 0 ? (
                  recent.claims.map((c) => (
                    <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800">
                          {c.claimant__username} <span className="font-normal text-slate-400">claimed</span> {c.found_item__item_name}
                        </div>
                        <span className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                        {c.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4">No recent claims submitted.</p>
                )}
              </div>
            </div>

            {/* Recent Matches */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Recent AI Image Matches</span>
              </h3>

              <div className="divide-y divide-slate-100">
                {recent.matches?.length > 0 ? (
                  recent.matches.map((m) => (
                    <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800">
                          {m.lost_item__item_name} ↔ {m.found_item__item_name}
                        </div>
                        <span className="text-[10px] text-slate-400">Score: {Math.round(m.total_score * 100)}%</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          m.match_label === 'HIGH' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {m.match_label}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4">No recent AI matches.</p>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Registered Accounts Management</h2>
              <p className="text-xs text-slate-500">Activate, deactivate, or assign administrative privileges</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              {users.length} Users Total
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Joined Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {u.username}
                      {u.is_staff && (
                        <span className="ml-1.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded text-[9px] font-bold">
                          STAFF
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{u.email || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className="px-2 py-1 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"
                      >
                        <option value="GENERAL_USER">General User</option>
                        <option value="ITEM_FINDER">Item Finder</option>
                        <option value="ADMINISTRATOR">Administrator</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleUserActive(u.id, u.is_active)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                          u.is_active
                            ? 'text-rose-600 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
