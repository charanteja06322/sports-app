import React, { useState } from "react";
import { useAervoStore, SPORTS } from "../../store/aervoStore";
import { SportIcon, IconZap } from "./AervoIcons";
import { Button } from "./CommonUI";

export function ScoreboardDemo() {
  const activeSport = useAervoStore((s) => s.activeSport);
  const sportConfig = SPORTS.find((s) => s.name === activeSport) || SPORTS[0];

  // Cricket state
  const [cricketRuns, setCricketRuns] = useState(0);
  const [cricketWickets, setCricketWickets] = useState(0);
  const [cricketBalls, setCricketBalls] = useState(0);
  const [cricketHistory, setCricketHistory] = useState([]);

  // Football state
  const [footballHome, setFootballHome] = useState(0);
  const [footballAway, setFootballAway] = useState(0);
  const [footballMinute, setFootballMinute] = useState(0);

  // Basketball state
  const [bbHome, setBbHome] = useState(0);
  const [bbAway, setBbAway] = useState(0);
  const [bbQuarter, setBbQuarter] = useState("Q1");

  // Tennis state
  const [tennisPointsHome, setTennisPointsHome] = useState("0");
  const [tennisPointsAway, setTennisPointsAway] = useState("0");
  const [tennisGamesHome, setTennisGamesHome] = useState(0);
  const [tennisGamesAway, setTennisGamesAway] = useState(0);

  // General point/split state
  const [rallyScoreA, setRallyScoreA] = useState(0);
  const [rallyScoreB, setRallyScoreB] = useState(0);

  const addCricketRun = (run) => {
    setCricketRuns((r) => r + run);
    setCricketBalls((b) => b + 1);
    setCricketHistory((h) => [...h.slice(-7), String(run)]);
  };

  const addCricketWicket = () => {
    if (cricketWickets < 10) {
      setCricketWickets((w) => w + 1);
      setCricketBalls((b) => b + 1);
      setCricketHistory((h) => [...h.slice(-7), "W"]);
    }
  };

  const resetCricket = () => {
    setCricketRuns(0);
    setCricketWickets(0);
    setCricketBalls(0);
    setCricketHistory([]);
  };

  const overs = Math.floor(cricketBalls / 6) + "." + (cricketBalls % 6);

  return (
    <div className="overflow-hidden rounded-3xl border border-[#DDD6C8] bg-white p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDD6C8] pb-5">
        <div className="flex items-center gap-3">
          <span
            className="grid size-10 place-items-center rounded-xl text-white shadow-xs"
            style={{ backgroundColor: sportConfig.accent }}
          >
            <SportIcon name={activeSport} size={18} />
          </span>
          <div>
            <h3 className="display-font text-xl font-bold tracking-tight text-[#253638]">
              Live {activeSport} Scoring Console
            </h3>
            <p className="mono-font text-[11px] uppercase tracking-wider text-[#71807d]">
              Interactive live match scoring
            </p>
          </div>
        </div>

        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
          style={{ backgroundColor: sportConfig.wash, color: sportConfig.deep }}
        >
          <span
            className="size-2 rounded-full animate-ping"
            style={{ backgroundColor: sportConfig.deep }}
          />
          READY TO SCORE
        </span>
      </div>

      {/* Sport-specific console */}
      <div className="mt-6">
        {activeSport === "Cricket" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-5 text-center">
              <div>
                <p className="mono-font text-[11px] uppercase tracking-wider text-[#71807d]">
                  Batting Team
                </p>
                <div className="display-font mt-1 text-4xl sm:text-5xl font-extrabold text-[#253638]">
                  {cricketRuns}/{cricketWickets}
                </div>
                <p className="mono-font text-xs text-[#71807d] mt-1">({overs} Overs)</p>
              </div>

              <div className="flex flex-col justify-center border-y sm:border-y-0 sm:border-x border-[#DDD6C8] py-3 sm:py-0">
                <span className="mono-font text-[10px] uppercase tracking-widest text-[#71807d]">
                  Run Rate
                </span>
                <span className="display-font mt-1 text-sm font-bold text-[#277863]">
                  CRR: {cricketBalls > 0 ? (cricketRuns / (cricketBalls / 6)).toFixed(2) : "0.00"}
                </span>
                <span className="mt-1 text-[11px] text-[#71807d]">
                  {cricketBalls} legal balls bowled
                </span>
              </div>

              <div className="flex flex-col justify-center">
                <span className="mono-font text-[10px] uppercase tracking-widest text-[#71807d] mb-2">
                  This Over
                </span>
                <div className="flex justify-center gap-1.5">
                  {cricketHistory.length === 0 ? (
                    <span className="text-xs text-[#71807d] italic">No balls bowled</span>
                  ) : (
                    cricketHistory.map((b, i) => (
                      <span
                        key={i}
                        className={`grid size-7 place-items-center rounded-full text-xs font-bold ${
                          b === "4" || b === "6"
                            ? "bg-[#277863] text-white"
                            : b === "W"
                            ? "bg-[#bd5549] text-white"
                            : "bg-white border border-[#DDD6C8] text-[#253638]"
                        }`}
                      >
                        {b}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Cricket Keypad */}
            <div>
              <p className="mono-font text-[11px] uppercase tracking-wider text-[#71807d] mb-2.5">
                Ball-by-Ball Keypad (Click to record action)
              </p>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, 6].map((run) => (
                  <button
                    key={run}
                    type="button"
                    onClick={() => addCricketRun(run)}
                    className="action-ring flex-1 min-w-[50px] rounded-xl border border-[#DDD6C8] bg-white py-2.5 text-sm font-black text-[#253638] shadow-xs hover:border-[#277863] hover:bg-[#FAF7F2] active:scale-95 transition-all"
                  >
                    +{run}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={addCricketWicket}
                  className="action-ring flex-1 min-w-[60px] rounded-xl bg-[#bd5549] py-2.5 text-sm font-black text-white shadow-xs hover:brightness-110 active:scale-95 transition-all"
                >
                  Wicket
                </button>
                <button
                  type="button"
                  onClick={resetCricket}
                  className="action-ring rounded-xl border border-[#DDD6C8] bg-[#EAE4D7] px-3 py-2.5 text-xs font-bold text-[#71807d] hover:text-[#253638]"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSport === "Football" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 items-center rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-6 text-center">
              <div>
                <p className="mono-font text-xs font-bold text-[#71807d]">HOME</p>
                <div className="display-font mt-1 text-5xl font-black text-[#253638]">
                  {footballHome}
                </div>
              </div>
              <div>
                <span className="inline-block rounded-full bg-[#ce7045] px-3 py-1 font-bold text-xs text-white">
                  {footballMinute}' Min
                </span>
                <p className="mt-2 text-xs text-[#71807d]">{footballMinute > 45 ? "Second Half" : "First Half"}</p>
              </div>
              <div>
                <p className="mono-font text-xs font-bold text-[#71807d]">AWAY</p>
                <div className="display-font mt-1 text-5xl font-black text-[#253638]">
                  {footballAway}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setFootballHome((h) => h + 1)} className="flex-1 min-w-[140px]">
                Goal Home
              </Button>
              <Button onClick={() => setFootballAway((a) => a + 1)} className="flex-1 min-w-[140px]">
                Goal Away
              </Button>
              <Button
                variant="quiet"
                onClick={() => setFootballMinute((m) => Math.min(90, m + 1))}
              >
                +1 Min
              </Button>
              <Button
                variant="quiet"
                onClick={() => {
                  setFootballHome(0);
                  setFootballAway(0);
                  setFootballMinute(0);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        )}

        {activeSport === "Basketball" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 items-center rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-6 text-center">
              <div>
                <p className="mono-font text-xs font-bold text-[#71807d]">TEAM A</p>
                <div className="display-font mt-1 text-5xl font-black text-[#253638]">
                  {bbHome}
                </div>
              </div>
              <div>
                <span className="inline-block rounded-full bg-[#d47336] px-3 py-1 font-bold text-xs text-white">
                  {bbQuarter}
                </span>
                <p className="mt-2 text-xs text-[#71807d]">Active Period</p>
              </div>
              <div>
                <p className="mono-font text-xs font-bold text-[#71807d]">TEAM B</p>
                <div className="display-font mt-1 text-5xl font-black text-[#253638]">
                  {bbAway}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setBbHome((h) => h + 1)}>Team A +1 FT</Button>
              <Button onClick={() => setBbHome((h) => h + 2)}>Team A +2 FG</Button>
              <Button onClick={() => setBbHome((h) => h + 3)}>Team A +3 3PT</Button>
              <Button variant="quiet" onClick={() => setBbAway((a) => a + 2)}>Team B +2 FG</Button>
              <Button variant="quiet" onClick={() => setBbAway((a) => a + 3)}>Team B +3 3PT</Button>
              <Button
                variant="quiet"
                onClick={() => {
                  setBbHome(0);
                  setBbAway(0);
                  setBbQuarter("Q1");
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        )}

        {activeSport === "Tennis" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 items-center rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-6 text-center">
              <div>
                <p className="mono-font text-xs font-bold text-[#71807d]">PLAYER 1</p>
                <div className="display-font mt-1 text-4xl font-black text-[#253638]">
                  Games: {tennisGamesHome}
                </div>
                <p className="display-font text-2xl font-bold text-[#b89b2e] mt-1">
                  Point: {tennisPointsHome}
                </p>
              </div>
              <div>
                <span className="inline-block rounded-full bg-[#b89b2e] px-3 py-1 font-bold text-xs text-white">
                  SET 1
                </span>
                <p className="mt-2 text-xs text-[#71807d]">Match In Progress</p>
              </div>
              <div>
                <p className="mono-font text-xs font-bold text-[#71807d]">PLAYER 2</p>
                <div className="display-font mt-1 text-4xl font-black text-[#253638]">
                  Games: {tennisGamesAway}
                </div>
                <p className="display-font text-2xl font-bold text-[#71807d] mt-1">
                  Point: {tennisPointsAway}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  const sequence = ["0", "15", "30", "40", "Game"];
                  const idx = sequence.indexOf(tennisPointsHome);
                  if (idx < 3) setTennisPointsHome(sequence[idx + 1]);
                  else {
                    setTennisPointsHome("0");
                    setTennisPointsAway("0");
                    setTennisGamesHome((g) => g + 1);
                  }
                }}
              >
                Point Player 1
              </Button>
              <Button
                variant="quiet"
                onClick={() => {
                  const sequence = ["0", "15", "30", "40", "Game"];
                  const idx = sequence.indexOf(tennisPointsAway);
                  if (idx < 3) setTennisPointsAway(sequence[idx + 1]);
                  else {
                    setTennisPointsHome("0");
                    setTennisPointsAway("0");
                    setTennisGamesAway((g) => g + 1);
                  }
                }}
              >
                Point Player 2
              </Button>
              <Button
                variant="quiet"
                onClick={() => {
                  setTennisPointsHome("0");
                  setTennisPointsAway("0");
                  setTennisGamesHome(0);
                  setTennisGamesAway(0);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        )}

        {(activeSport === "Volleyball" || activeSport === "Running" || activeSport === "Cycling") && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-6 text-center">
              <div>
                <p className="mono-font text-xs font-bold text-[#71807d]">TEAM 1</p>
                <div className="display-font mt-1 text-5xl font-black text-[#253638]">
                  {rallyScoreA}
                </div>
              </div>
              <div>
                <p className="mono-font text-xs font-bold text-[#71807d]">TEAM 2</p>
                <div className="display-font mt-1 text-5xl font-black text-[#253638]">
                  {rallyScoreB}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setRallyScoreA((s) => s + 1)} className="flex-1">
                +1 Point Team 1
              </Button>
              <Button onClick={() => setRallyScoreB((s) => s + 1)} className="flex-1" variant="quiet">
                +1 Point Team 2
              </Button>
              <Button
                variant="quiet"
                onClick={() => {
                  setRallyScoreA(0);
                  setRallyScoreB(0);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
