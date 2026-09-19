import React, { useState } from "react";
import { useEzkoraStore, SPORTS } from "../store/ezkoraStore";
import { LogoMark, IconGoogle, SportIcon, IconCheck, IconArrowRight, IconUser, IconX } from "../components/aervo/AervoIcons";

export default function LoginPage() {
  const loginWithGoogle = useEzkoraStore((s) => s.loginWithGoogle);
  const loginWithEmailOrId = useEzkoraStore((s) => s.loginWithEmailOrId);
  const createAthlete = useEzkoraStore((s) => s.createAthlete);

  const [activeTab, setActiveTab] = useState("google"); // "google", "credentials", "register"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");

  // Credentials State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Register State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regSport, setRegSport] = useState("Football");
  const [regBio, setRegBio] = useState("");

  const handleGoogleSubmit = async (email, name, avatarUrl = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await loginWithGoogle({
        email: email || "athlete@ezkora.com",
        displayName: name || "Verified Athlete",
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "EZ")}&backgroundColor=18181b`,
        googleId: "g_" + Date.now(),
      });
      if (!res.success) {
        setError(res.error || "Google sign-in failed.");
      } else {
        setShowGoogleModal(false);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter your Player ID or email.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await loginWithEmailOrId({ identifier: identifier.trim(), password });
    if (!res.success) {
      setError(res.error || "Could not find athlete.");
    }
    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim()) {
      setError("Please enter your name.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createAthlete({
        displayName: regName.trim(),
        primarySport: regSport,
        bio: regBio.trim() || `Passionate ${regSport.toLowerCase()} athlete on EZKORA.`,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(regName.trim())}&backgroundColor=18181b`,
      });
    } catch (err) {
      setError(err.message || "Failed to create athlete.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    setError("");
    await loginWithGoogle({
      email: "demo.athlete@ezkora.com",
      displayName: "Demo Athlete",
      avatarUrl: "https://api.dicebear.com/7.x/initials/svg?seed=DA&backgroundColor=18181b",
      googleId: "demo_123",
    });
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#253638] flex flex-col justify-between selection:bg-[#18181b] selection:text-white">
      {/* Background Subtle Sport Noise & Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-[#18181b]/5 blur-3xl" />
        <div className="absolute top-1/2 -right-40 size-[450px] rounded-full bg-[#277863]/5 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-6 py-6 flex items-center justify-between border-b border-[#DDD6C8]/60">
        <LogoMark />
        <div className="flex items-center gap-3">
          <span className="mono-font text-[11px] font-semibold uppercase tracking-[0.16em] text-[#71807d] hidden sm:inline-block">
            AUTHENTIC SPORTS PLATFORM
          </span>
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="rounded-xl border border-[#DDD6C8] bg-white px-3.5 py-1.5 text-[12px] font-bold text-[#253638] shadow-xs hover:bg-[#F3EFE6] transition-colors"
          >
            Demo Athlete ⚡
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 mx-auto w-full max-w-md px-5 py-10 sm:py-14">
        {/* Card Container */}
        <div className="rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-xl sm:p-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#18181b] text-white shadow-md mb-4">
              <LogoMark light />
            </div>
            <h1 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b]">
              Welcome to EZKORA
            </h1>
            <p className="mt-2 text-[13px] text-[#71807d] leading-relaxed">
              Sign in to manage your verified athlete identity, join live games, and track authentic scores.
            </p>
          </div>

          {/* Sport Badges Strip */}
          <div className="mt-5 flex items-center justify-center gap-1.5 overflow-x-auto pb-1">
            {SPORTS.slice(0, 5).map((sp) => (
              <span
                key={sp.name}
                className="inline-flex items-center gap-1 rounded-full border border-[#DDD6C8] bg-[#FAF7F2] px-2.5 py-1 text-[11px] font-semibold text-[#253638]"
              >
                <SportIcon name={sp.name} size={11} />
                <span>{sp.name}</span>
              </span>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] text-red-700 flex items-center justify-between">
              <span>{error}</span>
              <button type="button" onClick={() => setError("")} className="text-red-500 hover:text-red-800">
                <IconX size={14} />
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="mt-6 flex rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-1 text-[12px] font-bold">
            <button
              type="button"
              onClick={() => { setActiveTab("google"); setError(""); }}
              className={`flex-1 rounded-xl py-2 transition-colors ${
                activeTab === "google" ? "bg-white text-[#18181b] shadow-xs" : "text-[#71807d] hover:text-[#253638]"
              }`}
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("credentials"); setError(""); }}
              className={`flex-1 rounded-xl py-2 transition-colors ${
                activeTab === "credentials" ? "bg-white text-[#18181b] shadow-xs" : "text-[#71807d] hover:text-[#253638]"
              }`}
            >
              Player ID
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("register"); setError(""); }}
              className={`flex-1 rounded-xl py-2 transition-colors ${
                activeTab === "register" ? "bg-white text-[#18181b] shadow-xs" : "text-[#71807d] hover:text-[#253638]"
              }`}
            >
              Register
            </button>
          </div>

          {/* Tab 1: Google Sign-In */}
          {activeTab === "google" && (
            <div className="mt-6 space-y-4">
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border border-[#DDD6C8] bg-white px-5 py-3.5 text-[14px] font-bold text-[#253638] shadow-sm hover:bg-[#FAF7F2] hover:border-[#18181b]/30 transition-all active:scale-[0.99]"
              >
                <IconGoogle size={20} />
                <span>Continue with Google</span>
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="w-full border-t border-[#DDD6C8]" />
                <span className="absolute bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-[#71807d]">
                  Instant Setup
                </span>
              </div>

              {/* Verified Features */}
              <div className="rounded-2xl border border-[#DDD6C8]/70 bg-[#FAF7F2]/70 p-4 space-y-2 text-[12px] text-[#556461]">
                <div className="flex items-center gap-2">
                  <span className="grid size-4 place-items-center rounded-full bg-[#277863] text-white text-[9px]"><IconCheck size={10} /></span>
                  <span>Instant verified <strong>EZKORA Player ID</strong> generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="grid size-4 place-items-center rounded-full bg-[#277863] text-white text-[9px]"><IconCheck size={10} /></span>
                  <span>Multi-sport lenses with real-time scoring console</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="grid size-4 place-items-center rounded-full bg-[#277863] text-white text-[9px]"><IconCheck size={10} /></span>
                  <span>Syncs directly to Supabase cloud database</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Player ID / Email */}
          {activeTab === "credentials" && (
            <form onSubmit={handleCredentialsSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mono-font block text-[10px] font-semibold uppercase tracking-wider text-[#71807d] mb-1.5">
                  Player ID or Email
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. PL-512391 or athlete@email.com"
                  className="w-full rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-3 text-[13px] font-medium text-[#253638] placeholder:text-[#9BA6A3] focus:border-[#18181b] focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="mono-font block text-[10px] font-semibold uppercase tracking-wider text-[#71807d] mb-1.5">
                  Password (Optional for verified IDs)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-3 text-[13px] font-medium text-[#253638] placeholder:text-[#9BA6A3] focus:border-[#18181b] focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#18181b] py-3.5 text-[14px] font-bold text-white shadow-md hover:bg-black transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>{loading ? "Signing in..." : "Sign In to Platform"}</span>
                <IconArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Tab 3: Register */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mono-font block text-[10px] font-semibold uppercase tracking-wider text-[#71807d] mb-1.5">
                  Athlete Full Name
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Charan Teja"
                  className="w-full rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-3 text-[13px] font-medium text-[#253638] placeholder:text-[#9BA6A3] focus:border-[#18181b] focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="mono-font block text-[10px] font-semibold uppercase tracking-wider text-[#71807d] mb-1.5">
                  Primary Sport Lens
                </label>
                <select
                  value={regSport}
                  onChange={(e) => setRegSport(e.target.value)}
                  className="w-full rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-3 text-[13px] font-medium text-[#253638] focus:border-[#18181b] focus:bg-white focus:outline-none transition-colors"
                >
                  {SPORTS.map((sp) => (
                    <option key={sp.name} value={sp.name}>
                      {sp.name} — {sp.descriptor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mono-font block text-[10px] font-semibold uppercase tracking-wider text-[#71807d] mb-1.5">
                  Athlete Bio
                </label>
                <input
                  type="text"
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  placeholder="e.g. Midfielder & tournament coordinator"
                  className="w-full rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-3 text-[13px] font-medium text-[#253638] placeholder:text-[#9BA6A3] focus:border-[#18181b] focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#18181b] py-3.5 text-[14px] font-bold text-white shadow-md hover:bg-black transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>{loading ? "Creating Profile..." : "Create Verified Profile"}</span>
                <IconArrowRight size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-[12px] text-[#71807d]">
          By continuing, you join the authentic, zero-mock sports community on EZKORA.
        </p>
      </main>

      {/* Google Account Picker Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-2xl sm:p-7">
            {/* Google Brand Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#DDD6C8]">
              <div className="flex items-center gap-2.5">
                <IconGoogle size={24} />
                <span className="text-[16px] font-bold text-[#253638]">Sign in with Google</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="rounded-lg p-1 text-[#71807d] hover:bg-black/5"
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-[13px] text-[#71807d]">
                Choose an account to continue to <strong>EZKORA</strong>
              </p>

              {/* Pre-populated Google Account option */}
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => handleGoogleSubmit("charanteja06322@gmail.com", "Charan Teja")}
                  disabled={loading}
                  className="w-full flex items-center gap-3 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-3 text-left hover:border-[#18181b] hover:bg-white transition-all"
                >
                  <div className="grid size-10 place-items-center rounded-full bg-[#18181b] text-white font-bold text-[14px]">
                    C
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-[#18181b]">Charan Teja</p>
                    <p className="truncate text-[11px] text-[#71807d]">charanteja06322@gmail.com</p>
                  </div>
                </button>

                {/* Custom Google Account Section */}
                <div className="mt-3 pt-3 border-t border-[#DDD6C8]/60">
                  <p className="mono-font text-[10px] font-semibold uppercase tracking-wider text-[#71807d] mb-2">
                    Or enter another Google account
                  </p>
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full mb-2 rounded-xl border border-[#DDD6C8] bg-[#FAF7F2] px-3 py-2 text-[12px] font-medium text-[#253638] placeholder:text-[#9BA6A3] focus:border-[#18181b] focus:bg-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full mb-3 rounded-xl border border-[#DDD6C8] bg-[#FAF7F2] px-3 py-2 text-[12px] font-medium text-[#253638] placeholder:text-[#9BA6A3] focus:border-[#18181b] focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleGoogleSubmit(customGoogleEmail, customGoogleName)}
                    disabled={loading || !customGoogleEmail.trim()}
                    className="w-full rounded-xl bg-[#18181b] py-2.5 text-[12px] font-bold text-white shadow-sm hover:bg-black transition-all disabled:opacity-50"
                  >
                    {loading ? "Authenticating..." : "Continue with this Account"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer */}
      <footer className="relative z-10 mx-auto w-full max-w-7xl px-6 py-6 text-center text-[12px] text-[#71807d] border-t border-[#DDD6C8]/60">
        &copy; {new Date().getFullYear()} EZKORA Sports Platform. Designed for athletes and live scoring.
      </footer>
    </div>
  );
}
