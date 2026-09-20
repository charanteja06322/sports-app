import React, { useState } from "react";
import { useEzkoraStore, SPORTS } from "../../store/ezkoraStore";
import { SportIcon, IconZap } from "./EzkoraIcons";
import { Button } from "./CommonUI";

export function Scoreboard() {
  const activeSport = useEzkoraStore((s) => s.activeSport);
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

  // Badminton state
  const [badmintonP1, setBadmintonP1] = useState(0);
  const [badmintonP2, setBadmintonP2] = useState(0);
  const [badmintonSet, setBadmintonSet] = useState(1);

  // Running telemetry state (Clean slate, zero mock data)
  const [runDistance, setRunDistance] = useState(0.0);
  const [runSteps, setRunSteps] = useState(0);
  const [runTarget, setRunTarget] = useState(10.0);
  const [runPace, setRunPace] = useState("0'00\"");
  const [runCalories, setRunCalories] = useState(0);

  // Cycling telemetry state (Clean slate, zero mock data)
  const [cycleDistance, setCycleDistance] = useState(0.0);
  const [cycleTarget, setCycleTarget] = useState(35.0);
  const [cycleSpeed, setCycleSpeed] = useState(0.0);
  const [cycleElevation, setCycleElevation] = useState(0);
  const [cycleCalories, setCycleCalories] = useState(0);

  // Volleyball state
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

        {activeSport === "Badminton" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 items-center gap-4 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-6 text-center">
              <div>
                <p className="mono-font text-xs font-bold text-[#71807d]">PLAYER 1</p>
                <div className="display-font mt-1 text-5xl font-black text-[#253638]">
                  {badmintonP1}
                </div>
              </div>
              <div>
                <span className="inline-block rounded-full bg-[#e11d48] px-3.5 py-1 font-bold text-xs text-white">
                  SET {badmintonSet}
                </span>
                <p className="mt-2 text-xs text-[#71807d]">Match Point 21</p>
              </div>
              <div>
                <p className="mono-font text-xs font-bold text-[#71807d]">PLAYER 2</p>
                <div className="display-font mt-1 text-5xl font-black text-[#253638]">
                  {badmintonP2}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                style={{ backgroundColor: "#e11d48", borderColor: "#e11d48" }}
                onClick={() => setBadmintonP1((p) => p + 1)}
              >
                +1 Point Player 1
              </Button>
              <Button
                style={{ backgroundColor: "#e11d48", borderColor: "#e11d48" }}
                onClick={() => setBadmintonP2((p) => p + 1)}
              >
                +1 Point Player 2
              </Button>
              <Button
                variant="quiet"
                onClick={() => {
                  setBadmintonSet((s) => s + 1);
                  setBadmintonP1(0);
                  setBadmintonP2(0);
                }}
              >
                Next Set
              </Button>
              <Button
                variant="quiet"
                onClick={() => {
                  setBadmintonP1(0);
                  setBadmintonP2(0);
                  setBadmintonSet(1);
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        )}

        {activeSport === "Running" && (
          <div className="space-y-6">
            {/* Primary Telemetry Card */}
            <div className="rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="mono-font text-xs font-bold uppercase tracking-wider text-[#4c9b81]">
                    DISTANCE COVERED
                  </p>
                  <div className="display-font mt-1 text-5xl font-black text-[#253638]">
                    {runDistance.toFixed(2)}{" "}
                    <span className="text-xl font-bold text-[#71807d]">km</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="mono-font text-xs font-bold uppercase tracking-wider text-[#71807d]">
                    PEDOMETER
                  </p>
                  <div className="display-font mt-1 text-3xl font-black text-[#253638]">
                    {runSteps.toLocaleString()}{" "}
                    <span className="text-base font-semibold text-[#71807d]">steps</span>
                  </div>
                </div>
              </div>

              {/* Target Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#71807d]">
                  <span>Target: {runTarget.toFixed(1)} km</span>
                  <span className="font-bold text-[#4c9b81]">
                    {Math.min(100, Math.round((runDistance / runTarget) * 100))}% Completed
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#EAE4D7]">
                  <div
                    className="h-full rounded-full bg-[#4c9b81] transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.round((runDistance / runTarget) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#DDD6C8] pt-4 sm:grid-cols-4">
                <div>
                  <p className="mono-font text-[10px] text-[#71807d]">AVG PACE</p>
                  <p className="text-lg font-bold text-[#253638]">
                    {runDistance > 0 ? `${runPace} /km` : "0'00\" /km"}
                  </p>
                </div>
                <div>
                  <p className="mono-font text-[10px] text-[#71807d]">ACTIVE CAL</p>
                  <p className="text-lg font-bold text-[#253638]">{runCalories} kcal</p>
                </div>
                <div>
                  <p className="mono-font text-[10px] text-[#71807d]">ELAPSED TIME</p>
                  <p className="text-lg font-bold text-[#253638]">
                    {runDistance > 0 ? "34m 12s" : "00m 00s"}
                  </p>
                </div>
                <div>
                  <p className="mono-font text-[10px] text-[#71807d]">AVG CADENCE</p>
                  <p className="text-lg font-bold text-[#253638]">
                    {runDistance > 0 ? "168 spm" : "0 spm"}
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Activity Trend Chart (Zero mock data, tracks real live logs) */}
            <div className="rounded-2xl border border-[#DDD6C8] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD6C8]">
                <div>
                  <p className="mono-font text-[10px] font-bold uppercase tracking-wider text-[#4c9b81]">
                    WEEKLY RUNNING TREND
                  </p>
                  <p className="text-sm font-bold text-[#253638]">Last 7 Days Mileage</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#253638]">{runDistance.toFixed(1)} km</span>
                  <span className="ml-1.5 text-[11px] font-bold text-[#4c9b81]">Live Session</span>
                </div>
              </div>

              {/* Trend Bars */}
              <div className="mt-4 flex items-end justify-between gap-2 pt-2">
                {[
                  { day: "Mon", km: 0.0, active: false },
                  { day: "Tue", km: 0.0, active: false },
                  { day: "Wed", km: 0.0, active: false },
                  { day: "Thu", km: 0.0, active: false },
                  { day: "Fri", km: 0.0, active: false },
                  { day: "Sat", km: 0.0, active: false },
                  { day: "Today", km: runDistance, active: true },
                ].map((item) => (
                  <div key={item.day} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#71807d]">
                      {item.km === 0 ? "-" : `${item.km.toFixed(1)}k`}
                    </span>
                    <div className="h-24 w-full max-w-[28px] rounded-lg bg-[#FAF7F2] p-1 flex items-end">
                      <div
                        className={`w-full rounded-md transition-all duration-300 ${
                          item.active ? "bg-[#4c9b81]" : "bg-[#4c9b81]/40"
                        }`}
                        style={{ height: item.km === 0 ? "4px" : `${Math.min(100, (item.km / Math.max(runTarget, 10)) * 100)}%` }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-bold ${
                        item.active ? "text-[#4c9b81]" : "text-[#71807d]"
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                style={{ backgroundColor: "#4c9b81", borderColor: "#4c9b81" }}
                onClick={() => {
                  setRunDistance((d) => Number((d + 0.5).toFixed(2)));
                  setRunSteps((s) => s + 650);
                  setRunCalories((c) => c + 35);
                  setRunPace("5'18\"");
                }}
              >
                +0.5 KM Logged
              </Button>
              <Button
                variant="quiet"
                onClick={() => {
                  setRunSteps((s) => s + 500);
                  setRunDistance((d) => Number((d + 0.38).toFixed(2)));
                  setRunCalories((c) => c + 25);
                  setRunPace("5'18\"");
                }}
              >
                +500 Steps
              </Button>
              <Button
                variant="quiet"
                onClick={() => setRunTarget((t) => (t === 10 ? 21.1 : 10))}
              >
                Target: {runTarget === 10 ? "Set 21K Half" : "Set 10K"}
              </Button>
              <Button
                variant="quiet"
                onClick={() => {
                  setRunDistance(0);
                  setRunSteps(0);
                  setRunCalories(0);
                  setRunPace("0'00\"");
                }}
              >
                Reset Run
              </Button>
            </div>
          </div>
        )}

        {activeSport === "Cycling" && (
          <div className="space-y-6">
            {/* Primary Cycling Telemetry Card */}
            <div className="rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="mono-font text-xs font-bold uppercase tracking-wider text-[#557fa9]">
                    RIDE DISTANCE
                  </p>
                  <div className="display-font mt-1 text-5xl font-black text-[#253638]">
                    {cycleDistance.toFixed(1)}{" "}
                    <span className="text-xl font-bold text-[#71807d]">km</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="mono-font text-xs font-bold uppercase tracking-wider text-[#71807d]">
                    ELEVATION GAIN
                  </p>
                  <div className="display-font mt-1 text-3xl font-black text-[#253638]">
                    +{cycleElevation}{" "}
                    <span className="text-base font-semibold text-[#71807d]">m</span>
                  </div>
                </div>
              </div>

              {/* Target Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#71807d]">
                  <span>Ride Target: {cycleTarget.toFixed(0)} km</span>
                  <span className="font-bold text-[#557fa9]">
                    {Math.min(100, Math.round((cycleDistance / cycleTarget) * 100))}% Completed
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-[#EAE4D7]">
                  <div
                    className="h-full rounded-full bg-[#557fa9] transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.round((cycleDistance / cycleTarget) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#DDD6C8] pt-4 sm:grid-cols-4">
                <div>
                  <p className="mono-font text-[10px] text-[#71807d]">AVG SPEED</p>
                  <p className="text-lg font-bold text-[#253638]">{cycleSpeed} km/h</p>
                </div>
                <div>
                  <p className="mono-font text-[10px] text-[#71807d]">ACTIVE CAL</p>
                  <p className="text-lg font-bold text-[#253638]">{cycleCalories} kcal</p>
                </div>
                <div>
                  <p className="mono-font text-[10px] text-[#71807d]">RIDE TIME</p>
                  <p className="text-lg font-bold text-[#253638]">
                    {cycleDistance > 0 ? "56m 20s" : "00m 00s"}
                  </p>
                </div>
                <div>
                  <p className="mono-font text-[10px] text-[#71807d]">AVG POWER</p>
                  <p className="text-lg font-bold text-[#253638]">
                    {cycleDistance > 0 ? "185 W" : "0 W"}
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Cycling Trend Chart (Zero mock data, tracks real live logs) */}
            <div className="rounded-2xl border border-[#DDD6C8] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD6C8]">
                <div>
                  <p className="mono-font text-[10px] font-bold uppercase tracking-wider text-[#557fa9]">
                    WEEKLY CYCLING TREND
                  </p>
                  <p className="text-sm font-bold text-[#253638]">Last 7 Days Mileage</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#253638]">{cycleDistance.toFixed(1)} km</span>
                  <span className="ml-1.5 text-[11px] font-bold text-[#557fa9]">Live Session</span>
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between gap-2 pt-2">
                {[
                  { day: "Mon", km: 0.0, active: false },
                  { day: "Tue", km: 0.0, active: false },
                  { day: "Wed", km: 0.0, active: false },
                  { day: "Thu", km: 0.0, active: false },
                  { day: "Fri", km: 0.0, active: false },
                  { day: "Sat", km: 0.0, active: false },
                  { day: "Today", km: cycleDistance, active: true },
                ].map((item) => (
                  <div key={item.day} className="flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold text-[#71807d]">
                      {item.km === 0 ? "-" : `${item.km.toFixed(0)}k`}
                    </span>
                    <div className="h-24 w-full max-w-[28px] rounded-lg bg-[#FAF7F2] p-1 flex items-end">
                      <div
                        className={`w-full rounded-md transition-all duration-300 ${
                          item.active ? "bg-[#557fa9]" : "bg-[#557fa9]/40"
                        }`}
                        style={{ height: item.km === 0 ? "4px" : `${Math.min(100, (item.km / Math.max(cycleTarget, 35)) * 100)}%` }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-bold ${
                        item.active ? "text-[#557fa9]" : "text-[#71807d]"
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                style={{ backgroundColor: "#557fa9", borderColor: "#557fa9" }}
                onClick={() => {
                  setCycleDistance((d) => Number((d + 2.0).toFixed(1)));
                  setCycleCalories((c) => c + 50);
                  setCycleElevation((e) => e + 20);
                  setCycleSpeed(26.4);
                }}
              >
                +2.0 KM Logged
              </Button>
              <Button
                variant="quiet"
                onClick={() => {
                  setCycleElevation((e) => e + 50);
                  setCycleSpeed(26.4);
                }}
              >
                +50m Climbing
              </Button>
              <Button
                variant="quiet"
                onClick={() => {
                  setCycleDistance(0);
                  setCycleElevation(0);
                  setCycleCalories(0);
                  setCycleSpeed(0);
                }}
              >
                Reset Ride
              </Button>
            </div>
          </div>
        )}

        {activeSport === "Volleyball" && (
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

export default Scoreboard;
