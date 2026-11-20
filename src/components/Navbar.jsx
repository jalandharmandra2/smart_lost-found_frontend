import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  MapPin,
  Sparkles,
  Bell,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  Layers,
  Inbox
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-brand-700 to-indigo-700 bg-clip-text text-transparent">
                Smart Lost & Found
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200 rounded">
                AI Powered
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <Link to="/lost-items" className="px-3 py-2 rounded-lg hover:text-brand-600 hover:bg-slate-50 transition-colors">
              Lost Items
            </Link>
            <Link to="/found-items" className="px-3 py-2 rounded-lg hover:text-brand-600 hover:bg-slate-50 transition-colors">
              Found Items
            </Link>
            <Link to="/matches" className="px-3 py-2 rounded-lg hover:text-brand-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Matches</span>
            </Link>
            <Link to="/map" className="px-3 py-2 rounded-lg hover:text-brand-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Map View</span>
            </Link>
            {isAuthenticated && (
              <Link to="/claims" className="px-3 py-2 rounded-lg hover:text-brand-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-purple-600" />
                <span>Claims</span>
              </Link>
            )}
          </div>

          {/* Action Buttons & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {/* Report CTA */}
            <div className="flex items-center gap-2">
              <Link
                to="/report-lost"
                className="px-3 py-2 text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Report Lost
              </Link>
              <Link
                to="/report-found"
                className="px-3 py-2 text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Report Found
              </Link>
            </div>

            {/* Notification Bell */}
            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative p-2 text-slate-500 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Dropdown / Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-brand-400 bg-slate-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center text-xs">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left pr-1">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.first_name || user?.username}
                    </p>
                    <span className="text-[10px] text-slate-500 leading-tight block">
                      {user?.role === 'ADMINISTRATOR' ? 'Admin' : user?.role === 'ITEM_FINDER' ? 'Finder' : 'Member'}
                    </span>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                    >
                      <Layers className="w-4 h-4 text-slate-400" />
                      User Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      Manage Profile
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin-dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 font-medium"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-500/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <Link to="/notifications" className="relative p-2 text-slate-600">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/lost-items"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Lost Items
          </Link>
          <Link
            to="/found-items"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Found Items
          </Link>
          <Link
            to="/matches"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-50"
          >
            AI Matches
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-50"
          >
            Nearby Items Map
          </Link>

          <div className="pt-2 grid grid-cols-2 gap-2">
            <Link
              to="/report-lost"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-center text-xs font-semibold rounded-lg text-rose-700 bg-rose-50 border border-rose-200"
            >
              + Report Lost
            </Link>
            <Link
              to="/report-found"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-center text-xs font-semibold rounded-lg text-emerald-700 bg-emerald-50 border border-emerald-200"
            >
              + Report Found
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-200 space-y-1">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Profile Settings
              </Link>
              {isAdmin && (
                <Link
                  to="/admin-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-amber-700 rounded-lg hover:bg-amber-50"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-rose-600 rounded-lg hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-center text-sm font-semibold rounded-lg border border-slate-300 text-slate-700"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-center text-sm font-semibold rounded-lg bg-brand-600 text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
