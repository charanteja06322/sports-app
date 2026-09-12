import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiZap, 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUsers, 
  FiPlusCircle, 
  FiActivity, 
  FiFilter, 
  FiPlay,
  FiAward,
  FiCheckCircle
} from 'react-icons/fi';

const ALL_MATCHES = [
  {
    id: 'm1',
    sport: 'Cricket',
    emoji: '🏏',
    format: 'T20 (20.0 Overs)',
    league: 'Hyderabad Premier Cup',
    status: 'LIVE',
    matchCode: 'M-1001',
    teamA: { name: 'Falcons Squad', score: '186/3', overs: '16.4 ov', logo: '🦅' },
    teamB: { name: 'Titans XI', score: '178/8', overs: '20.0 ov', logo: '⚡' },
    venue: 'Gymkhana Cricket Grounds, Secunderabad',
    situation: 'Falcons need 9 runs in 20 balls (Kohli 74* off 48b)',
    host: 'Virat Kohli (PL-10001)',
  },
  {
    id: 'm2',
    sport: 'Football',
    emoji: '⚽',
    format: '11v11 (90 Mins)',
    league: 'Champions Super League',
    status: 'LIVE',
    matchCode: 'M-2042',
    teamA: { name: 'City Strikers', score: '2', overs: '74 min', logo: '🏙️' },
    teamB: { name: 'Royal Madrid', score: '1', overs: '74 min', logo: '👑' },
    venue: 'Gachibowli Stadium, Hyderabad',
    situation: 'Haaland scored 68th min • City leading',
    host: 'Erling H. (PL-20402)',
  },
  {
    id: 'm3',
    sport: 'Basketball',
    emoji: '🏀',
    format: '4 Quarters (12m)',
    league: 'National Hoop Tour',
    status: 'LIVE',
    matchCode: 'M-3081',
    teamA: { name: 'Lakers Elite', score: '108', overs: 'Q4 01:20', logo: '🟣' },
    teamB: { name: 'Warriors BC', score: '104', overs: 'Q4 01:20', logo: '🟡' },
    venue: 'Indoor Basketball Arena',
    situation: 'Curry 32 Pts • Lakers in possession',
    host: 'LeBron J. (PL-30011)',
  },
  {
    id: 'm4',
    sport: 'Badminton',
    emoji: '🏸',
    format: 'Best of 3 Sets (21 Pts)',
    league: 'All India Badminton Masters',
    status: 'UPCOMING',
    matchCode: 'M-4012',
    teamA: { name: 'L. Sen (IND)', score: '-', overs: 'Tomorrow', logo: '🏸' },
    teamB: { name: 'V. Axelsen (DEN)', score: '-', overs: '4:00 PM', logo: '🏸' },
    venue: 'Pullela Gopichand Academy, Hyderabad',
    situation: 'Men Singles Quarter-Final',
    host: 'Academy Director (PL-40192)',
  },
  {
    id: 'm5',
    sport: 'Cricket',
    emoji: '🏏',
    format: 'T20 Turf Match',
    league: 'Corporate Weekend Trophy',
    status: 'COMPLETED',
    matchCode: 'M-1090',
    teamA: { name: 'Cyber Titans', score: '164/6', overs: '20.0 ov', logo: '💻' },
    teamB: { name: 'Fintech Lions', score: '165/4', overs: '18.2 ov', logo: '🦁' },
    venue: 'Skyline Turf Arena, Madhapur',
    situation: 'Fintech Lions won by 6 wickets (POTM: Rahul K.)',
    host: 'Rahul Kumar (PL-839201)',
  },
];

const SPORTS_FILTERS = ['All Sports', 'Cricket', 'Football', 'Basketball', 'Badminton', 'Tennis', 'Volleyball'];
const STATUS_FILTERS = ['ALL', 'LIVE', 'UPCOMING', 'COMPLETED'];

