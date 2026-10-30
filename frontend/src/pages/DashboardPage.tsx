import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Plus,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Trash2,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Globe2,
  Clock,
  Award,
  Layers,
  LayoutGrid,
  List,
  ChevronRight,
  CheckCircle2,
  Plane,
  Luggage,
  ShieldCheck,
  Zap,
  Bookmark,
  Share2,
  Calculator,
  RefreshCw,
  Sun,
  CloudSun,
  Navigation,
  FileText,
  CreditCard,
  Ticket,
  CheckSquare
} from 'lucide-react';
import { api } from '../api/client';
import { Trip } from '../types';
import { Badge } from '../components/Badge';
import { useAuth } from '../features/auth/AuthContext';

// High-fidelity curated architectural & scenic destination photography
const destinationPhotos: Record<string, string> = {
  kyoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  japan: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  france: 'https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?auto=format&fit=crop&w=1200&q=80',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
  italy: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
  amalfi: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  barcelona: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
  spain: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
  reykjavik: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  iceland: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=1200&q=80',
};

const resolveDestinationImage = (dest: string): string => {
  const lower = dest.toLowerCase();
  for (const key of Object.keys(destinationPhotos)) {
    if (lower.includes(key)) {
      return destinationPhotos[key];
    }
  }
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
};

const resolveAirportCode = (dest: string): string => {
  const lower = dest.toLowerCase();
  if (lower.includes('kyoto') || lower.includes('osaka')) return 'KIX';
  if (lower.includes('tokyo')) return 'HND';
  if (lower.includes('paris')) return 'CDG';
  if (lower.includes('rome')) return 'FCO';
  if (lower.includes('barcelona')) return 'BCN';
  if (lower.includes('london')) return 'LHR';
  if (lower.includes('new york') || lower.includes('nyc')) return 'JFK';
  if (lower.includes('reykjavik')) return 'KEF';
  if (lower.includes('amalfi') || lower.includes('naples')) return 'NAP';
  return 'VOX';
};

const resolveWeather = (dest: string): { temp: string; condition: string } => {
  const lower = dest.toLowerCase();
  if (lower.includes('kyoto') || lower.includes('japan')) return { temp: '19°C', condition: 'Sunny & Crisp' };
  if (lower.includes('tokyo')) return { temp: '21°C', condition: 'Mild Autumn' };
  if (lower.includes('paris') || lower.includes('france')) return { temp: '16°C', condition: 'Partly Cloudy' };
  if (lower.includes('rome') || lower.includes('amalfi') || lower.includes('italy')) return { temp: '23°C', condition: 'Pleasant & Clear' };
  if (lower.includes('barcelona') || lower.includes('spain')) return { temp: '22°C', condition: 'Warm Mediterranean' };
  if (lower.includes('london')) return { temp: '14°C', condition: 'Light Mist' };
  if (lower.includes('reykjavik') || lower.includes('iceland')) return { temp: '4°C', condition: 'Brisk & Clear' };
  return { temp: '20°C', condition: 'Ideal Sightseeing' };
};

