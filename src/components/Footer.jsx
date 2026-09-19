import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiShield, FiZap, FiGithub, FiTwitter, FiInstagram, FiHeart } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sports = [
    { name: '🏏 Cricket Scoring Hub', link: '/matches' },
    { name: '⚽ Football Match Tracker', link: '/matches' },
    { name: '🏀 Basketball Points & Fouls', link: '/matches' },
    { name: '🏸 Badminton & Racquet Console', link: '/matches' },
    { name: '🎾 Tennis Tournaments', link: '/matches' },
    { name: '🏐 Volleyball & Beach Sets', link: '/matches' },
  ];

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-emerald-400 text-base">
                  ⚡
                </div>
              </div>
              <span className="font-black text-xl tracking-tight text-white">EZKORA SPORTS</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The next-generation multi-sport platform for live scoring, squad management, instant player IDs, and real-time tournament brackets.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational • Supabase PostgreSQL</span>
            </div>
          </div>

          {/* Sports Supported */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider text-white mb-4">Supported Sports</h4>
            <ul className="space-y-2.5">
              {sports.map((sp, i) => (
                <li key={i}>
                  <Link to={sp.link} className="hover:text-emerald-400 transition-colors">
                    {sp.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider text-white mb-4">Features</h4>
            <ul className="space-y-2.5">
              <li><Link to="/matches" className="hover:text-emerald-400 transition-colors">Stadium Scoring Console</Link></li>
              <li><Link to="/profile" className="hover:text-emerald-400 transition-colors">Player ID Passport (PL-XXXX)</Link></li>
              <li><Link to="/teams" className="hover:text-emerald-400 transition-colors">Squad Rosters & Formation</Link></li>
              <li><Link to="/matches" className="hover:text-emerald-400 transition-colors">Match Code Invite (M-XXXX)</Link></li>
              <li><Link to="/settings" className="hover:text-emerald-400 transition-colors">Responsive iOS & Tablet UI</Link></li>
            </ul>
          </div>

          {/* Connect & Legal */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Create Free Account</Link></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500">
            &copy; {currentYear} EZKORA Sports Platform. Engineered for athletes and tournament directors.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">Built with <FiHeart className="text-emerald-400 inline" /> for Sports</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
