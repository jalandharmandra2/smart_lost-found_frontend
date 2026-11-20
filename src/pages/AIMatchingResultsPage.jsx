import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  RefreshCw,
  MapPin,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import api from '../services/api';

const AIMatchingResultsPage = () => {
  const [matches, setMatches] = useState([]);
  const [filterLabel, setFilterLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const params = filterLabel ? `?match_label=${filterLabel}` : '';
      const res = await api.get(`/matches/${params}`);
      setMatches(res.data.results || res.data || []);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [filterLabel]);

  const handleTriggerMatching = async () => {
    try {
      setRecalculating(true);
      setStatusMessage('');
      const res = await api.post('/matches/generate/', {});
      setStatusMessage(res.data.message || 'AI matching recalculated successfully.');
      await fetchMatches();
    } catch (err) {
      console.error(err);
      setStatusMessage('Recalculation failed. Please try again.');
    } finally {
      setRecalculating(false);
    }
  };

  const handleRespondMatch = async (matchId, actionStatus) => {
    try {
      await api.post(`/matches/${matchId}/respond/`, { status: actionStatus });
      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, status: actionStatus } : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title & AI Engine Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CLIP Vision Transformers + Haversine Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Image Similarity Matches</h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our neural matching model analyzes high-dimensional visual feature vectors extracted from uploaded photographs and blends them with location, color, category, and text signals.
          </p>
        </div>

        <button
          onClick={handleTriggerMatching}
          disabled={recalculating}
          className="px-5 py-3 rounded-xl font-bold text-xs bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 transition-all shrink-0 self-start md:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${recalculating ? 'animate-spin' : ''}`} />
          <span>{recalculating ? 'Inference Running...' : 'Recalculate AI Similarity'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 text-brand-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-brand-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterLabel('')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterLabel === '' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Matches
          </button>
          <button
            onClick={() => setFilterLabel('HIGH')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterLabel === 'HIGH' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            High Confidence (≥75%)
          </button>
          <button
            onClick={() => setFilterLabel('MEDIUM')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterLabel === 'MEDIUM' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Medium Confidence (50-74%)
          </button>
          <button
            onClick={() => setFilterLabel('LOW')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterLabel === 'LOW' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Low Confidence (30-49%)
          </button>
        </div>

        <span className="text-xs text-slate-500 font-semibold">{matches.length} pairwise records found</span>
      </div>

      {/* Pairwise Matches List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-white border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : matches.length > 0 ? (
        <div className="space-y-6">
          {matches.map((m) => {
            const lostImg = m.lost_item?.images?.[0]?.image_url || m.lost_item?.images?.[0]?.image;
            const foundImg = m.found_item?.images?.[0]?.image_url || m.found_item?.images?.[0]?.image;

            return (
              <div
                key={m.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-6 hover:border-brand-300 transition-all"
              >
                {/* Match Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                        m.match_label === 'HIGH'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : m.match_label === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {m.match_label} SIMILARITY
                    </span>
                    <span className="text-xl font-black text-brand-600">
                      {m.score_percentage}% Composite Score
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Status:</span>
                    <span className="font-bold text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded">
                      {m.status}
                    </span>
                  </div>
                </div>

                {/* Side-by-Side Visual Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left: Lost Item */}
                  <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 flex gap-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                      {lostImg ? (
                        <img src={lostImg} alt={m.lost_item?.item_name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                        Reported Lost
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                        {m.lost_item?.item_name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{m.lost_item?.location}</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Lost on: {m.lost_item?.date_lost} • Colour: {m.lost_item?.colour}
                      </p>
                      <Link
                        to={`/items/lost/${m.lost_item?.id}`}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-block pt-1"
                      >
                        Inspect Full Lost Report →
                      </Link>
                    </div>
                  </div>

                  {/* Right: Found Item */}
                  <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex gap-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                      {foundImg ? (
                        <img src={foundImg} alt={m.found_item?.item_name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                        Reported Found
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                        {m.found_item?.item_name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{m.found_item?.found_location}</span>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Found on: {m.found_item?.date_found} • Colour: {m.found_item?.colour}
                      </p>
                      <Link
                        to={`/items/found/${m.found_item?.id}`}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-block pt-1"
                      >
                        Inspect Full Found Report →
                      </Link>
                    </div>
                  </div>

                </div>

                {/* Score breakdown metrics */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Multi-Factor Neural Matching Breakdown
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="text-base font-extrabold text-brand-600">
                        {Math.round(m.image_similarity * 100)}%
                      </div>
                      <div className="text-[10px] font-semibold text-slate-600 mt-0.5">CLIP Vision (60%)</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="text-base font-extrabold text-emerald-600">
                        {Math.round(m.category_similarity * 100)}%
                      </div>
                      <div className="text-[10px] font-semibold text-slate-600 mt-0.5">Category (15%)</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="text-base font-extrabold text-amber-600">
                        {Math.round(m.color_similarity * 100)}%
                      </div>
                      <div className="text-[10px] font-semibold text-slate-600 mt-0.5">Colour (10%)</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="text-base font-extrabold text-purple-600">
                        {Math.round(m.text_similarity * 100)}%
                      </div>
                      <div className="text-[10px] font-semibold text-slate-600 mt-0.5">Text Semantics (10%)</div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <div className="text-base font-extrabold text-rose-600">
                        {m.distance_km !== null ? `~${m.distance_km} km` : 'Near'}
                      </div>
                      <div className="text-[10px] font-semibold text-slate-600 mt-0.5">Proximity (5%)</div>
                    </div>
                  </div>
                </div>

                {/* Match Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRespondMatch(m.id, 'CONFIRMED')}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                    >
                      ✓ Mark Confirmed
                    </button>
                    <button
                      onClick={() => handleRespondMatch(m.id, 'DISMISSED')}
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Dismiss Match
                    </button>
                  </div>

                  <Link
                    to={`/claims?found_item_id=${m.found_item?.id}&lost_item_id=${m.lost_item?.id}`}
                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Initiate Ownership Claim</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Potential Matches in This Category</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click 'Recalculate AI Similarity' to compute fresh embeddings across all active reports.
          </p>
        </div>
      )}

    </div>
  );
};

export default AIMatchingResultsPage;
