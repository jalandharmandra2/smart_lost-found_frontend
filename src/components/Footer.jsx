import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Cpu, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Search className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Smart Lost & Found</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An intelligent, AI-powered community lost and found network. Using deep visual embeddings from pretrained CLIP models to reunite people with their belongings securely.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Private Verification Protected</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/lost-items" className="hover:text-brand-400 transition-colors">Browse Lost Items</Link>
              </li>
              <li>
                <Link to="/found-items" className="hover:text-brand-400 transition-colors">Browse Found Items</Link>
              </li>
              <li>
                <Link to="/matches" className="hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <span>AI Similarity Hub</span>
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-brand-400 transition-colors">Interactive Geographic Map</Link>
              </li>
            </ul>
          </div>

          {/* How it works */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">AI Verification</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <Cpu className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                <span>60% weight on CLIP visual feature vector cosine similarity.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Haversine distance calculation within 50 km proximity radius.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Shield className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <span>Private verification Q&A protects genuine ownership before release.</span>
              </li>
            </ul>
          </div>

          {/* Emergency support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">Report an Item</h4>
            <p className="text-xs text-slate-400 mb-3">
              Did you recently lose or find personal belongings? Log your report in under 2 minutes.
            </p>
            <div className="space-y-2">
              <Link
                to="/report-lost"
                className="block text-center py-2 px-3 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
              >
                Report Lost Belonging
              </Link>
              <Link
                to="/report-found"
                className="block text-center py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                Report Found Item
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Smart Lost & Found Platform. Developed with Python Django, PyTorch & React.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Academic Evaluation & Project Demonstration.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
