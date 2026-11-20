import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  MapPin,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';

const CATEGORIES = [
  { id: 'ELECTRONICS', name: 'Electronics & Gadgets', icon: '📱', color: 'from-blue-500 to-indigo-600' },
  { id: 'WALLETS_PURSE', name: 'Wallets & Purses', icon: '👛', color: 'from-amber-500 to-orange-600' },
  { id: 'BAGS_LUGGAGE', name: 'Bags & Luggage', icon: '🎒', color: 'from-emerald-500 to-teal-600' },
  { id: 'KEYS', name: 'Keys & Keychains', icon: '🔑', color: 'from-violet-500 to-purple-600' },
  { id: 'JEWELRY_WATCHES', name: 'Jewelry & Watches', icon: '⌚', color: 'from-pink-500 to-rose-600' },
  { id: 'DOCUMENTS_IDS', name: 'Documents & IDs', icon: '🪪', color: 'from-sky-500 to-cyan-600' },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentLost, setRecentLost] = useState([]);
  const [recentFound, setRecentFound] = useState([]);
  const [activeTab, setActiveTab] = useState('lost');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          api.get('/lost-items/?page_size=4'),
          api.get('/found-items/?page_size=4')
        ]);
        setRecentLost(lostRes.data.results || lostRes.data || []);
        setRecentFound(foundRes.data.results || foundRes.data || []);
      } catch (err) {
        console.error("Failed to load items on home:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentItems();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/lost-items?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-white py-16 md:py-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-100/80 text-brand-800 border border-brand-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>CLIP AI Visual Embedding & Proximity Engine Active</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Reuniting Belongings with <br />
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Lost an item or found someone's belonging? Our intelligent platform matches real uploaded photographs using deep vision transformers and verifies ownership securely.
            </p>

            {/* Global Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center shadow-lg rounded-2xl bg-white border border-slate-200/80 p-2 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by item name (e.g., iPhone 14, Leather Wallet, Blue Backpack, Keys)..."
                  className="w-full px-3 py-2.5 text-sm text-slate-800 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Link
                to="/report-lost"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2"
              >
                <span>Report Lost Item</span>
              </Link>
              <Link
                to="/report-found"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                <span>Report Found Item</span>
              </Link>
              <Link
                to="/matches"
                className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>View AI Matches</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Explore by Category</h2>
            <p className="text-sm text-slate-500 mt-1">Browse items categorized for fast recovery</p>
          </div>
          <Link to="/lost-items" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/lost-items?category=${cat.id}`}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-300 hover:shadow-md transition-all text-center group flex flex-col items-center justify-center"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-brand-600">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Real AI Matching Architecture Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-white/10">
              <Cpu className="w-3.5 h-3.5" />
              <span>Multi-Factor AI Scoring System</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Pretrained CLIP Vision Inference + Geospatial Proximity
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              When an item is uploaded, our pipeline processes photographs through a vision transformer to generate normalized 512-dimensional visual embeddings. Items are evaluated on a calibrated weighted scale:
            </p>

            {/* Weights Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-2xl font-black text-brand-400">60%</span>
                <p className="text-xs font-semibold text-slate-300 mt-1">CLIP Image Similarity</p>
                <p className="text-[10px] text-slate-400">Cosine similarity vector</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-2xl font-black text-emerald-400">15%</span>
                <p className="text-xs font-semibold text-slate-300 mt-1">Category Match</p>
                <p className="text-[10px] text-slate-400">Taxonomy alignment</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-2xl font-black text-amber-400">10%</span>
                <p className="text-xs font-semibold text-slate-300 mt-1">Colour Concordance</p>
                <p className="text-[10px] text-slate-400">Semantic color clusters</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-2xl font-black text-purple-400">10%</span>
                <p className="text-xs font-semibold text-slate-300 mt-1">Description Semantics</p>
                <p className="text-[10px] text-slate-400">Token overlap analysis</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-2xl font-black text-rose-400">5%</span>
                <p className="text-xs font-semibold text-slate-300 mt-1">Location Proximity</p>
                <p className="text-[10px] text-slate-400">Haversine distance (50 km)</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/matches"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <span>Test & Explore AI Matches</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Items Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recent Community Listings</h2>
            <p className="text-sm text-slate-500 mt-1">Active items recently logged into the registry</p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-xl w-fit">
            <button
              onClick={() => setActiveTab('lost')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'lost'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Recently Lost
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'found'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Recently Found
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeTab === 'lost' ? (
              recentLost.length > 0 ? (
                recentLost.map((item) => <ItemCard key={item.id} item={item} type="lost" />)
              ) : (
                <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                  No lost items logged yet.
                </div>
              )
            ) : recentFound.length > 0 ? (
              recentFound.map((item) => <ItemCard key={item.id} item={item} type="found" />)
            ) : (
              <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                No found items logged yet.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Safety & Private Ownership Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Protected Serial Numbers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Identifying traits, lockscreen patterns, and serial numbers are strictly redacted from public viewing. Only verified finders and administrators can review proofs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">OpenStreetMap Geospatial Tracking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Search nearby lost and found reports within custom radius radiuses (5 km to 50 km) using Leaflet interactive maps and Haversine distance calculations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Verified Ownership Claims</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Genuine owners submit confidential claim responses. Once the finder or administrator verifies the matching details, the item is securely returned.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
