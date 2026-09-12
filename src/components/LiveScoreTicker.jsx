import React from 'react';
import { FiActivity } from 'react-icons/fi';

const LIVE_SCORES = [
  { sport: '🏏 Cricket', match: 'IND vs AUS', score: '186/3 (16.4 ov)', note: 'Kohli 74*(48)', status: 'LIVE' },
  { sport: '⚽ Football', match: 'Man City vs Real Madrid', score: '2 - 1', note: "Haaland 68'", status: '74 MIN' },
  { sport: '🏀 Basketball', match: 'Lakers vs Warriors', score: '112 - 108', note: 'Q4 01:24', status: 'LIVE' },
  { sport: '🏸 Badminton', match: 'Axelsen vs Sen', score: '21-18, 19-21, 14-11', note: 'Set 3', status: 'LIVE' },
  { sport: '🎾 Tennis', match: 'Alcaraz vs Sinner', score: '6-4, 3-6, 5-4', note: 'Deuce', status: 'SET 3' },
];

export default function LiveScoreTicker() {
  return (
    <div className="bg-slate-950/90 border-b border-emerald-500/20 text-xs py-2 overflow-hidden backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-8 animate-none overflow-x-auto no-scrollbar px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-emerald-400 font-black tracking-wider uppercase flex-shrink-0 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <FiActivity className="w-3.5 h-3.5" />
          <span>Live Scores</span>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-0.5">
          {LIVE_SCORES.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 px-3 py-1 rounded-lg flex-shrink-0 transition-all cursor-pointer shadow-sm"
            >
              <span className="text-slate-400 font-medium">{item.sport}</span>
              <span className="font-bold text-slate-100">{item.match}</span>
              <span className="text-emerald-400 font-black tracking-wide bg-emerald-950/80 px-1.5 py-0.5 rounded text-[11px]">
                {item.score}
              </span>
              <span className="text-slate-400 text-[10px] hidden sm:inline">({item.note})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
