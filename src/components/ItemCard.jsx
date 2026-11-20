import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ShieldCheck, Sparkles, Image as ImageIcon } from 'lucide-react';

const ItemCard = ({ item, type = 'lost', matchScore = null, matchLabel = null }) => {
  const isLost = type === 'lost';
  const primaryImg = item.images?.find((img) => img.is_primary) || item.images?.[0];
  const imageUrl = primaryImg?.image_url || primaryImg?.image || item.image_url;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.item_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback image placeholder */}
        <div
          className={`w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-50 to-slate-200 ${imageUrl ? 'hidden' : 'flex'}`}
        >
          <ImageIcon className="w-10 h-10 stroke-1 mb-1 text-slate-300" />
          <span className="text-[11px] font-medium text-slate-400">No Image Uploaded</span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
              isLost
                ? 'bg-rose-500 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isLost ? 'Lost Item' : 'Found Item'}
          </span>
          {item.reward_amount > 0 && isLost && (
            <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
              Reward ₹{item.reward_amount}
            </span>
          )}
        </div>

        {/* AI Confidence Pill if provided */}
        {matchScore !== null && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur text-brand-700 shadow border border-brand-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{matchScore}% Match</span>
          </div>
        )}

        {/* Status Indicator */}
        <div className="absolute bottom-2 left-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 backdrop-blur text-white">
            Status: {item.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-brand-600 font-semibold mb-1">
            <Tag className="w-3 h-3" />
            <span>{item.category?.replace(/_/g, ' ')}</span>
            {item.colour && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium capitalize">{item.colour}</span>
              </>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
            {item.item_name}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description || 'No description provided.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 truncate max-w-[65%]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{item.location || item.found_location || 'Not pinpointed'}</span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.date_lost || item.date_found}</span>
            </span>
          </div>

          <div className="pt-2">
            <Link
              to={`/items/${type}/${item.id}`}
              className="block w-full py-2 text-center text-xs font-semibold rounded-xl bg-slate-100 hover:bg-brand-600 hover:text-white text-slate-700 transition-all duration-200"
            >
              View Full Details & Proof
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
