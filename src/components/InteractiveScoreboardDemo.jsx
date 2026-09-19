import React, { useState } from 'react';
import { FiRefreshCw, FiZap, FiShield, FiTrendingUp, FiAward } from 'react-icons/fi';

export default function InteractiveScoreboardDemo() {
  const [selectedSport, setSelectedSport] = useState('Cricket');
  
  // Cricket State
  const [runs, setRuns] = useState(148);
  const [wickets, setWickets] = useState(2);
  const [overs, setOvers] = useState(14.2);
  const [batsmanRuns, setBatsmanRuns] = useState(64);
  const [batsmanBalls, setBatsmanBalls] = useState(41);
  const [recentBalls, setRecentBalls] = useState(['1', '4', '0', '6', '1', '2']);

  // Football State
  const [scoreA, setScoreA] = useState(2);
  const [scoreB, setScoreB] = useState(1);
  const [minutes, setMinutes] = useState(72);
  const [events, setEvents] = useState([
    { min: "24'", text: '⚽ Goal by Haaland (MCI)' },
    { min: "51'", text: '⚽ Goal by Vinicius Jr (RMA)' },
    { min: "68'", text: '⚽ Goal by De Bruyne (MCI)' }
  ]);

  const handleCricketAction = (val) => {
    if (val === 'W') {
      if (wickets < 10) {
        setWickets(prev => prev + 1);
        setRecentBalls(prev => ['W', ...prev.slice(0, 5)]);
      }
    } else {
      const num = parseInt(val, 10);
      setRuns(prev => prev + num);
      setBatsmanRuns(prev => prev + num);
      setBatsmanBalls(prev => prev + 1);
      setRecentBalls(prev => [val, ...prev.slice(0, 5)]);
    }
  };

  const handleFootballGoal = (team) => {
    if (team === 'A') {
      setScoreA(prev => prev + 1);
      setEvents(prev => [{ min: `${minutes}'`, text: '⚽ Goal scored for Team A!' }, ...prev.slice(0, 3)]);
    } else {
      setScoreB(prev => prev + 1);
      setEvents(prev => [{ min: `${minutes}'`, text: '⚽ Goal scored for Team B!' }, ...prev.slice(0, 3)]);
    }
  };

  const handleReset = () => {
    setRuns(148);
    setWickets(2);
    setBatsmanRuns(64);
    setBatsmanBalls(41);
    setRecentBalls(['1', '4', '0', '6', '1', '2']);
    setScoreA(2);
    setScoreB(1);
  };

  return (
    <div className="relative rounded-3xl p-1 bg-gradient-to-b from-emerald-500/40 via-cyan-500/20 to-slate-900 border border-emerald-500/30 shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] backdrop-blur-xl">
      <div className="bg-slate-950/95 rounded-[22px] p-6 sm:p-8 text-left space-y-6">
        
        {/* Console Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Live Match Engine Demo
                </span>
                <span className="text-slate-400 text-xs font-semibold">Match Code: <strong className="text-white">M-7842</strong></span>
              </div>
              <h4 className="text-lg font-black text-white tracking-tight mt-1">EZKORA Stadium Scoring Console</h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedSport('Cricket')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSport === 'Cricket'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🏏 Cricket
            </button>
            <button
              onClick={() => setSelectedSport('Football')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSport === 'Football'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ⚽ Football
            </button>
            <button
              onClick={handleReset}
              title="Reset Demo"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Score Display */}
        {selectedSport === 'Cricket' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇮🇳</span>
                    <span className="font-extrabold text-white text-base">Royal Challengers</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">Batting</span>
                  </div>
                  <span className="text-xs text-slate-400">CRR: <strong className="text-white">{(runs / 14.3).toFixed(2)}</strong></span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tight">
                    {runs}/{wickets}
                  </span>
                  <span className="text-slate-400 font-semibold text-lg">({overs} Overs)</span>
                </div>

                <div className="flex items-center gap-4 text-xs pt-1">
                  <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                    <span className="text-emerald-400 font-bold">🏏 V. Kohli*</span>: <strong className="text-white">{batsmanRuns}</strong> ({batsmanBalls}b)
                  </div>
                  <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-slate-300">
                    <span>F. du Plessis</span>: <strong className="text-white">48</strong> (32b)
                  </div>
                </div>
              </div>

              {/* Recent Balls */}
              <div className="flex flex-col justify-between bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">This Over</span>
                <div className="flex items-center gap-1.5 my-2">
                  {recentBalls.map((ball, i) => (
                    <span
                      key={i}
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                        ball === '4'
                          ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                          : ball === '6'
                          ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/30'
                          : ball === 'W'
                          ? 'bg-red-500 text-white animate-bounce'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {ball}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] text-slate-500">Bowler: <strong className="text-slate-300">P. Cummins (3.2-0-28-1)</strong></span>
              </div>
            </div>

            {/* Interactive Cricket Keypad */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tap to Score Live Ball</span>
                <span className="text-[11px] text-emerald-400 font-medium">✨ Real-time state synchronized</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {['0', '1', '2', '3'].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleCricketAction(r)}
                    className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-extrabold text-sm transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    +{r}
                  </button>
                ))}
                <button
                  onClick={() => handleCricketAction('4')}
                  className="py-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-400 font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  +4 🔥
                </button>
                <button
                  onClick={() => handleCricketAction('6')}
                  className="py-3 rounded-xl bg-amber-950/80 hover:bg-amber-900/80 border border-amber-500/40 text-amber-400 font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  +6 🚀
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <button
                  onClick={() => handleCricketAction('W')}
                  className="py-2.5 rounded-xl bg-red-950/70 hover:bg-red-900/70 border border-red-500/40 text-red-400 font-extrabold text-xs transition-all hover:scale-105 active:scale-95"
                >
                  WICKET ⚡
                </button>
                <button
                  onClick={() => handleCricketAction('1')}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs"
                >
                  WIDE (+1)
                </button>
                <button
                  onClick={() => handleCricketAction('1')}
                  className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs"
                >
                  NO BALL (+1)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Football Demo */
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 text-center space-y-4">
              <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Champions League • Second Half ({minutes}')</div>
              
              <div className="flex items-center justify-around">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-xl mx-auto">
                    🏙️
                  </div>
                  <span className="font-extrabold text-white text-sm block">Man City</span>
                </div>

                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  {scoreA} - {scoreB}
                </div>

                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-amber-950 border border-amber-500/40 flex items-center justify-center text-xl mx-auto">
                    👑
                  </div>
                  <span className="font-extrabold text-white text-sm block">Real Madrid</span>
                </div>
              </div>

              {/* Goal Timeline */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-left text-xs space-y-1 max-h-24 overflow-y-auto">
                {events.map((ev, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300">
                    <span className="font-bold text-cyan-400">{ev.min}</span>
                    <span>{ev.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Football Keypad */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleFootballGoal('A')}
                className="py-3 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-300 font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>⚽ Goal (Man City)</span>
              </button>
              <button
                onClick={() => handleFootballGoal('B')}
                className="py-3 rounded-xl bg-amber-950/80 hover:bg-amber-900/80 border border-amber-500/50 text-amber-300 font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>⚽ Goal (Real Madrid)</span>
              </button>
            </div>
          </div>
        )}

        {/* Feature Pill Footer */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-semibold text-slate-400 border-t border-slate-900">
          <div className="flex items-center gap-1.5"><FiZap className="text-emerald-400" /> Instant Cloud Sync</div>
          <div className="flex items-center gap-1.5"><FiShield className="text-cyan-400" /> Host-Only Scoring</div>
          <div className="flex items-center gap-1.5"><FiAward className="text-amber-400" /> Match Code Access</div>
        </div>

      </div>
    </div>
  );
}
