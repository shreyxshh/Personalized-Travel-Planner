import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Sparkles, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, loginAsDemo, supabaseConfigured } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate(redirectPath, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 rounded-b-full opacity-80" />

        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Sign In to Voyex</h2>
          <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
            Access your saved itineraries, custom routes, and travel preferences.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200/80 flex items-center gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-slate-900 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-slate-900 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/20 hover:shadow-lg hover:shadow-brand-600/30 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/80 px-3 text-slate-400 font-semibold tracking-wider text-[10px]">
              Or for quick testing
            </span>
          </div>
        </div>

        {/* 1-Click Demo Login Button (Only activated on user action) */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 hover:border-slate-300"
        >
          <Sparkles className="w-4 h-4 text-brand-600" />
          Continue as Demo Explorer
        </button>

        <p className="text-center text-xs text-slate-500 pt-1">
          Don't have an account yet?{' '}
          <Link
            to={redirectPath !== '/dashboard' ? `/register?redirect=${encodeURIComponent(redirectPath)}` : '/register'}
            className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};
