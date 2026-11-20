import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Upload,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Camera,
  CheckCircle,
  Building
} from 'lucide-react';
import api from '../services/api';
import LeafletMap from '../components/LeafletMap';

const CATEGORIES = [
  { value: 'ELECTRONICS', label: 'Electronics & Gadgets' },
  { value: 'WALLETS_PURSE', label: 'Wallets & Purses' },
  { value: 'BAGS_LUGGAGE', label: 'Bags & Luggage' },
  { value: 'JEWELRY_WATCHES', label: 'Jewelry & Watches' },
  { value: 'KEYS', label: 'Keys & Keychain' },
  { value: 'DOCUMENTS_IDS', label: 'Documents, Cards & IDs' },
  { value: 'CLOTHING_ACCESSORIES', label: 'Clothing & Accessories' },
  { value: 'PETS', label: 'Pets & Animals' },
  { value: 'VEHICLES', label: 'Bicycles & Vehicles' },
  { value: 'BOOKS_STATIONERY', label: 'Books & Stationery' },
  { value: 'OTHER', label: 'Other Belongings' },
];

const ReportFoundItemPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    item_name: '',
    category: 'ELECTRONICS',
    description: '',
    colour: '',
    date_found: new Date().toISOString().split('T')[0],
    found_location: '',
    latitude: 17.4478,
    longitude: 78.3765,
    current_storage_location: 'With Finder (Safe Custody)',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size cannot exceed 10 MB.');
        return;
      }
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleMapCoordSelect = ({ lat, lng }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (selectedFile) {
        data.append('image', selectedFile);
      }

      const res = await api.post('/found-items/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Found item report published successfully! AI similarity engine triggered.');
      setTimeout(() => {
        navigate(`/items/found/${res.data.id}`);
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to submit found item report. Please check required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-700 p-6 sm:p-8 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur">
              <PlusCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Report a Found Item</h1>
              <p className="text-xs text-emerald-100 mt-0.5">
                Thank you for being a good citizen! Log the found item so its owner can discover it through AI.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
          
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Section 1: Item Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">1. Found Item Characteristics</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Item Title *</label>
                <input
                  type="text"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Found Men's Black Bi-fold Wallet"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Colour *</label>
                <input
                  type="text"
                  name="colour"
                  value={formData.colour}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Black, Grey, Gold"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date Found *</label>
                <input
                  type="date"
                  name="date_found"
                  value={formData.date_found}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe where it was noticed, visual condition, or non-confidential contents without giving away private serial numbers."
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Photo Upload */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                2. Item Photograph (Enables CLIP AI Matching)
              </h3>
              <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Vision Encoder Active
              </span>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-400 transition-colors bg-slate-50/50">
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-48 mx-auto rounded-xl object-contain border border-slate-200 shadow-sm"
                  />
                  <label className="inline-block px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 hover:bg-slate-300 cursor-pointer text-slate-700">
                    Change Image
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer block space-y-2">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                    <Camera className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Click to upload found item photo</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or WEBP up to 10 MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              3. Found Location & Interactive Map Pin
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Found Location Landmark / Street *</label>
                <input
                  type="text"
                  name="found_location"
                  value={formData.found_location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. HITEC City Metro Gate 2, Hyderabad"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Safe Custody Location</label>
                <input
                  type="text"
                  name="current_storage_location"
                  value={formData.current_storage_location}
                  onChange={handleChange}
                  placeholder="e.g. In Finder Custody / At Station Security Desk"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <p className="text-[11px] text-slate-500 mb-2">
                Click anywhere on the map to pin the exact coordinates where the item was found:
              </p>
              <div className="h-64 rounded-2xl overflow-hidden border border-slate-200">
                <LeafletMap
                  interactiveSelection={true}
                  selectedCoord={{ lat: Number(formData.latitude), lng: Number(formData.longitude) }}
                  onSelectCoord={handleMapCoordSelect}
                />
              </div>
              <div className="flex gap-4 text-xs font-semibold text-slate-600 mt-2">
                <span>Lat: {formData.latitude}</span>
                <span>Lng: {formData.longitude}</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Computing Embeddings & Submitting...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Publish Found Item Report</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ReportFoundItemPage;
