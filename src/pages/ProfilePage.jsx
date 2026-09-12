import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiUser, 
  FiAward, 
  FiSettings, 
  FiShare2, 
  FiMapPin, 
  FiCheckCircle, 
  FiShield, 
  FiLogOut,
  FiZap,
  FiActivity
} from 'react-icons/fi';

const SPORT_STATS = {
  Cricket: {
    role: 'Top Order Batter • Right Hand',
    primaryTeam: 'Falcons CC',
    stat1: { label: 'Matches', val: '38' },
    stat2: { label: 'Runs', val: '1,482' },
    stat3: { label: 'Batting Avg', val: '52.9' },
    stat4: { label: 'Strike Rate', val: '158.4' },
    matches: [
      { vs: 'Royal Strikers', score: '86* (52b)', result: 'Won by 6 wkts', potm: true, date: 'Yesterday' },
      { vs: 'Warriors XI', score: '42 (31b)', result: 'Lost by 3 runs', potm: false, date: '3 days ago' },
      { vs: 'Titans CC', score: '74 (44b)', result: 'Won by 22 runs', potm: true, date: '1 week ago' },
    ]
  },
  Basketball: {
    role: 'Point Guard • Playmaker',
    primaryTeam: 'Hyderabad Ballers',
    stat1: { label: 'Games', val: '24' },
    stat2: { label: 'PPG', val: '24.8' },
    stat3: { label: 'Assists', val: '8.4 APG' },
    stat4: { label: 'FG %', val: '48.5%' },
    matches: [
      { vs: 'Lakers BC', score: '28 Pts, 9 Ast', result: 'Won 112 - 108', potm: true, date: '2 days ago' },
      { vs: 'Warriors BC', score: '22 Pts, 11 Ast', result: 'Won 98 - 94', potm: false, date: '5 days ago' },
    ]
  },
  Football: {
    role: 'Center Forward • Striker',
    primaryTeam: 'City Strikers FC',
    stat1: { label: 'Matches', val: '28' },
    stat2: { label: 'Goals', val: '32' },
    stat3: { label: 'Assists', val: '14' },
    stat4: { label: 'Shot Conv.', val: '24.5%' },
    matches: [
      { vs: 'United SC', score: '2 Goals, 1 Ast', result: 'Won 3 - 2', potm: true, date: 'Yesterday' },
      { vs: 'Rovers FC', score: '1 Goal', result: 'Won 2 - 0', potm: false, date: '4 days ago' },
    ]
  },
  Badminton: {
    role: 'Singles Specialist',
    primaryTeam: 'Apex Racquet Club',
    stat1: { label: 'Matches', val: '46' },
    stat2: { label: 'Wins', val: '36' },
    stat3: { label: 'Win Rate', val: '78.2%' },
    stat4: { label: 'Titles', val: '5 Won' },
    matches: [
      { vs: 'K. Srikanth', score: '21-18, 21-15', result: 'Won (2-0)', potm: true, date: '2 days ago' },
    ]
  }
};

const SPORTS_CHOICES = ['Cricket', 'Basketball', 'Football', 'Badminton'];

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedSport, setSelectedSport] = useState('Cricket');
  const [copied, setCopied] = useState(false);

  const activeStats = SPORT_STATS[selectedSport] || SPORT_STATS.Cricket;
  const playerId = 'PL-839201';

  const handleCopyId = () => {
    navigator.clipboard?.writeText(playerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    try {
      await logout?.();
      navigate('/login');
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Card */}
        <div className="p-1 rounded-3xl bg-gradient-to-tr from-emerald-500/30 via-cyan-500/20 to-purple-600/30 shadow-2xl">
          <div className="bg-slate-950 p-6 sm:p-10 rounded-[22px] space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-[2px] shadow-lg shadow-emerald-500/20">
                  <img
                    src={currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-[14px]"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white">{currentUser?.displayName || 'Arjun Reddy'}</h2>
                    <span className="text-emerald-400 font-bold">✓</span>
                  </div>
                  <span className="text-xs text-slate-400">@{currentUser?.email?.split('@')[0] || 'arjunreddy_07'}</span>
                  
                  {/* Unique Player ID Badge */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={handleCopyId}
                      className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-black flex items-center gap-1.5 hover:scale-105 transition-all"
                    >
                      <span>🆔 PLAYER ID: {playerId}</span>
                      <span className="text-[10px] text-slate-300 font-sans">{copied ? '✓ Copied' : '📋 Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/settings"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold transition-all flex items-center gap-2"
                >
                  <FiSettings />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900/80 text-red-400 border border-red-500/40 text-xs font-bold transition-all flex items-center gap-2"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Sport Switcher Chips */}
            <div className="pt-4 border-t border-slate-900 space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Sport View:</div>
              <div className="flex flex-wrap gap-2">
                {SPORTS_CHOICES.map((sp) => (
                  <button
                    key={sp}
                    onClick={() => setSelectedSport(sp)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      selectedSport === sp
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {sp === 'Cricket' ? '🏏' : sp === 'Basketball' ? '🏀' : sp === 'Football' ? '⚽' : '🏸'} {sp}
                  </button>
                ))}
              </div>
            </div>

            {/* Career Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-center">
              <div>
                <div className="text-xs text-slate-400 font-semibold">{activeStats.stat1.label}</div>
                <div className="text-2xl font-black text-white mt-1">{activeStats.stat1.val}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">{activeStats.stat2.label}</div>
                <div className="text-2xl font-black text-emerald-400 mt-1">{activeStats.stat2.val}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">{activeStats.stat3.label}</div>
                <div className="text-2xl font-black text-cyan-400 mt-1">{activeStats.stat3.val}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">{activeStats.stat4.label}</div>
                <div className="text-2xl font-black text-amber-400 mt-1">{activeStats.stat4.val}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Matches */}
        <div className="space-y-4 text-left">
          <h3 className="text-lg font-black text-white">Recent {selectedSport} Match Performances</h3>
          <div className="space-y-3">
            {activeStats.matches.map((m, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-extrabold text-white text-sm">vs {m.vs}</div>
                  <div className="text-xs text-slate-400">{m.date} • {m.result}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-400">{m.score}</div>
                  {m.potm && <span className="text-[10px] text-amber-400 font-black">🏆 Player of the Match</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
