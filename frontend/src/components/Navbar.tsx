import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Plus,
  LogOut,
  Menu,
  X,
  Sparkles,
  User,
  Globe2,
  Search,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, supabaseConfigured } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleQuickSearch = () => {
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-brand-700 flex items-center justify-center text-white shadow-md shadow-brand-900/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-brand-600/30 border border-white/20">
              <Compass className="w-5 h-5 text-white transition-transform group-hover:rotate-45" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-2xl tracking-wider text-slate-950 group-hover:text-brand-600 transition-colors">
                  VOYEX
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-900 text-white shadow-2xs">
                  PRO
                </span>
              </div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 -mt-0.5">
                Autonomous Travel OS
              </span>
            </div>
          </Link>

          {/* Desktop Center Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/70 shadow-2xs">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                isActive('/dashboard') || isActive('/my-trips')
                  ? 'bg-white text-slate-950 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-brand-600" />
              Command Hub
            </Link>

            <Link
              to="/discover"
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                isActive('/discover')
                  ? 'bg-white text-slate-950 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <Globe2 className="w-4 h-4 text-emerald-600" />
              Destinations
            </Link>

            <Link
              to="/wizard"
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
                isActive('/wizard')
                  ? 'bg-white text-slate-950 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              Expedition Planner
            </Link>
          </nav>

          {/* Right Section: Telemetry, Search & Account */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick Search Trigger Pill */}
            <button
              type="button"
              onClick={handleQuickSearch}
              className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 hover:bg-slate-100/80 text-slate-500 hover:text-slate-800 text-xs font-medium transition-all shadow-2xs"
              title="Search journeys"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search...</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-400 font-bold">
                ⌘K
              </kbd>
            </button>

            {/* AI Engine Status Pill */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Engine Online</span>
            </div>

            {/* User Profile / Auth Action */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black uppercase shadow-xs">
                    {user.displayName?.[0] || 'U'}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-extrabold text-slate-900 leading-tight">
                      {user.displayName}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {supabaseConfigured ? 'Cloud Sync' : 'Demo Mode'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900">{user.displayName}</div>
                      <div className="text-[10px] text-slate-400 truncate">{user.email || 'explorer@voyex.app'}</div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-brand-600" />
                      Command Hub
                    </Link>

                    <Link
                      to="/wizard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <Plus className="w-4 h-4 text-indigo-600" />
                      Plan New Expedition
                    </Link>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-extrabold text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-xl text-xs font-extrabold bg-slate-950 hover:bg-slate-800 text-white shadow-xs transition-all hover:scale-[1.02]"
                >
                  Join Voyex
                </Link>
              </div>
            )}

            {/* CTA Plan Expedition Button */}
            <Link
              to="/wizard"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-brand-600/25 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Plan Trip</span>
            </Link>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="sm:hidden flex items-center gap-2">
            <Link
              to="/wizard"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Plan
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-950 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Sheet */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-brand-600" />
            Command Hub
          </Link>
          <Link
            to="/discover"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <Globe2 className="w-4 h-4 text-emerald-600" />
            Curated Destinations
          </Link>
          <Link
            to="/wizard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-950 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Plan New Expedition
          </Link>

          {user ? (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between px-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-black">
                  {user.displayName?.[0] || 'U'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900">{user.displayName}</div>
                  <div className="text-[10px] text-slate-400">{user.email || 'Demo Mode'}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-600 font-bold hover:underline"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