export const DashboardPage: React.FC = () => {
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'passport' | 'toolkit'>('all');
  const [selectedVibe, setSelectedVibe] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'budget' | 'title'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [error, setError] = useState<string | null>(null);

  // Quick Currency Converter State
  const [calcAmount, setCalcAmount] = useState<number>(1500);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('JPY');

  // Pre-departure Checklist State
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    passport: true,
    routing: true,
    offlineMaps: true,
    packing: false,
    insurance: false,
  });

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const exchangeRates: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.78,
    JPY: 152.4,
    CAD: 1.36,
    AUD: 1.51,
  };

  useEffect(() => {
    if (user) {
      loadTrips();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTrips();
      setTrips(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load expeditions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Calculations & Analytics
  const now = new Date();

  const enrichedTrips = useMemo(() => {
    return trips.map((t) => {
      let isPast = false;
      let daysCount = 3;
      let daysUntilDeparture: number | null = null;
      try {
        const start = new Date(t.start_date);
        const end = new Date(t.end_date);
        daysCount = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);
        daysUntilDeparture = Math.ceil((start.getTime() - now.getTime()) / (1000 * 3600 * 24));
        isPast = end.getTime() < now.getTime();
      } catch {
        // fallback
      }
      return {
        ...t,
        daysCount,
        isPast,
        daysUntilDeparture,
        imageUrl: resolveDestinationImage(t.destination),
        airportCode: resolveAirportCode(t.destination),
        weather: resolveWeather(t.destination),
      };
    });
  }, [trips, now]);

  const upcomingTrips = useMemo(() => enrichedTrips.filter((t) => !t.isPast), [enrichedTrips]);
  const completedTrips = useMemo(() => enrichedTrips.filter((t) => t.isPast), [enrichedTrips]);

  // Next spotlight trip
  const spotlightTrip = useMemo(() => {
    if (upcomingTrips.length === 0) return enrichedTrips[0] || null;
    return [...upcomingTrips].sort((a, b) => {
      const d1 = new Date(a.start_date).getTime();
      const d2 = new Date(b.start_date).getTime();
      return d1 - d2;
    })[0];
  }, [upcomingTrips, enrichedTrips]);

  // Filtered & Sorted List
  const displayTrips = useMemo(() => {
    let list = enrichedTrips;
    if (activeTab === 'upcoming') list = upcomingTrips;
    if (activeTab === 'completed') list = completedTrips;

    if (selectedVibe !== 'all') {
      list = list.filter((t) => t.travel_preferences?.travel_vibe?.toLowerCase() === selectedVibe.toLowerCase());
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.travel_preferences?.travel_vibe?.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => {
      if (sortBy === 'date') return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      if (sortBy === 'budget') return (b.budget_amount || 0) - (a.budget_amount || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [enrichedTrips, upcomingTrips, completedTrips, activeTab, selectedVibe, searchTerm, sortBy]);

  // Overall Stats
  const totalDaysPlanned = useMemo(() => enrichedTrips.reduce((acc, t) => acc + t.daysCount, 0), [enrichedTrips]);
  const totalBudgetManaged = useMemo(() => enrichedTrips.reduce((acc, t) => acc + (t.budget_amount || 0), 0), [enrichedTrips]);
  const distinctDestinations = useMemo(() => new Set(enrichedTrips.map((t) => t.destination.split(',')[0].trim())).size, [enrichedTrips]);

  // Currency converter conversion
  const convertedAmount = useMemo(() => {
    const inUSD = calcAmount / (exchangeRates[fromCurrency] || 1);
    return inUSD * (exchangeRates[toCurrency] || 1);
  }, [calcAmount, fromCurrency, toCurrency]);

  const popularTemplates = [
    {
      title: 'Kyoto Zen & Imperial Heritage',
      destination: 'Kyoto, Japan',
      vibe: 'cultural',
      days: 6,
      budget: '$2,200',
      badge: 'Bestseller',
      image: destinationPhotos.kyoto,
    },
    {
      title: 'Amalfi Coast Romantic Vistas',
      destination: 'Amalfi, Italy',
      vibe: 'romantic',
      days: 5,
      budget: '$3,100',
      badge: 'Luxury',
      image: destinationPhotos.amalfi,
    },
    {
      title: 'Tokyo Neon & Culinary Odyssey',
      destination: 'Tokyo, Japan',
      vibe: 'adventure',
      days: 7,
      budget: '$2,800',
      badge: 'Popular',
      image: destinationPhotos.tokyo,
    },
    {
      title: 'Parisian Masterpieces & Cafes',
      destination: 'Paris, France',
      vibe: 'cultural',
      days: 5,
      budget: '$2,400',
      badge: 'Classic',
      image: destinationPhotos.paris,
    },
  ];

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-card rounded-3xl p-8 sm:p-14 text-center shadow-premium relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-2 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 rounded-b-full opacity-80" />

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/25">
            <Compass className="w-8 h-8" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Sign In to Voyex Command Hub
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-lg mx-auto leading-relaxed">
            Access your personalized travel dossiers, synchronized multi-day timelines, and collaborative companion controls.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login?redirect=/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-md shadow-brand-600/20 active:scale-95 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/register?redirect=/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-200 shadow-xs transition-all"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200/80">
            <button
              onClick={() => loginAsDemo()}
              className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 px-4 py-2.5 rounded-xl border border-brand-200/60 transition-colors shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-brand-600" />
              Preview Instantly with Demo Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Executive Command Banner with Live Spotlight */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-2xl border border-slate-800">
        {/* Ambient Top Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950/90 z-0" />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500 via-purple-600 to-transparent pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          {/* Left: Traveler Briefing */}
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-black uppercase tracking-widest bg-brand-500/20 text-brand-300 border border-brand-400/30 px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Autonomous Engine Active
              </span>
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Welcome to Your Cockpit, <span className="bg-gradient-to-r from-brand-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">{user?.displayName || 'Explorer Alex'}</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Your autonomous personal expedition command center. Synchronize multi-day schedules, fine-tune pacing, and manage live companion dossiers.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/wizard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-700 hover:to-indigo-700 text-white font-black text-xs tracking-wider uppercase shadow-xl shadow-brand-600/30 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                Plan New Expedition
              </Link>
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 backdrop-blur-md transition-all hover:border-white/30"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Curated Destinations
              </Link>
            </div>
          </div>

          {/* Right: Boarding-Pass Style Next Expedition Card */}
          {spotlightTrip ? (
            <div className="xl:w-96 rounded-3xl bg-slate-900/90 border border-slate-700/80 p-6 text-white backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4 group">
              {/* Card Header Background Image with Gradient Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                style={{ backgroundImage: `url(${spotlightTrip.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-300 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-brand-400" />
                  Upcoming Expedition
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  {spotlightTrip.daysUntilDeparture !== null && spotlightTrip.daysUntilDeparture > 0
                    ? `Departs in ${spotlightTrip.daysUntilDeparture} Days`
                    : spotlightTrip.daysUntilDeparture === 0
                    ? 'Departing Today!'
                    : 'Scheduled'}
                </span>
              </div>

              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white truncate max-w-[220px]">
                    {spotlightTrip.title}
                  </h3>
                  <span className="text-sm font-mono font-black text-brand-300 bg-brand-950/80 px-2 py-0.5 rounded-lg border border-brand-800">
                    {spotlightTrip.airportCode}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span className="font-semibold">{spotlightTrip.destination}</span>
                </div>
              </div>

              {/* Weather & Travel Specs */}
              <div className="relative z-10 grid grid-cols-2 gap-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{spotlightTrip.weather.temp} &bull; {spotlightTrip.weather.condition}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{spotlightTrip.daysCount} Days Planned</span>
                </div>
              </div>

              <Link
                to={`/trips/${spotlightTrip.id}`}
                className="relative z-10 w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-slate-950 font-black text-xs hover:bg-brand-50 transition-colors shadow-md active:scale-95"
              >
                Open Expedition Dossier
                <ArrowRight className="w-3.5 h-3.5 text-slate-900" />
              </Link>
            </div>
          ) : (
            <div className="xl:w-96 rounded-3xl bg-slate-900/80 border border-slate-800 p-8 text-center space-y-4 backdrop-blur-md">
              <Luggage className="w-12 h-12 text-brand-400 mx-auto" />
              <h4 className="font-black text-lg text-white">No active expedition</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Launch your next vacation or international tour with our AI-powered travel engine.
              </p>
              <Link
                to="/wizard"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs transition-colors shadow-md"
              >
                Plan First Journey
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-brand-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Expeditions</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-2xs">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{trips.length}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Cloud & Offline Synchronized</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-brand-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Days Scheduled</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-indigo-700">{totalDaysPlanned}</p>
          <span className="text-[11px] text-slate-500 block font-medium">Turn-by-turn itinerary days</span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-brand-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Regions</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
              <Globe2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-purple-700">{distinctDestinations}</p>
          <span className="text-[11px] text-slate-500 block font-medium">Unique cities & territories mapped</span>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-brand-300 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Estimated Budget</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">${totalBudgetManaged.toLocaleString()}</p>
          <span className="text-[11px] text-slate-500 block font-medium">Managed travel allocation</span>
        </div>
      </div>

      {/* Workspace Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Workspace Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            All Journeys ({enrichedTrips.length})
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'upcoming'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Plane className="w-3.5 h-3.5 text-brand-400" />
            Upcoming ({upcomingTrips.length})
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'completed'
                ? 'bg-slate-950 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Expedition Log ({completedTrips.length})
          </button>

          <button
            onClick={() => setActiveTab('passport')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'passport'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Passport & Stamps
          </button>

          <button
            onClick={() => setActiveTab('toolkit')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black tracking-wide transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'toolkit'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-400" />
            Currency & Logistics
          </button>
        </div>

        {/* View Layout Controls (Grid vs Boarding Pass List) */}
        {activeTab !== 'passport' && activeTab !== 'toolkit' && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'grid' ? 'bg-white text-brand-600 shadow-xs font-bold' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Visual Card Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'list' ? 'bg-white text-brand-600 shadow-xs font-bold' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Boarding Pass Docket View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TAB 1, 2, 3: Journeys Display */}
      {activeTab !== 'passport' && activeTab !== 'toolkit' && (
        <div className="space-y-6">
          {/* Search, Vibe Filter & Sort Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="sm:col-span-6 flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-2xs focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search journeys by city, country, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs font-bold bg-transparent outline-none text-slate-800 placeholder-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Vibe Filter Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={selectedVibe}
                onChange={(e) => setSelectedVibe(e.target.value)}
                className="w-full py-3 px-3.5 rounded-2xl border border-slate-200 bg-white text-xs font-extrabold text-slate-700 shadow-2xs outline-none focus:border-brand-500"
              >
                <option value="all">All Travel Styles</option>
                <option value="cultural">Cultural & Heritage</option>
                <option value="adventure">Active & Adventure</option>
                <option value="relaxed">Relaxed & Cafe Pacing</option>
                <option value="romantic">Romantic & Scenic</option>
                <option value="luxury">Luxury & Gastronomy</option>
                <option value="nature">Nature & Coastal</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-3 px-3.5 rounded-2xl border border-slate-200 bg-white text-xs font-extrabold text-slate-700 shadow-2xs outline-none focus:border-brand-500"
              >
                <option value="date">Sort by Departure (Soonest)</option>
                <option value="budget">Sort by Budget (Highest)</option>
                <option value="title">Sort by Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Trips Content */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-3xl bg-slate-100 animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : error ? (
            <div className="p-8 rounded-3xl bg-red-50 border border-red-200 text-center text-red-700 space-y-3">
              <p className="font-extrabold text-sm">{error}</p>
              <button
                onClick={loadTrips}
                className="text-xs font-bold px-4 py-2 bg-white rounded-xl border border-red-300 hover:bg-red-50 transition-colors"
              >
                Retry Loading
              </button>
            </div>
          ) : displayTrips.length === 0 ? (
            <div className="space-y-12">
              <div className="glass-card rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Luggage className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {searchTerm ? 'No Matching Expeditions' : 'Your Passport is Ready'}
                </h3>
                <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed max-w-sm mx-auto">
                  {searchTerm
                    ? `No journeys match "${searchTerm}". Clear your search query or reset filter.`
                    : 'Design your personalized day-by-day travel itinerary with verified local sights and route optimization.'}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/wizard"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 text-white font-black text-xs hover:bg-brand-700 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Launch Trip Wizard
                  </Link>
                  <Link
                    to="/discover"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-slate-800 font-bold text-xs border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    <Sparkles className="w-4 h-4 text-brand-600" />
                    Curated Destinations
                  </Link>
                </div>
              </div>

              {/* Starter Template Gallery */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Curated Expedition Starters</h3>
                    <p className="text-xs text-slate-500">1-click starter itineraries crafted by our travel engine</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularTemplates.map((item, idx) => (
                    <div
                      key={idx}
                      className="glass-card rounded-3xl overflow-hidden border border-slate-200 hover:border-brand-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.destination}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        <span className="absolute top-3 left-3 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-900 shadow-sm">
                          {item.badge}
                        </span>
                        <span className="absolute bottom-3 right-3 text-xs font-mono font-black text-white bg-slate-900/80 px-2 py-0.5 rounded-lg border border-white/20">
                          {item.budget}
                        </span>
                      </div>

                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-black text-base text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                            <span className="font-bold">{item.destination}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs text-slate-500 font-bold">{item.days} Days Planned</span>
                          <Link
                            to={`/wizard?destination=${encodeURIComponent(item.destination)}&vibe=${item.vibe}`}
                            className="inline-flex items-center gap-1 text-xs font-black text-brand-700 hover:text-brand-900 group-hover:translate-x-1 transition-transform"
                          >
                            Use Plan <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            /* Visual Card Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTrips.map((trip) => {
                const vibe = trip.travel_preferences?.travel_vibe || 'cultural';
                return (
                  <div
                    key={trip.id}
                    className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-slate-200/80 hover:border-brand-300 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Visual Card Cover */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={trip.imageUrl}
                        alt={trip.destination}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                      {/* Header Overlays */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                        <Badge variant="brand" size="sm">
                          {vibe.toUpperCase()}
                        </Badge>
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-md border ${
                          trip.isPast
                            ? 'bg-slate-900/80 text-slate-300 border-white/20'
                            : 'bg-emerald-500/90 text-white border-white/20'
                        }`}>
                          {trip.isPast ? 'Completed' : trip.status}
                        </span>
                      </div>

                      {/* Airport Badge & Countdown */}
                      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
                        <span className="text-xs font-mono font-black text-white bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/20">
                          {trip.airportCode} &bull; {trip.daysCount} Days
                        </span>
                        {trip.daysUntilDeparture !== null && trip.daysUntilDeparture > 0 && (
                          <span className="text-[11px] font-bold text-amber-300 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-amber-400/30">
                            In {trip.daysUntilDeparture}d
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                          {trip.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                          <span className="font-bold truncate">{trip.destination}</span>
                        </div>
                      </div>

                      {/* Travel Specs */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{trip.start_date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{trip.traveler_count} Travelers</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{trip.weather.temp}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-extrabold text-slate-800">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{trip.budget_amount ? `${trip.currency} ${trip.budget_amount.toLocaleString()}` : 'Flexible'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Action Footer */}
                    <div className="px-6 py-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => handleDeleteTrip(trip.id, trip.title)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                        title="Delete expedition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <Link
                        to={`/trips/${trip.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-black text-brand-700 hover:text-brand-900 transition-colors group-hover:translate-x-1 duration-200"
                      >
                        View Itinerary Dossier
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Boarding Pass List View */
            <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 shadow-xs divide-y divide-slate-100">
              {displayTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 hidden sm:block border border-slate-200">
                      <img src={trip.imageUrl} alt={trip.destination} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-slate-900 text-white">
                          {trip.airportCode}
                        </span>
                        <h3 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-brand-600 transition-colors">
                          {trip.title}
                        </h3>
                        <Badge variant="brand" size="sm">
                          {trip.travel_preferences?.travel_vibe?.toUpperCase() || 'CULTURAL'}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-bold text-slate-800">
                          <MapPin className="w-3.5 h-3.5 text-brand-600" />
                          {trip.destination}
                        </span>
                        <span>&bull;</span>
                        <span>{trip.start_date} to {trip.end_date} ({trip.daysCount} days)</span>
                        <span>&bull;</span>
                        <span>{trip.traveler_count} travelers</span>
                        {trip.budget_amount && (
                          <>
                            <span>&bull;</span>
                            <span className="font-extrabold text-emerald-700">
                              {trip.currency} {trip.budget_amount.toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/trips/${trip.id}`}
                      className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-black transition-colors inline-flex items-center gap-1.5"
                    >
                      Open Dossier
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteTrip(trip.id, trip.title)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Traveler Passport & Stamp Collection */}
      {activeTab === 'passport' && (
        <div className="space-y-8">
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                    Voyex Digital Passport
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Traveler Identity & Exploration Passport
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Official voyage record for {user?.displayName || 'Explorer Alex'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2.5 rounded-2xl bg-slate-950 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-md">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Tier: Global Pathfinder (Rank 3)</span>
                </div>
              </div>
            </div>

            {/* Passport Stamps Grid */}
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Immigration & City Stamps Collected
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { city: 'KYOTO', country: 'JAPAN', code: 'UKY-JPN', date: '2026-11', icon: '⛩️', color: 'border-rose-300 bg-rose-50/50 text-rose-900' },
                  { city: 'PARIS', country: 'FRANCE', code: 'CDG-FRA', date: '2026-09', icon: '🗼', color: 'border-blue-300 bg-blue-50/50 text-blue-900' },
                  { city: 'ROME', country: 'ITALY', code: 'FCO-ITA', date: '2026-08', icon: '🏛️', color: 'border-amber-300 bg-amber-50/50 text-amber-900' },
                  { city: 'TOKYO', country: 'JAPAN', code: 'HND-JPN', date: '2026-06', icon: '🗾', color: 'border-purple-300 bg-purple-50/50 text-purple-900' },
                  { city: 'BARCELONA', country: 'SPAIN', code: 'BCN-ESP', date: '2026-04', icon: '🏖️', color: 'border-emerald-300 bg-emerald-50/50 text-emerald-900' },
                  { city: 'NEW YORK', country: 'USA', code: 'JFK-USA', date: '2026-02', icon: '🗽', color: 'border-indigo-300 bg-indigo-50/50 text-indigo-900' },
                  { city: 'REYKJAVIK', country: 'ICELAND', code: 'KEF-ISL', date: '2025-12', icon: '🌋', color: 'border-cyan-300 bg-cyan-50/50 text-cyan-900' },
                  { city: 'LONDON', country: 'UK', code: 'LHR-GBR', date: '2025-10', icon: '🏰', color: 'border-slate-300 bg-slate-50/50 text-slate-800' },
                ].map((stamp, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border-2 border-dashed ${stamp.color} flex flex-col justify-between h-28 transform transition-transform hover:scale-105 shadow-2xs font-mono`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{stamp.icon}</span>
                      <span className="text-[10px] font-extrabold uppercase">{stamp.code}</span>
                    </div>
                    <div>
                      <div className="text-sm font-black tracking-widest">{stamp.city}</div>
                      <div className="text-[10px] opacity-75">{stamp.country} &bull; {stamp.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Style Affinity */}
            <div className="pt-4 border-t border-slate-200/80 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Travel Style Affinity Analysis
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                    <span>Cultural & History Sights</span>
                    <span className="text-brand-600 font-black">88%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-brand-600 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                    <span>Gastronomy & Local Food</span>
                    <span className="text-amber-600 font-black">74%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '74%' }} />
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-slate-800">
                    <span>Nature & Scenic Exploration</span>
                    <span className="text-emerald-600 font-black">65%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Travel Currency, Timezone & Logistics Checklist */}
      {activeTab === 'toolkit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Currency Calculator */}
          <div className="glass-card rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-2xs">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Currency Estimator</h3>
                <p className="text-xs text-slate-500">Live offline peg with major travel currencies</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                  Amount
                </label>
                <input
                  type="number"
                  min={1}
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                  className="w-full p-3 rounded-xl border border-slate-200 text-base font-black text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                    From
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-extrabold bg-white text-slate-800 outline-none"
                  >
                    {Object.keys(exchangeRates).map((cur) => (
                      <option key={cur} value={cur}>{cur}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                    To
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-extrabold bg-white text-slate-800 outline-none"
                  >
                    {Object.keys(exchangeRates).map((cur) => (
                      <option key={cur} value={cur}>{cur}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conversion Result Box */}
              <div className="p-5 rounded-2xl bg-brand-50/70 border border-brand-200/80 text-center space-y-1">
                <span className="text-xs text-brand-800 font-bold">Calculated Conversion</span>
                <div className="text-2xl sm:text-3xl font-black text-brand-900">
                  {toCurrency} {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-brand-600 block font-medium">
                  1 {fromCurrency} ≈ {((exchangeRates[toCurrency] || 1) / (exchangeRates[fromCurrency] || 1)).toFixed(4)} {toCurrency}
                </span>
              </div>
            </div>
          </div>

          {/* Timezone Reference Card */}
          <div className="glass-card rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Global Clocks</h3>
                <p className="text-xs text-slate-500">Live time offsets for major hubs</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { city: 'Tokyo / Kyoto', tz: 'Asia/Tokyo', region: 'JST (UTC+9)' },
                { city: 'Paris / Rome', tz: 'Europe/Paris', region: 'CET (UTC+1)' },
                { city: 'London', tz: 'Europe/London', region: 'GMT (UTC+0)' },
                { city: 'New York', tz: 'America/New_York', region: 'EST (UTC-5)' },
                { city: 'San Francisco', tz: 'America/Los_Angeles', region: 'PST (UTC-8)' },
              ].map((loc, i) => {
                let localStr = '';
                try {
                  localStr = new Intl.DateTimeFormat('en-US', {
                    timeZone: loc.tz,
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  }).format(new Date());
                } catch {
                  localStr = '12:00 PM';
                }

                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-black text-xs text-slate-900">{loc.city}</div>
                      <div className="text-[10px] text-slate-400">{loc.region}</div>
                    </div>
                    <div className="text-sm font-mono font-black text-brand-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      {localStr}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pre-Departure Readiness Checklist */}
          <div className="glass-card rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900">Expedition Readiness</h3>
                <p className="text-xs text-slate-500">Essential travel logistics checklist</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: 'passport', label: 'Passport Valid (> 6 Months)' },
                { key: 'routing', label: 'TSP Route Sequence Optimized' },
                { key: 'offlineMaps', label: 'Offline Itinerary Dossier Exported' },
                { key: 'packing', label: 'Luggage & Plug Adapters Packed' },
                { key: 'insurance', label: 'Travel Health Insurance Confirmed' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleChecklist(item.key)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs font-bold transition-all ${
                    checklist[item.key]
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                    checklist[item.key] ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                  }`}>
                    {checklist[item.key] && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
