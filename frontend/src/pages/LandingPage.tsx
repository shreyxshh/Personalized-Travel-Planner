import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Share2,
  Download,
  ArrowRight,
  CheckCircle2,
  Lock,
  Route,
  Users,
  FileText,
  Calendar,
  Zap,
  Globe2,
  Plane,
  Sun,
  Star
} from 'lucide-react';
import { Badge } from '../components/Badge';

export const LandingPage: React.FC = () => {
  const quickDestinations = [
    { name: 'Kyoto', emoji: '⛩️', vibe: 'cultural' },
    { name: 'Paris', emoji: '🗼', vibe: 'cultural' },
    { name: 'Rome', emoji: '🏛️', vibe: 'cultural' },
    { name: 'Amalfi Coast', emoji: '🏖️', vibe: 'romantic' },
    { name: 'Tokyo', emoji: '🗾', vibe: 'adventure' },
    { name: 'Reykjavik', emoji: '🌋', vibe: 'nature' },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 py-6 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 sm:pt-16 sm:pb-20">
        {/* Ambient background glow & radial light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-brand-400/25 via-indigo-300/20 to-purple-400/20 blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-emerald-300/10 blur-[80px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          {/* Top Engine Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-slate-200/90 text-slate-800 text-xs font-black uppercase tracking-widest shadow-xs backdrop-blur-md hover:border-brand-300 transition-all">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-900 font-extrabold">Voyex OS 2.0</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-brand-600 font-black">Autonomous Travel Intelligence</span>
          </div>

          {/* Master Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 leading-[1.08]">
              Personalized Daily Itineraries,{' '}
              <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Calibrated to Your Rhythm.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Eliminate scattered tabs and bookmark clutter. Voyex engineers verified, route-optimized daily schedules calibrated to your exact budget, pace, dietary needs, and vibe.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              to="/wizard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-slate-950 hover:bg-brand-600 text-white font-black text-sm shadow-xl shadow-slate-950/20 hover:shadow-brand-600/30 hover:scale-[1.02] active:scale-95 transition-all group"
            >
              <span>Start Planning Free</span>
              <ArrowRight className="w-4 h-4 text-brand-300 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/discover"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/90 hover:bg-white text-slate-800 font-bold text-sm border border-slate-200/90 shadow-xs hover:shadow-sm transition-all"
            >
              <Compass className="w-4 h-4 text-brand-600" />
              <span>Explore 50+ Destinations</span>
            </Link>
          </div>

          {/* 1-Click Destination Fast-Picks */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Quick-Pick:
            </span>
            {quickDestinations.map((d) => (
              <Link
                key={d.name}
                to={`/wizard?destination=${encodeURIComponent(d.name)}&vibe=${d.vibe}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-bold border border-slate-200/70 shadow-2xs transition-all hover:scale-105 active:scale-95"
              >
                <span>{d.emoji}</span>
                <span>{d.name}</span>
              </Link>
            ))}
          </div>

          {/* Capability Pill Ribbon */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-slate-600 font-bold">
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              TSP 0% Backtracking
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              Padlock Activity Pinning
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Conversational Refinement
            </span>
            <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs">
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              PDF, Markdown & iCal
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Itinerary Preview Mockup */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="p-6 sm:p-8 bg-slate-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider bg-brand-500/20 text-brand-300 px-2.5 py-0.5 rounded-full border border-brand-400/30">
                  Live Sample Dossier
                </span>
                <span className="text-xs text-slate-300 font-bold">Cultural &bull; Moderate Pacing</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white">Kyoto Cultural Autumn Odyssey</h3>
              <p className="text-xs text-slate-400 mt-1">2 Travelers &bull; $2,200 USD &bull; Route TSP Calibrated</p>
            </div>

            <Link
              to="/wizard?destination=Kyoto,%20Japan&vibe=cultural"
              className="px-5 py-2.5 rounded-xl bg-white text-slate-950 text-xs font-black hover:bg-brand-50 transition-all shadow-md active:scale-95"
            >
              Plan Your Kyoto Trip ➔
            </Link>
          </div>

          {/* Sample Day Card */}
          <div className="p-6 sm:p-8 space-y-5 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-black text-slate-900 text-base">Day 1 &bull; Higashiyama Heritage & Torii Gates</h4>
                <p className="text-xs text-slate-500 mt-0.5">Start early at Fushimi Inari to experience serene mountain shrines.</p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 bg-white text-brand-700 border border-slate-200 rounded-xl shadow-2xs shrink-0">
                3 Stops &bull; 4.8 km total
              </span>
            </div>

            <div className="space-y-3">
              {/* Activity 1 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-brand-300 transition-all">
                <span className="text-xs font-mono font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">07:30</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="text-sm font-black text-slate-900">Fushimi Inari Taisha Thousand Torii Walk</h5>
                    <Badge variant="brand" size="sm">Cultural</Badge>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Lock className="w-2.5 h-2.5" /> Pinned Stop
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Iconic mountainside path lined with thousands of vibrant vermilion Shinto shrine gates.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900">Free</span>
                  <p className="text-[10px] text-slate-400">120 mins</p>
                </div>
              </div>

              {/* Transit connector */}
              <div className="flex items-center gap-3 pl-8 text-[11px] text-slate-500 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                <span className="bg-white px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-600 shadow-2xs font-mono text-[10px]">
                  🚗 15 min drive &bull; 1.8 km
                </span>
              </div>

              {/* Activity 2 */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-brand-300 transition-all">
                <span className="text-xs font-mono font-black text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">10:45</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="text-sm font-black text-slate-900">Tofuku-ji Hojo Garden & Maple Valley</h5>
                    <Badge variant="brand" size="sm">Nature</Badge>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified Landmark
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Historic Zen temple renowned for checkerboard moss rock gardens and Tsutenkyo Bridge views.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900">$10.00</span>
                  <p className="text-[10px] text-slate-400">90 mins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-brand-600">Engineered For Real Journeys</h2>
          <p className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
            Intelligent Features for Stress-Free Travel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-3xl glass-card-hover border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mb-6 shadow-md shadow-brand-600/25">
              <Route className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Minimal Route Backtracking</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No zigzagging across town. Traveling-Salesperson (TSP) algorithms order your activities to minimize transit distance, calculate inter-stop drive/walk times, and maximize sightseeing.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl glass-card-hover border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center mb-6 shadow-md shadow-indigo-600/25">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Padlock Activity Pinning</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Lock the must-visit stops you already booked or love. When you ask the AI to regenerate or refine the schedule, locked activities stay preserved in place.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl glass-card-hover border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-brand-600 text-white flex items-center justify-center mb-6 shadow-md shadow-purple-600/25">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Live Companion Collaboration</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Invite travel companions with viewer or editor roles, generate instant view-only public share links, and keep everyone synced in real time.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-brand-950 to-slate-950 opacity-90" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Your Next Journey Starts Here
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Generate a custom itinerary tailored to your exact rhythm in under 10 seconds. Completely free, no credit card required.
            </p>
            <div className="pt-3">
              <Link
                to="/wizard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-950 font-black text-sm hover:bg-brand-50 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
              >
                Start Planning Free
                <ArrowRight className="w-4 h-4 text-brand-600" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
