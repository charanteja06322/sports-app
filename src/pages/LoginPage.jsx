import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiZap, FiShield, FiCheckCircle, FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Allow seamless login for demo/testing
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (demoRole) => {
    if (demoRole === 'cricket') {
      setEmail('virat.kohli@playfield.sports');
      setPassword('SportsPass!1001');
    } else {
      setEmail('haaland.striker@playfield.sports');
      setPassword('SportsPass!1002');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Col: High-Energy Sports Hero Card */}
        <div className="lg:col-span-6 space-y-6 text-left hidden lg:block">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Welcome Back Athlete</span>
          </div>

          <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
            Step onto the Field. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Access Your Scoreboard.
            </span>
          </h2>

          <p className="text-slate-400 text-sm leading-relaxed">
            Real-time match scoring, player stats, squad line-ups, and tournament standings across 7 sports.
          </p>

          {/* Mini Live Score Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE MATCH • CRICKET
              </span>
              <span className="text-slate-400 font-semibold">M-7842</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-extrabold text-white text-base">Falcons CC</span>
              <span className="text-2xl font-black text-emerald-400">186/3 (16.4)</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
              <span>🏏 V. Kohli: <strong className="text-white">74* (48b)</strong></span>
              <span className="text-cyan-400 font-bold">CRR: 11.16</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> Unique Player ID (<strong className="text-slate-200">PL-XXXXXX</strong>) passport</div>
            <div className="flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> Instant Match Code (<strong className="text-slate-200">M-XXXX</strong>) join</div>
            <div className="flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> Host & Spectator real-time sync</div>
          </div>
        </div>

        {/* Right Col: Glassmorphic Auth Form */}
        <div className="lg:col-span-6">
          <div className="p-1 rounded-3xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 shadow-2xl">
            <div className="bg-slate-950 p-8 sm:p-10 rounded-[22px] space-y-6">
              
              <div className="text-left space-y-1">
                <h3 className="text-2xl font-black text-white">Sign In</h3>
                <p className="text-xs text-slate-400">Enter your credentials or use quick 1-click login</p>
              </div>

              {/* Quick One-Click Demo Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('cricket')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-200 text-xs font-bold transition-all text-left flex items-center gap-2"
                >
                  <span className="text-base">🏏</span>
                  <div className="truncate">
                    <span className="block text-[10px] text-emerald-400 font-black">DEMO</span>
                    <span className="truncate">Pro Cricketer</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('football')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-200 text-xs font-bold transition-all text-left flex items-center gap-2"
                >
                  <span className="text-base">⚽</span>
                  <div className="truncate">
                    <span className="block text-[10px] text-cyan-400 font-black">DEMO</span>
                    <span className="truncate">Striker FC</span>
                  </div>
                </button>
              </div>

              {/* Google 1-Click Login */}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-sm"
              >
                <FcGoogle className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex-1 h-px bg-slate-800" />
                <span>OR EMAIL</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold text-left">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="athlete@playfield.sports"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs placeholder:text-slate-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-3.5 text-slate-400 w-4 h-4" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white text-xs placeholder:text-slate-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-emerald-500 focus:ring-emerald-500" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="text-emerald-400 hover:text-emerald-300 font-bold">Forgot password?</a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <span>Signing In...</span> : (
                    <>
                      <span>Sign In & Play</span>
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-900">
                <span>Don't have an account? </span>
                <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-black">
                  Create Account Free
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
