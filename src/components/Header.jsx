import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSport } from '../context/SportContext';
import { FiLogOut, FiMoon, FiSun, FiMenu, FiX, FiZap, FiPlusCircle, FiAward, FiShield } from 'react-icons/fi';
import { Avatar } from './ui/Avatar';
import LiveScoreTicker from './LiveScoreTicker';

const SPORTS = [
  { id: 'cricket', name: 'Cricket', icon: '🏏', color: '#00FF66' },
  { id: 'football', name: 'Football', icon: '⚽', color: '#00E5FF' },
  { id: 'basketball', name: 'Basketball', icon: '🏀', color: '#FF9100' },
  { id: 'badminton', name: 'Badminton', icon: '🏸', color: '#E040FB' },
  { id: 'tennis', name: 'Tennis', icon: '🎾', color: '#AEEA00' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐', color: '#FFD600' },
  { id: 'tabletennis', name: 'Table Tennis', icon: '🏓', color: '#FF5252' }
];

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { selectedSport, setSport } = useSport();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'Live Matches', path: '/matches' },
    { name: 'Teams & Squads', path: '/teams' },
    { name: 'Community', path: '/friends' },
  ];

  return (
    <>
      <LiveScoreTicker />
      <header className="sticky top-8 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-emerald-400 text-lg">
                  ⚡
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    EZKORA
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 tracking-wider font-semibold">SPORTS OS & SCORING</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/matches/create"
                    className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-full shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                  >
                    <FiPlusCircle className="w-4 h-4" />
                    <span>Create Match</span>
                  </Link>

                  <Link to="/profile" className="flex items-center gap-2 p-1 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all">
                    <Avatar
                      src={currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={currentUser.displayName || 'Player'}
                      initials={currentUser.displayName?.charAt(0) || 'P'}
                      size="sm"
                    />
                    <span className="text-xs font-bold text-slate-200 pr-2 hidden lg:inline">
                      {currentUser.displayName || 'My Profile'}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-slate-300 hover:text-white px-3.5 py-2 rounded-full hover:bg-slate-900 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-full shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                  >
                    🚀 Launch Free
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-800/80 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-bold text-xs"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {!currentUser ? (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20"
                  >
                    Create Account
                  </Link>
                </div>
              ) : (
                <Link
                  to="/matches/create"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full block text-center py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20"
                >
                  + Create Match
                </Link>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
