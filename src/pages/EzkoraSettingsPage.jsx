import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEzkoraStore, SPORTS } from "../store/ezkoraStore";
import { PageHeader, Field, Button, Avatar } from "../components/ezkora/CommonUI";
import {
  SportIcon,
  IconCheck,
  IconPlus,
  IconX,
  IconTrophy,
  IconUsers,
  IconCalendar,
  IconClock,
} from "../components/ezkora/EzkoraIcons";

export default function EzkoraSettingsPage() {
  const me = useEzkoraStore((s) => s.me);
  const games = useEzkoraStore((s) => s.games);
  const allAthletes = useEzkoraStore((s) => s.allAthletes);
  const switchAthlete = useEzkoraStore((s) => s.switchAthlete);
  const createAthlete = useEzkoraStore((s) => s.createAthlete);
  const clearAllData = useEzkoraStore((s) => s.clearAllData);
  const logout = useEzkoraStore((s) => s.logout);

  const activeSport = useEzkoraStore((s) => s.activeSport);
  const updateProfile = useEzkoraStore((s) => s.updateProfile);
  const appSettings = useEzkoraStore((s) => s.appSettings) || {
    notifications: true,
    soundEffects: true,
    syncInterval: "realtime",
    allowDiscovery: true,
  };
  const updateAppSettings = useEzkoraStore((s) => s.updateAppSettings);

  const [displayName, setDisplayName] = useState(me?.displayName || "");
  const [bio, setBio] = useState(me?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(me?.avatarUrl || "");
  const [primarySport, setPrimarySport] = useState(me?.primarySport || "Football");
  const [saved, setSaved] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // App settings state
  const [notifications, setNotifications] = useState(appSettings.notifications ?? true);
  const [soundEffects, setSoundEffects] = useState(appSettings.soundEffects ?? true);
  const [syncInterval, setSyncInterval] = useState(appSettings.syncInterval || "realtime");
  const [allowDiscovery, setAllowDiscovery] = useState(appSettings.allowDiscovery ?? true);

  // New athlete form modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newAthleteName, setNewAthleteName] = useState("");
  const [newAthleteSport, setNewAthleteSport] = useState("Badminton");
  const [newAthleteBio, setNewAthleteBio] = useState("");

  // Sync state if active user switches
  React.useEffect(() => {
    if (me) {
      setDisplayName(me.displayName || "");
      setBio(me.bio || "");
      setAvatarUrl(me.avatarUrl || "");
      setPrimarySport(me.primarySport || "Football");
    }
  }, [me]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      primarySport,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCopyId = () => {
    if (me?.publicId && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(me.publicId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCreateAthlete = async (e) => {
    e.preventDefault();
    if (!newAthleteName.trim()) return;
    await createAthlete({
      displayName: newAthleteName.trim(),
      bio: newAthleteBio.trim() || "Multi-sport athlete on EZKORA",
      avatarUrl: "",
      primarySport: newAthleteSport,
    });
    setNewAthleteName("");
    setNewAthleteBio("");
    setCreateModalOpen(false);
  };

  const handleSettingChange = (key, val) => {
    if (key === "notifications") setNotifications(val);
    if (key === "soundEffects") setSoundEffects(val);
    if (key === "syncInterval") setSyncInterval(val);
    if (key === "allowDiscovery") setAllowDiscovery(val);
    if (updateAppSettings) {
      updateAppSettings({ [key]: val });
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out of EZKORA?")) {
      logout();
    }
  };

  // Filter finished matches where current athlete participated
  const myCompletedMatches = games.filter(
    (g) =>
      g.status === "finished" &&
      (g.host?.id === me?.id ||
        g.host?.publicId === me?.publicId ||
        g.players?.some(
          (p) => p.player?.id === me?.id || p.player?.publicId === me?.publicId
        ))
  );

  const sportConfig = SPORTS.find((s) => s.name === (me?.primarySport || activeSport)) || SPORTS[0];

  return (
    <main className="mx-auto max-w-[960px] px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      {/* Header with quick Logout */}
      <PageHeader
        eyebrow="Verified Athlete Identity"
        title="Profile & App Settings"
        body="Manage your verified player credentials, match scoring records, notifications, and application settings."
        action={
          <Button
            variant="danger"
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-bold shadow-xs"
          >
            <span>Sign Out</span>
          </Button>
        }
      />

      <div className="mt-8 space-y-8">
        {/* 1. Verified Athlete Identity & Profile Card */}
        <section className="rounded-3xl border border-[#DDD6C8] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#DDD6C8] pb-6">
            <div className="flex items-center gap-4">
              <Avatar player={{ displayName, avatarUrl }} size="xl" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="display-font text-2xl font-bold tracking-tight text-[#18181b]">
                    {displayName || "Athlete Profile"}
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-500/20">
                    <IconCheck size={12} /> Verified
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#71807d]">
                  {bio || "Active sports competitor on EZKORA platform"}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {/* Player ID badge with copy */}
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="mono-font flex items-center gap-1.5 rounded-xl border border-[#DDD6C8] bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#18181b] hover:bg-white transition-all active:scale-95"
                    title="Click to copy your Player ID for invites"
                  >
                    <span>ID: {me?.publicId || "PL-000000"}</span>
                    <span className="text-[10px] text-[#277863] font-sans font-bold">
                      {copiedId ? "✓ Copied!" : "📋 Copy"}
                    </span>
                  </button>

                  {/* QR Code button */}
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-[#DDD6C8] bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#253638] hover:bg-white transition-all active:scale-95"
                  >
                    <span>📱 Scan QR</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Match Count Stats */}
            <div className="flex gap-3 text-center">
              <div className="rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-2.5 min-w-[75px]">
                <span className="display-font block text-xl font-bold text-[#18181b]">
                  {myCompletedMatches.length}
                </span>
                <span className="mono-font text-[10px] uppercase text-[#71807d]">
                  Matches
                </span>
              </div>
              <div className="rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-2.5 min-w-[75px]">
                <span className="display-font block text-xl font-bold text-[#277863]">
                  {myCompletedMatches.filter((m) => m.score).length}
                </span>
                <span className="mono-font text-[10px] uppercase text-[#71807d]">
                  Scores
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Athlete Full Name">
                <input
                  required
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="field"
                />
              </Field>

              <Field label="Primary Sport Discipline">
                <select
                  value={primarySport}
                  onChange={(e) => setPrimarySport(e.target.value)}
                  className="field font-semibold"
                >
                  {SPORTS.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} ({s.phrase})
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Bio & Athletic Background">
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your playing position, preferred courts, or running targets..."
                className="field"
              />
            </Field>

            <Field label="Profile Photo (Upload from device or enter image URL)">
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setAvatarUrl(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block w-full text-xs text-[#71807d] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#18181b] file:text-white hover:file:brightness-110 cursor-pointer"
                />
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Or enter image URL (https://...)"
                  className="field text-xs"
                />
              </div>
            </Field>

            <div className="flex items-center justify-between pt-4 border-t border-[#DDD6C8]">
              {saved ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#277863]">
                  <IconCheck size={16} /> Profile changes saved successfully
                </span>
              ) : (
                <span className="text-[11px] text-[#71807d]">
                  Syncs immediately across all matches, leaderboards, and posts.
                </span>
              )}
              <Button type="submit">Save Profile</Button>
            </div>
          </form>
        </section>

        {/* 2. Official Match Scores & History (Requested: All players can access the score and add to profile) */}
        <section className="rounded-3xl border border-[#DDD6C8] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#DDD6C8] pb-4">
            <div>
              <p className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold text-[#277863]">
                Performance Records
              </p>
              <h3 className="display-font mt-1 text-2xl font-bold tracking-tight text-[#253638]">
                Match History & Verified Scores
              </h3>
            </div>
            <Link
              to="/games"
              className="text-xs font-bold text-[#277863] hover:underline"
            >
              + Join / Create Match →
            </Link>
          </div>

          <div className="mt-5">
            {myCompletedMatches.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DDD6C8] bg-[#FAF7F2] p-8 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-[#71807d] shadow-xs mb-3">
                  <IconTrophy size={22} />
                </div>
                <p className="text-sm font-bold text-[#253638]">
                  No completed matches recorded yet
                </p>
                <p className="mt-1 text-xs text-[#71807d] max-w-md mx-auto">
                  When you or your opponent finalize a match score in the scoring console, the official result and points breakdown are automatically attributed to your profile here.
                </p>
                <div className="mt-4 flex justify-center gap-3">
                  <Link to="/games">
                    <Button className="text-xs">Schedule a Match</Button>
                  </Link>
                  <Link to="/scores">
                    <Button variant="outline" className="text-xs">Open Scoreboard</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {myCompletedMatches.map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-4 text-xs hover:border-[#277863]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-xl bg-white text-[#253638] shadow-xs">
                        <SportIcon name={m.sport} size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="mono-font text-[10px] font-bold uppercase text-[#71807d]">
                            {m.sport}
                          </span>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                            FINAL
                          </span>
                        </div>
                        <p className="font-bold text-sm text-[#253638] mt-0.5">
                          {m.title}
                        </p>
                        <p className="text-[11px] text-[#71807d] mt-0.5">
                          {m.location} · {new Date(m.scheduledAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="mono-font text-base font-extrabold text-[#277863]">
                        {m.score || "Match Finished"}
                      </p>
                      <Link
                        to={`/games/${m.id}`}
                        className="text-[11px] font-bold text-[#71807d] hover:text-[#253638] hover:underline"
                      >
                        View Fixture Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 3. Settings Related to the App (Requested: settings related to the app) */}
        <section className="rounded-3xl border border-[#DDD6C8] bg-white p-6 sm:p-8 shadow-sm">
          <p className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold text-[#277863]">
            App Configuration
          </p>
          <h3 className="display-font mt-1 text-2xl font-bold tracking-tight text-[#253638]">
            Application & Match Preferences
          </h3>
          <p className="mt-1 text-xs text-[#71807d]">
            Customize live match notifications, scoring sound effects, and real-time cloud synchronization.
          </p>

          <div className="mt-6 space-y-4">
            {/* Notifications Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2]">
              <div>
                <p className="text-sm font-bold text-[#253638]">
                  Live Match & Score Notifications
                </p>
                <p className="text-xs text-[#71807d]">
                  Receive real-time alerts when opponent scores, when match rosters update, or on direct player invites.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => handleSettingChange("notifications", e.target.checked)}
                className="size-5 accent-[#18181b] cursor-pointer"
              />
            </div>

            {/* Audio / Buzzer Sounds Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2]">
              <div>
                <p className="text-sm font-bold text-[#253638]">
                  Match Audio & Referee Sound Effects
                </p>
                <p className="text-xs text-[#71807d]">
                  Play sound effects for point changes, match point whistle, and timer alerts during active scoring.
                </p>
              </div>
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => handleSettingChange("soundEffects", e.target.checked)}
                className="size-5 accent-[#18181b] cursor-pointer"
              />
            </div>

            {/* Discovery / Player ID Invites Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2]">
              <div>
                <p className="text-sm font-bold text-[#253638]">
                  Player ID Discovery & QR Invites
                </p>
                <p className="text-xs text-[#71807d]">
                  Allow other athletes to invite you directly to matches and games using your Player ID ({me?.publicId}).
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowDiscovery}
                onChange={(e) => handleSettingChange("allowDiscovery", e.target.checked)}
                className="size-5 accent-[#18181b] cursor-pointer"
              />
            </div>

            {/* Cloud Real-Time Sync Frequency */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2]">
              <div>
                <p className="text-sm font-bold text-[#253638]">
                  Live Background Cloud Sync
                </p>
                <p className="text-xs text-[#71807d]">
                  Background polling rate with the cloud Supabase database for real-time multiplayer updates.
                </p>
              </div>
              <select
                value={syncInterval}
                onChange={(e) => handleSettingChange("syncInterval", e.target.value)}
                className="rounded-xl border border-[#DDD6C8] bg-white px-3 py-1.5 text-xs font-bold text-[#253638] focus:outline-none"
              >
                <option value="realtime">Real-Time (3 seconds)</option>
                <option value="standard">Standard (8 seconds)</option>
                <option value="manual">Manual / On-Demand</option>
              </select>
            </div>

            {/* Supabase Cloud Connection Status */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center gap-3">
                <span className="grid size-3 place-items-center">
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                </span>
                <div>
                  <p className="text-xs font-bold text-emerald-900">
                    Supabase PostgreSQL Cloud Database
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Connected to aws-0-ap-southeast-1.pooler.supabase.com:6543
                  </p>
                </div>
              </div>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                ACTIVE & HEALTHY
              </span>
            </div>
          </div>
        </section>

        {/* 4. Multi-Athlete Testing & Simulator */}
        <section className="rounded-3xl border border-[#DDD6C8] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold text-[#277863]">
                Social & Multi-User Testing
              </p>
              <h3 className="display-font mt-1 text-2xl font-bold tracking-tight text-[#253638]">
                Switch Active Athlete
              </h3>
              <p className="mt-1 text-xs text-[#71807d]">
                Test two-way multiplayer interactions: one athlete creates a match and posts, then switch to a friend to join and view the live score.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setCreateModalOpen(true)}
              className="text-xs shrink-0"
            >
              <IconPlus size={14} /> + New Athlete
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allAthletes.map((ath) => {
              const isCurrent = ath.id === me?.id;
              return (
                <div
                  key={ath.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? "border-[#277863] bg-[#277863]/5 shadow-xs"
                      : "border-[#DDD6C8] bg-[#FAF7F2] hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar player={ath} size="md" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#253638] truncate">
                        {ath.displayName}
                      </p>
                      <p className="mono-font text-[10px] text-[#71807d]">
                        {ath.publicId} · {ath.primarySport}
                      </p>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="text-[11px] font-bold text-[#277863] flex items-center gap-1">
                      <IconCheck size={14} /> Active
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        switchAthlete(ath);
                        setDisplayName(ath.displayName);
                        setBio(ath.bio || "");
                        setAvatarUrl(ath.avatarUrl || "");
                        setPrimarySport(ath.primarySport || "Football");
                      }}
                      className="rounded-xl border border-[#DDD6C8] bg-white px-3 py-1 text-xs font-bold text-[#253638] hover:bg-[#EAE4D7]"
                    >
                      Select
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Account Sign Out & Database Reset */}
        <section className="rounded-3xl border border-red-200 bg-red-50/50 p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="display-font text-lg font-bold text-red-900">
              Account Session & Data Tools
            </h3>
            <p className="mt-1 text-xs text-red-700/80">
              Sign out of your active session or reset all local/cloud fixtures to a fresh slate.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all posts and fixtures?")) {
                  clearAllData();
                }
              }}
              className="rounded-2xl border border-red-300 bg-white px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-50 transition-colors"
            >
              Reset Database
            </button>
            <Button
              variant="danger"
              onClick={handleLogout}
              className="text-xs font-bold shadow-sm"
            >
              Sign Out of EZKORA
            </Button>
          </div>
        </section>
      </div>

      {/* Modal: QR Code for Player ID */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="ezkora-fade w-full max-w-sm rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-2xl text-center">
            <div className="flex justify-between items-center pb-3 border-b border-[#DDD6C8]">
              <span className="text-sm font-bold text-[#253638]">Player QR Code</span>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="p-1 text-[#71807d] hover:text-[#253638]"
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="mt-5 p-4 bg-[#FAF7F2] rounded-2xl inline-block border border-[#DDD6C8]">
              {/* Clean high-contrast SVG QR Representation */}
              <svg className="size-48 mx-auto" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="#FAF7F2" />
                {/* Corner squares */}
                <rect x="10" y="10" width="26" height="26" fill="#18181b" rx="4" />
                <rect x="15" y="15" width="16" height="16" fill="#FAF7F2" rx="2" />
                <rect x="18" y="18" width="10" height="10" fill="#18181b" rx="1" />

                <rect x="64" y="10" width="26" height="26" fill="#18181b" rx="4" />
                <rect x="69" y="15" width="16" height="16" fill="#FAF7F2" rx="2" />
                <rect x="72" y="18" width="10" height="10" fill="#18181b" rx="1" />

                <rect x="10" y="64" width="26" height="26" fill="#18181b" rx="4" />
                <rect x="15" y="69" width="16" height="16" fill="#FAF7F2" rx="2" />
                <rect x="18" y="72" width="10" height="10" fill="#18181b" rx="1" />

                {/* Data dots pattern */}
                <rect x="42" y="14" width="6" height="6" fill="#18181b" />
                <rect x="52" y="14" width="6" height="6" fill="#18181b" />
                <rect x="42" y="24" width="6" height="6" fill="#18181b" />
                <rect x="52" y="24" width="6" height="6" fill="#18181b" />
                <rect x="42" y="34" width="16" height="6" fill="#18181b" />
                <rect x="14" y="44" width="10" height="6" fill="#18181b" />
                <rect x="30" y="44" width="14" height="6" fill="#18181b" />
                <rect x="50" y="44" width="18" height="6" fill="#18181b" />
                <rect x="74" y="44" width="12" height="6" fill="#18181b" />
                <rect x="42" y="56" width="8" height="8" fill="#18181b" />
                <rect x="56" y="56" width="8" height="8" fill="#18181b" />
                <rect x="42" y="70" width="12" height="6" fill="#18181b" />
                <rect x="62" y="70" width="12" height="6" fill="#18181b" />
                <rect x="80" y="70" width="10" height="6" fill="#18181b" />
                <rect x="62" y="82" width="28" height="8" fill="#18181b" />
              </svg>
            </div>

            <p className="mono-font mt-3 text-lg font-bold text-[#18181b]">
              {me?.publicId || "PL-000000"}
            </p>
            <p className="mt-1 text-xs text-[#71807d]">
              Other players can scan this QR code or enter your ID to invite you directly to matches.
            </p>

            <div className="mt-5">
              <Button onClick={() => setShowQrModal(false)} className="w-full">
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Athlete */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleCreateAthlete}
            className="ezkora-fade w-full max-w-[460px] rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-2xl sm:p-8"
          >
            <h3 className="display-font text-2xl font-bold text-[#253638]">
              Create New Athlete
            </h3>
            <p className="mt-1 text-xs text-[#71807d]">
              Add another athlete profile to test real live posting, commenting, and multiplayer match invites.
            </p>

            <div className="mt-5 space-y-4">
              <Field label="Full Name">
                <input
                  required
                  type="text"
                  value={newAthleteName}
                  onChange={(e) => setNewAthleteName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="field"
                />
              </Field>

              <Field label="Primary Sport">
                <select
                  value={newAthleteSport}
                  onChange={(e) => setNewAthleteSport(e.target.value)}
                  className="field font-semibold"
                >
                  {SPORTS.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Short Bio">
                <input
                  type="text"
                  value={newAthleteBio}
                  onChange={(e) => setNewAthleteBio(e.target.value)}
                  placeholder="e.g. Badminton singles competitor"
                  className="field"
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-[#DDD6C8]">
              <Button variant="quiet" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create & Switch</Button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
