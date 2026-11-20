import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Filter,
  Navigation,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  Compass
} from 'lucide-react';
import api from '../services/api';
import LeafletMap from '../components/LeafletMap';

const NearbyItemsMapPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemType, setItemType] = useState('all');
  const [radius, setRadius] = useState(25);
  const [userCoords, setUserCoords] = useState({ lat: 17.4475, lng: 78.3762 });
  const [cityInput, setCityInput] = useState('Hyderabad');

  const fetchNearbyItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        lat: userCoords.lat,
        lng: userCoords.lng,
        radius: radius,
        item_type: itemType,
      });

      const res = await api.get(`/items/nearby/?${params.toString()}`);
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Failed to fetch nearby map items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearbyItems();
  }, [userCoords, radius, itemType]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          });
        },
        (err) => {
          console.warn("Geolocation denied or error:", err);
          alert("Could not access live device GPS. Using default city coordinates.");
        }
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header and Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Geospatial Nearby Search</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Explore lost and found belongings plotted geographically with Haversine distance calculations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleGetCurrentLocation}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 flex items-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Use Current GPS</span>
            </button>
            <button
              onClick={fetchNearbyItems}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Item Filter</label>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setItemType('all')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  itemType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setItemType('lost')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  itemType === 'lost' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                🔴 Lost
              </button>
              <button
                onClick={() => setItemType('found')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  itemType === 'found' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                🟢 Found
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Search Radius</span>
              <span className="text-brand-600">{radius} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>5 km</span>
              <span>25 km</span>
              <span>50 km</span>
            </div>
          </div>

          <div className="flex flex-col justify-end text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Search Center Coordinates:</span>
            <span className="font-mono text-[11px] text-slate-500">
              {userCoords.lat}, {userCoords.lng}
            </span>
          </div>
        </div>
      </div>

      {/* Main Map + Sidebar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map View */}
        <div className="lg:col-span-2 h-[600px] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
          <LeafletMap
            center={[userCoords.lat, userCoords.lng]}
            zoom={13}
            items={items}
          />
        </div>

        {/* Nearby Items List Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 flex flex-col h-[600px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Nearby Belongings</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {items.length} items
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-slate-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : items.length > 0 ? (
              items.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-brand-300 hover:shadow-sm bg-slate-50/50 transition-all flex items-start gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover" />
                    ) : (
                      <MapPin className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                          item.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.type}
                      </span>
                      {item.distance_km !== null && (
                        <span className="text-[10px] font-semibold text-brand-600">
                          ~{item.distance_km} km
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{item.item_name}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{item.location}</p>

                    <Link
                      to={`/items/${item.type}/${item.id}`}
                      className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 block mt-1"
                    >
                      View Report Details →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-400 space-y-2">
                <Compass className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">No items pinpointed within {radius} km.</p>
                <p className="text-[10px] text-slate-400">Increase the search radius slider to view more results.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default NearbyItemsMapPage;
