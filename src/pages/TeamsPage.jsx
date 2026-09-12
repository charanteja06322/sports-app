import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiPlusCircle, 
  FiSearch, 
  FiMapPin, 
  FiAward, 
  FiCheckCircle, 
  FiShield, 
  FiArrowRight 
} from 'react-icons/fi';

const TEAMS_DATA = [
  {
    id: 't1',
    name: 'Falcons CC',
    sport: 'Cricket',
    emoji: '🦅',
    location: 'Hyderabad, India',
    captain: 'Rahul Kumar (PL-839201)',
    members: 18,
    stats: { played: 38, won: 29, lost: 9, winRate: '76.3%' },
    level: 'Advanced / Club Tournaments',
    homeGround: 'Gymkhana Cricket Grounds',
    badge: 'LEAGUE CHAMPIONS 2025',
    color: '#00FF66',
  },
  {
    id: 't2',
    name: 'City Strikers FC',
    sport: 'Football',
    emoji: '🏙️',
    location: 'Bengaluru, India',
    captain: 'Sneha Iyer (PL-109281)',
    members: 22,
    stats: { played: 28, won: 21, lost: 7, winRate: '75.0%' },
    level: 'Semi-Pro League',
    homeGround: 'Bangalore Football Stadium',
    badge: 'CUP RUNNERS UP',
    color: '#00E5FF',
  },
  {
    id: 't3',
    name: 'Hyderabad Ballers',
    sport: 'Basketball',
    emoji: '🏀',
    location: 'Hyderabad, India',
    captain: 'Arjun Reddy (PL-10001)',
    members: 12,
    stats: { played: 24, won: 19, lost: 5, winRate: '79.1%' },
    level: 'State Championship',
    homeGround: 'Kotla Vijaya Bhaskar Reddy Stadium',
    badge: 'DIVISION 1',
    color: '#FF9100',
  },
  {
    id: 't4',
    name: 'Apex Racquet Club',
    sport: 'Badminton',
    emoji: '🏸',
    location: 'Hyderabad, India',
    captain: 'Coach Pullela (PL-309182)',
    members: 16,
    stats: { played: 42, won: 34, lost: 8, winRate: '80.9%' },
    level: 'National Ranking Circuit',
    homeGround: 'Pullela Gopichand Academy',
    badge: 'GOLD RANKED',
    color: '#E040FB',
  },
  {
    id: 't5',
    name: 'Grand Slam Aces',
    sport: 'Tennis',
    emoji: '🎾',
    location: 'Mumbai, India',
    captain: 'Vikram Mehta (PL-591021)',
    members: 14,
    stats: { played: 30, won: 22, lost: 8, winRate: '73.3%' },
    level: 'AITA Open Circuit',
    homeGround: 'MSLTA Tennis Complex',
    badge: 'AITA AFFILIATED',
    color: '#AEEA00',
  },
  {
    id: 't6',
    name: 'Titans VC',
    sport: 'Volleyball',
    emoji: '🏐',
    location: 'Chennai, India',
    captain: 'Murali K. (PL-719201)',
    members: 15,
    stats: { played: 20, won: 14, lost: 6, winRate: '70.0%' },
    level: 'Club Championship',
    homeGround: 'Jawaharlal Nehru Stadium',
    badge: 'TOP 4 SEED',
    color: '#FFD600',
  },
];

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All');
  const [joinedSquads, setJoinedSquads] = useState({});

  const filteredTeams = TEAMS_DATA.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'All' || t.sport.toLowerCase() === selectedSport.toLowerCase();
    return matchesSearch && matchesSport;
  });

  const handleJoinSquad = (teamId) => {
    setJoinedSquads(prev => ({ ...prev, [teamId]: true }));
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider mb-2">
              <FiUsers className="w-4 h-4" />
              <span>Squad & Team Rosters</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Teams & Verified Squads
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Join active club teams, track member rosters, and recruit players with Player IDs.
            </p>
          </div>

          <Link
            to="/teams/create"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <FiPlusCircle className="w-4 h-4" />
            <span>Create New Squad</span>
          </Link>
        </div>

        {/* Search & Sport Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8 relative">
            <FiSearch className="absolute left-4 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search squad by name, city, or ground..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 text-white text-xs placeholder:text-slate-500 outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 text-white text-xs font-bold outline-none"
            >
              <option value="All">All Sports</option>
              <option value="Cricket">🏏 Cricket</option>
              <option value="Football">⚽ Football</option>
              <option value="Basketball">🏀 Basketball</option>
              <option value="Badminton">🏸 Badminton</option>
              <option value="Tennis">🎾 Tennis</option>
              <option value="Volleyball">🏐 Volleyball</option>
            </select>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => {
            const hasJoined = joinedSquads[team.id];
            return (
              <div
                key={team.id}
                className="p-1 rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-800 shadow-xl hover:border-emerald-500/50 transition-all duration-300 group"
              >
                <div className="bg-slate-950 p-6 rounded-[22px] space-y-4">
                  
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {team.emoji}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white">{team.name}</h3>
                        <span className="text-xs text-emerald-400 font-bold">{team.sport}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30">
                      {team.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 border-y border-slate-900 py-3">
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-emerald-400" />
                      <span>{team.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiShield className="text-cyan-400" />
                      <span>Captain: <strong className="text-slate-200">{team.captain}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiUsers className="text-amber-400" />
                      <span>{team.members} Registered Squad Members</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-center text-xs">
                    <div>
                      <div className="text-slate-400 font-semibold text-[10px]">Played</div>
                      <div className="font-black text-white">{team.stats.played}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-semibold text-[10px]">Won</div>
                      <div className="font-black text-emerald-400">{team.stats.won}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-semibold text-[10px]">Win Rate</div>
                      <div className="font-black text-cyan-400">{team.stats.winRate}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleJoinSquad(team.id)}
                      className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                        hasJoined
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 hover:border-emerald-500/50'
                      }`}
                    >
                      {hasJoined ? '✓ Joined Squad Member' : '+ Request to Join Squad'}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
