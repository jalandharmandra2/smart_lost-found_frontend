import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Upload,
  MapPin,
  ShieldAlert,
  AlertCircle,
  Sparkles,
  Camera,
  CheckCircle,
  HelpCircle
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

const ReportLostItemPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    item_name: '',
    category: 'ELECTRONICS',
    description: '',
    colour: '',
    brand_or_maker: '',
    date_lost: new Date().toISOString().split('T')[0],
    location: '',
    latitude: 17.4475,
    longitude: 78.3762,
    contact_preference: 'IN_APP',
    secret_identifying_details: '',
    reward_amount: '0.00',
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

      const res = await api.post('/lost-items/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Lost item report filed successfully! AI similarity engine triggered.');
      setTimeout(() => {
        navigate(`/items/lost/${res.data.id}`);
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to submit lost item report. Please check required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-pink-700 p-6 sm:p-8 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur">
              <PlusCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Report a Lost Belonging</h1>
              <p className="text-xs text-rose-100 mt-0.5">
                Upload real photos and details. Our CLIP AI will compare against found listings immediately.
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

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">1. Basic Item Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  name="item_name"
                  value={formData.item_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Black Leather Tommy Hilfiger Wallet"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Colour *</label>
                <input
                  type="text"
                  name="colour"
                  value={formData.colour}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Black, Navy Blue, Silver"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand / Maker</label>
                <input
                  type="text"
                  name="brand_or_maker"
                  value={formData.brand_or_maker}
                  onChange={handleChange}
                  placeholder="e.g., Apple, Dell, Titan, Wildcraft"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date Lost *</label>
                <input
                  type="date"
                  name="date_lost"
                  value={formData.date_lost}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Public Description *</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Provide recognizable visual characteristics, stickers, general appearance, or context without revealing private secrets or passwords."
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Image Upload with CLIP Notice */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                2. Item Photograph (Essential for AI Matching)
              </h3>
              <span className="flex items-center gap-1 text-[11px] text-brand-600 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                CLIP Vision Inference
              </span>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-rose-400 transition-colors bg-slate-50/50">
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
                    <Camera className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-rose-600 hover:text-rose-700">Click to upload photograph</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, or WEBP up to 10 MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Section 3: Location on OpenStreetMap */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              3. Location & Geographic Coordinates
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location Address / Landmark *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g. HITEC City Metro Station Gate 2, Hyderabad"
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
              />
            </div>

            <div>
              <p className="text-[11px] text-slate-500 mb-2">
                Click on the interactive map below to pinpoint the exact latitude & longitude coordinates:
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

          {/* Section 4: Privacy & Ownership Verification (Redacted publicly) */}
          <div className="space-y-3 pt-4 border-t border-slate-200 bg-amber-50/50 p-5 rounded-2xl border border-amber-200/60">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-amber-900">Confidential Ownership Proof (Private)</h3>
                <p className="text-[10px] text-amber-700">
                  This field is completely REDACTED from public viewers. Only you and administrators can view it for ownership verification.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Secret Identifying Details (Serial numbers, lock patterns, inner markings)
              </label>
              <textarea
                name="secret_identifying_details"
                rows="2"
                value={formData.secret_identifying_details}
                onChange={handleChange}
                placeholder="e.g. Serial #SN-928192, small star scratch on bottom-right, or specific inner card."
                className="w-full px-3.5 py-2.5 text-xs border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Section 5: Contact Preference & Reward */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Preference</label>
              <select
                name="contact_preference"
                value={formData.contact_preference}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none bg-white"
              >
                <option value="IN_APP">In-App Messaging (Recommended & Safest)</option>
                <option value="EMAIL">Platform Email Forwarding</option>
                <option value="PHONE">Direct Phone Number</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Optional Finder Reward (₹)</label>
              <input
                type="number"
                name="reward_amount"
                min="0"
                step="50"
                value={formData.reward_amount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Extracting AI Features & Submitting...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Publish Lost Item Report</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ReportLostItemPage;
