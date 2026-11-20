import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, PlusCircle, RefreshCw, Layers } from 'lucide-react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'ELECTRONICS', label: 'Electronics & Gadgets' },
  { value: 'WALLETS_PURSE', label: 'Wallets & Purses' },
  { value: 'BAGS_LUGGAGE', label: 'Bags & Luggage' },
  { value: 'JEWELRY_WATCHES', label: 'Jewelry & Watches' },
  { value: 'KEYS', label: 'Keys & Keychain' },
  { value: 'DOCUMENTS_IDS', label: 'Documents & IDs' },
  { value: 'CLOTHING_ACCESSORIES', label: 'Clothing & Accessories' },
  { value: 'PETS', label: 'Pets & Animals' },
  { value: 'VEHICLES', label: 'Bicycles & Vehicles' },
  { value: 'OTHER', label: 'Other' },
];

const FoundItemsListPage = () => {
  const [searchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [colour, setColour] = useState(searchParams.get('colour') || '');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (category) params.set('category', category);
      if (colour) params.set('colour', colour);

      const res = await api.get(`/found-items/?${params.toString()}`);
      setItems(res.data.results || res.data || []);
      setTotalCount(res.data.count || (res.data.results || res.data || []).length);
    } catch (err) {
      console.error("Failed to fetch found items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [category, colour]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Found Belongings Registry</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse items found and safeguarded by honest community members.
          </p>
        </div>

        <Link
          to="/report-found"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report a Found Item</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by found item name, location, or custodian..."
              className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              placeholder="Colour (e.g. Blue)"
              className="w-32 px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none"
            />

            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing {items.length} of {totalCount} found items currently held</span>
        <button
          onClick={fetchItems}
          className="flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} type="found" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <p className="text-base font-bold text-slate-700">No matching found items located</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try broadening your search keywords or check back soon as finders report new discoveries.
          </p>
          <Link
            to="/report-found"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
          >
            <PlusCircle className="w-4 h-4" />
            Report a Found Item
          </Link>
        </div>
      )}

    </div>
  );
};

export default FoundItemsListPage;
