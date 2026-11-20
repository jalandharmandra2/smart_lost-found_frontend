import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Tag,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Share2,
  Inbox,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LeafletMap from '../components/LeafletMap';

const ItemDetailsPage = () => {
  const { type, id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isLost = type === 'lost';
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    const fetchItemAndMatches = async () => {
      try {
        setLoading(true);
        const endpoint = isLost ? `/lost-items/${id}/` : `/found-items/${id}/`;
        const res = await api.get(endpoint);
        setItem(res.data);

        // Fetch AI matches for this item
        try {
          const matchRes = await api.get(`${endpoint}matches/`);
          setMatches(matchRes.data || []);
        } catch (matchErr) {
          // If unauthenticated or no matches, fail silently
        }
      } catch (err) {
        console.error("Failed to load item:", err);
        setError('Item not found or has been deactivated.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemAndMatches();
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">{error || 'Item Details Unavailable'}</h2>
        <Link to="/" className="inline-block px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 text-white">
          Back to Home
        </Link>
      </div>
    );
  }

  const images = item.images || [];
  const currentImage = images[activeImgIndex]?.image_url || images[activeImgIndex]?.image;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button & Type Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isLost ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {isLost ? 'Lost Item Report' : 'Found Item Safeguarded'}
        </span>
      </div>

      {/* Main 2-Column Item Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Photos Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl bg-slate-100 border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center">
            {currentImage ? (
              <img
                src={currentImage}
                alt={item.item_name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400">
                <ImageIcon className="w-16 h-16 stroke-1 mb-2 text-slate-300" />
                <span className="text-xs">No Photograph Uploaded</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImgIndex === idx ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url || img.image} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Map Section */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>Location Coordinates on Map</span>
            </h3>
            <div className="h-56 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <LeafletMap
                center={[Number(item.latitude || 17.4475), Number(item.longitude || 78.3762)]}
                zoom={14}
                items={[
                  {
                    id: item.id,
                    type: isLost ? 'lost' : 'found',
                    item_name: item.item_name,
                    location: item.location || item.found_location,
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="space-y-6">
          
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>{item.category?.replace(/_/g, ' ')}</span>
              {item.colour && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="capitalize">{item.colour}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {item.item_name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.location || item.found_location || 'Not specified'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{isLost ? `Lost: ${item.date_lost}` : `Found: ${item.date_found}`}</span>
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                Status: {item.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</h3>
            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {item.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Custody or Reward details */}
          <div className="grid grid-cols-2 gap-3">
            {isLost ? (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                <span className="font-bold text-amber-800">Finder Reward Offered:</span>
                <p className="text-lg font-black text-amber-900 mt-0.5">
                  ₹{item.reward_amount || '0.00'}
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-800">Current Custody:</span>
                <p className="text-xs font-semibold text-emerald-900 mt-1">
                  {item.current_storage_location || 'With Finder'}
                </p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-600">Reported By:</span>
              <p className="text-xs font-semibold text-slate-800 mt-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.user?.username || 'Community Member'}</span>
              </p>
            </div>
          </div>

          {/* Secret Identifying details (Redacted check) */}
          {isLost && (
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Confidential Identifying Traits:</span>
              </div>
              <p className="text-slate-600 font-mono text-[11px]">
                {item.secret_identifying_details}
              </p>
            </div>
          )}

          {/* Ownership Claim Action Button */}
          {!isLost && (
            <div className="pt-2">
              <Link
                to={`/claims?found_item_id=${item.id}`}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Inbox className="w-5 h-5" />
                <span>Claim This Belonging (Ownership Verification)</span>
              </Link>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                🔒 You will be asked confidential verification questions to prove genuine ownership.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Matches Section for this Item */}
      {matches.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>AI Similarity Matches for this Item</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                CLIP neural vision comparison against opposite reports
              </p>
            </div>

            <Link to="/matches" className="text-xs font-bold text-brand-600 hover:text-brand-700">
              View All Matches
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((m) => {
              const other = isLost ? m.found_item : m.lost_item;
              return (
                <div key={m.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      {other?.images?.[0] ? (
                        <img src={other.images[0].image_url || other.images[0].image} alt="Other" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 m-auto text-slate-300" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                          {m.match_label} ({m.score_percentage}%)
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{other?.item_name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{other?.location || other?.found_location}</p>
                    </div>
                  </div>

                  <Link
                    to={`/items/${isLost ? 'found' : 'lost'}/${other?.id}`}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-brand-600 hover:text-white transition-colors shrink-0"
                  >
                    Compare
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default ItemDetailsPage;
