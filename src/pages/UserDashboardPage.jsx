import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  PlusCircle,
  Sparkles,
  Inbox,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  MapPin,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ItemCard from '../components/ItemCard';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [claims, setClaims] = useState([]);
  const [activeTab, setActiveTab] = useState('lost');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [lostRes, foundRes, matchRes, claimRes] = await Promise.all([
          api.get('/lost-items/my-items/'),
          api.get('/found-items/my-items/'),
          api.get('/matches/'),
          api.get('/claims/'),
        ]);

        setLostItems(lostRes.data.results || lostRes.data || []);
        setFoundItems(foundRes.data.results || foundRes.data || []);
        setMatches(matchRes.data.results || matchRes.data || []);
        setClaims(claimRes.data.results || claimRes.data || []);
      } catch (err) {
        console.error("Failed to load user dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Greeting & Action Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {user?.first_name || user?.username}!
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
              {user?.role === 'ADMINISTRATOR' ? 'Administrator' : user?.role === 'ITEM_FINDER' ? 'Item Finder' : 'Member'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitor your reported items, AI similarity alerts, and ownership claims in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/report-lost"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Lost</span>
          </Link>
          <Link
            to="/report-found"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Found</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">My Lost Reports</div>
          <div className="text-3xl font-extrabold text-rose-600 mt-2">{lostItems.length}</div>
          <p className="text-[10px] text-slate-400 mt-1">Active lost listings</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">My Found Reports</div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">{foundItems.length}</div>
          <p className="text-[10px] text-slate-400 mt-1">Safeguarded items</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">AI Match Alerts</div>
          <div className="text-3xl font-extrabold text-brand-600 mt-2">{matches.length}</div>
          <p className="text-[10px] text-slate-400 mt-1">CLIP image similarity matches</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold">Ownership Claims</div>
          <div className="text-3xl font-extrabold text-purple-600 mt-2">{claims.length}</div>
          <p className="text-[10px] text-slate-400 mt-1">Verification requests</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('lost')}
            className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'lost'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>My Lost Belongings</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">{lostItems.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('found')}
            className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'found'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>My Found Reports</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600">{foundItems.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'matches'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Match Results</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-brand-50 text-brand-700">{matches.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'claims'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Active Claims</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-50 text-purple-700">{claims.length}</span>
          </button>
        </nav>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div>
          {/* Lost items */}
          {activeTab === 'lost' && (
            lostItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lostItems.map((item) => (
                  <ItemCard key={item.id} item={item} type="lost" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                <p className="text-sm text-slate-500">You haven't reported any lost belongings yet.</p>
                <Link
                  to="/report-lost"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
                >
                  <PlusCircle className="w-4 h-4" />
                  Report a Lost Item
                </Link>
              </div>
            )
          )}

          {/* Found items */}
          {activeTab === 'found' && (
            foundItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {foundItems.map((item) => (
                  <ItemCard key={item.id} item={item} type="found" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                <p className="text-sm text-slate-500">You haven't reported finding any belongings yet.</p>
                <Link
                  to="/report-found"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  <PlusCircle className="w-4 h-4" />
                  Report a Found Item
                </Link>
              </div>
            )
          )}

          {/* AI Matches */}
          {activeTab === 'matches' && (
            matches.length > 0 ? (
              <div className="space-y-4">
                {matches.map((m) => (
                  <div
                    key={m.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            m.match_label === 'HIGH'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.match_label === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {m.match_label} SIMILARITY ({m.score_percentage}%)
                        </span>
                        <span className="text-xs text-slate-400">Match Record #{m.id}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">
                        {m.lost_item?.item_name} <span className="text-slate-400 font-normal">matched with</span> {m.found_item?.item_name}
                      </h4>

                      <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-1">
                        <span>📷 Image Sim: {Math.round(m.image_similarity * 100)}%</span>
                        <span>🏷️ Category: {Math.round(m.category_similarity * 100)}%</span>
                        <span>🎨 Colour: {Math.round(m.color_similarity * 100)}%</span>
                        {m.distance_km !== null && <span>📍 Proximity: ~{m.distance_km} km</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/items/found/${m.found_item?.id}`}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        Inspect Found Item
                      </Link>
                      <Link
                        to={`/claims?found_item_id=${m.found_item?.id}&lost_item_id=${m.lost_item?.id}`}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
                      >
                        Claim Item
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
                <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No Potential Matches Identified Yet</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Our CLIP vision engine automatically compares every uploaded photograph. You will receive an immediate in-app and email alert when a match is found.
                </p>
              </div>
            )
          )}

          {/* Claims */}
          {activeTab === 'claims' && (
            claims.length > 0 ? (
              <div className="space-y-4">
                {claims.map((claim) => (
                  <div key={claim.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Claim #{claim.id}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          claim.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : claim.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Item: {claim.found_item_details?.item_name || `Found Item #${claim.found_item}`}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        <strong>My statement:</strong> {claim.claim_description}
                      </p>
                      {claim.finder_response && (
                        <p className="text-xs text-slate-700 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <strong>Finder response:</strong> {claim.finder_response}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 text-xs text-slate-500">
                You currently have no active ownership claims.
              </div>
            )
          )}
        </div>
      )}

    </div>
  );
};

export default UserDashboardPage;