export default function MatchesPage() {
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [matchCodeInput, setMatchCodeInput] = useState('');
  const [joinedMessage, setJoinedMessage] = useState('');

  const filteredMatches = ALL_MATCHES.filter((m) => {
    const matchSport = selectedSport === 'All Sports' || m.sport.toLowerCase() === selectedSport.toLowerCase();
    const matchStatus = selectedStatus === 'ALL' || m.status === selectedStatus;
    return matchSport && matchStatus;
  });

  const handleJoinByCode = (e) => {
    e.preventDefault();
    if (matchCodeInput.trim()) {
      setJoinedMessage(`Joined match ${matchCodeInput.toUpperCase()} as Spectator/Player!`);
      setTimeout(() => {
        setJoinedMessage('');
        setShowJoinModal(false);
        setMatchCodeInput('');
      }, 2000);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Live Stadium Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Live & Scheduled Matches
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Ball-by-ball updates, live scoreboards, and instant match code invites.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowJoinModal(true)}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              🎟️ Join with Code
            </button>

            <button
              onClick={() => setShowJoinModal(true)}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <FiPlusCircle className="w-4 h-4" />
              <span>Create Match</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            {STATUS_FILTERS.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-4 py-2 rounded-full text-xs font-black tracking-wider transition-all ${
                  selectedStatus === st
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {st === 'LIVE' ? '🔴 LIVE' : st}
              </button>
            ))}
          </div>

          {/* Sport Selector Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {SPORTS_FILTERS.map((sp) => (
              <button
                key={sp}
                onClick={() => setSelectedSport(sp)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedSport === sp
                    ? 'bg-slate-800 text-emerald-400 border-emerald-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMatches.map((m) => (
            <div
              key={m.id}
              className="p-1 rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-800/90 shadow-xl hover:border-emerald-500/50 transition-all duration-300 group"
            >
              <div className="bg-slate-950/95 p-6 rounded-[22px] space-y-5">
                
                {/* Match Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{m.emoji}</span>
                    <div>
                      <h3 className="text-sm font-black text-white">{m.league}</h3>
                      <span className="text-[11px] text-slate-400 font-semibold">{m.format}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.status === 'LIVE' ? (
                      <span className="px-2.5 py-1 rounded-full bg-red-950 border border-red-500/40 text-red-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        LIVE SCORING
                      </span>
                    ) : m.status === 'COMPLETED' ? (
                      <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-black uppercase">
                        FINISHED
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 text-[10px] font-black uppercase">
                        UPCOMING
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-mono font-bold border border-slate-800">
                      {m.matchCode}
                    </span>
                  </div>
                </div>

                {/* Scoreboard Arena */}
                <div className="grid grid-cols-2 gap-4 py-4 px-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 items-center">
                  
                  {/* Team A */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl p-1 bg-slate-800 rounded-lg">{m.teamA.logo}</span>
                      <span className="font-extrabold text-white text-sm truncate">{m.teamA.name}</span>
                    </div>
                    <div className="text-2xl font-black text-emerald-400">{m.teamA.score}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{m.teamA.overs}</div>
                  </div>

                  {/* Team B */}
                  <div className="space-y-1 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-extrabold text-white text-sm truncate">{m.teamB.name}</span>
                      <span className="text-xl p-1 bg-slate-800 rounded-lg">{m.teamB.logo}</span>
                    </div>
                    <div className="text-2xl font-black text-cyan-400">{m.teamB.score}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{m.teamB.overs}</div>
                  </div>

                </div>

                {/* Situation & Location */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-900/40 rounded-xl border border-slate-800/60 text-slate-300 font-semibold flex items-center justify-between">
                    <span>⚡ {m.situation}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5"><FiMapPin className="text-emerald-400" /> {m.venue}</span>
                    <span className="text-slate-500">Host: {m.host}</span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2">
                  <button
                    onClick={() => alert(`Opening Live Match Console for ${m.matchCode}...`)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-center gap-2 group-hover:border-emerald-500/40"
                  >
                    <FiPlay className="text-emerald-400 w-3.5 h-3.5" />
                    <span>Open Live Scoring Stadium Console</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Join Match Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-white">Join Match by Code</h3>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {joinedMessage ? (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-center text-xs">
                  {joinedMessage}
                </div>
              ) : (
                <form onSubmit={handleJoinByCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Enter 6-Character Match Code (e.g. M-1001)
                    </label>
                    <input
                      type="text"
                      required
                      value={matchCodeInput}
                      onChange={(e) => setMatchCodeInput(e.target.value.toUpperCase())}
                      placeholder="M-XXXX"
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-center text-lg font-black tracking-widest focus:border-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    <button type="button" className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                      🔵 Join Team A
                    </button>
                    <button type="button" className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-400">
                      🔴 Join Team B
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
                  >
                    Enter Live Scoreboard
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
