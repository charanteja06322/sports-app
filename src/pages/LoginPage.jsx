import React, { useState } from "react";
import { useEzkoraStore } from "../store/ezkoraStore";
import { LogoMark, IconGoogle, IconArrowRight, IconX, IconCheck } from "../components/aervo/AervoIcons";

export default function LoginPage() {
  const loginWithGoogle = useEzkoraStore((s) => s.loginWithGoogle);
  const loginWithEmailOrId = useEzkoraStore((s) => s.loginWithEmailOrId);
  const createAthlete = useEzkoraStore((s) => s.createAthlete);

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sign In State
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Sign Up State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter your username, email, or Player ID.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await loginWithEmailOrId({ identifier: identifier.trim(), password });
    if (!res.success) {
      setError(res.error || "Invalid credentials or Player ID.");
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
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
        email: regEmail.trim() || undefined,
        password: regPassword || undefined,
        primarySport: "Football",
        bio: "Verified athlete on EZKORA.",
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(regName.trim())}&backgroundColor=18181b`,
      });
    } catch (err) {
      setError(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (email, name) => {
    setLoading(true);
    setError("");
    try {
      const res = await loginWithGoogle({
        email: email || "athlete@ezkora.com",
        displayName: name || "Verified Athlete",
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "EZ")}&backgroundColor=18181b`,
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

  return (
    <div className="relative min-h-screen bg-[#FAF7F2] text-[#253638] flex flex-col justify-between selection:bg-[#18181b] selection:text-white">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 size-[450px] rounded-full bg-[#18181b]/5 blur-3xl" />
        <div className="absolute top-1/2 -right-40 size-[400px] rounded-full bg-[#18181b]/5 blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 mx-auto w-full max-w-5xl px-6 py-6 flex items-center justify-between border-b border-[#DDD6C8]/60">
        <LogoMark />
      </header>

      {/* Main Form Center */}
      <main className="relative z-10 mx-auto w-full max-w-md px-5 py-10">
        <div className="rounded-3xl border border-[#DDD6C8] bg-white p-7 sm:p-9 shadow-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="display-font text-2xl sm:text-3xl font-bold tracking-tight text-[#18181b]">
              {mode === "signin" ? "Sign In to EZKORA" : "Create your Account"}
            </h1>
            <p className="mt-1.5 text-[13px] text-[#71807d]">
              {mode === "signin"
                ? "Enter your credentials or Player ID to access the platform."
                : "Register your athlete identity on EZKORA."}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-1 text-[13px] font-bold mb-6">
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(""); }}
              className={`flex-1 rounded-xl py-2 transition-all ${
                mode === "signin" ? "bg-white text-[#18181b] shadow-xs" : "text-[#71807d] hover:text-[#253638]"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); }}
              className={`flex-1 rounded-xl py-2 transition-all ${
                mode === "signup" ? "bg-white text-[#18181b] shadow-xs" : "text-[#71807d] hover:text-[#253638]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] text-red-700 flex items-center justify-between">
              <span>{error}</span>
              <button type="button" onClick={() => setError("")} className="text-red-500 hover:text-red-800">
                <IconX size={14} />
              </button>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="mono-font block text-[10px] font-semibold uppercase tracking-wider text-[#71807d] mb-1.5">
                  Username, Email, or Player ID
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Username, email, or PL-XXXXXX"
                  className="w-full rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-3 text-[13px] font-medium text-[#253638] placeholder:text-[#9BA6A3] focus:border-[#18181b] focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="mono-font block text-[10px] font-semibold uppercase tracking-wider text-[#71807d] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-3 text-[13px] font-medium text-[#253638] placeholder:text-[#9BA6A3] focus:border-[#18181b] focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#18181b] py-3.5 text-[14px] font-bold text-white shadow-md hover:bg-black transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>{loading ? "Signing in..." : "Sign In"}</span>
                <IconArrowRight size={16} />
              </button>

              <div className="pt-1 text-center">
                <p className="text-[11px] text-[#71807d]">
                  Registered player? Enter your <strong>Player ID</strong> (e.g. <code>PL-512391</code>) in the field above to login directly.
                </p>
              </div>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === "signup" && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="mono-font block text-[10px] font-semibold uppercase tracking-wider text-[#71807d] mb-1.5">
                  Full Name / Username
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
                  Email
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-3 text-[13px] font-medium text-[#253638] placeholder:text-[#9BA6A3] focus:border-[#18181b] focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="mono-font block text-[10px] font-semibold uppercase tracking-wider text-[#71807d] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-3 text-[13px] font-medium text-[#253638] placeholder:text-[#9BA6A3] focus:border-[#18181b] focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#18181b] py-3.5 text-[14px] font-bold text-white shadow-md hover:bg-black transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>{loading ? "Creating Account..." : "Sign Up"}</span>
                <IconArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-[#DDD6C8]" />
            <span className="absolute bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#71807d]">
              or
            </span>
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl border border-[#DDD6C8] bg-white px-5 py-3.5 text-[14px] font-bold text-[#253638] shadow-xs hover:bg-[#FAF7F2] hover:border-[#18181b]/30 transition-all active:scale-[0.99]"
          >
            <IconGoogle size={18} />
            <span>Continue with Google</span>
          </button>
        </div>
      </main>

      {/* Google Account Picker Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-2xl sm:p-7">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#DDD6C8]">
              <div className="flex items-center gap-2.5">
                <IconGoogle size={22} />
                <span className="text-[15px] font-bold text-[#253638]">Sign in with Google</span>
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

              {/* Account selection list */}
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => handleGoogleAuth("charanteja06322@gmail.com", "Charan Teja")}
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

                {/* Custom Google account */}
                <div className="mt-3 pt-3 border-t border-[#DDD6C8]/60">
                  <p className="mono-font text-[10px] font-semibold uppercase tracking-wider text-[#71807d] mb-2">
                    Use another Google account
                  </p>
                  <input
                    type="email"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    placeholder="account@gmail.com"
                    className="w-full mb-2 rounded-xl border border-[#DDD6C8] bg-[#FAF7F2] px-3 py-2 text-[12px] font-medium text-[#253638] placeholder:text-[#9BA6A3] focus:border-[#18181b] focus:bg-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full mb-3 rounded-xl border border-[#DDD6C8] bg-[#FAF7F2] px-3 py-2 text-[12px] font-medium text-[#253638] placeholder:text-[#9BA6A3] focus:border-[#18181b] focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleGoogleAuth(customGoogleEmail, customGoogleName)}
                    disabled={loading || !customGoogleEmail.trim()}
                    className="w-full rounded-xl bg-[#18181b] py-2.5 text-[12px] font-bold text-white shadow-sm hover:bg-black transition-all disabled:opacity-50"
                  >
                    {loading ? "Authenticating..." : "Continue"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 mx-auto w-full max-w-5xl px-6 py-6 text-center text-[12px] text-[#71807d] border-t border-[#DDD6C8]/60">
        &copy; {new Date().getFullYear()} EZKORA. Authentic sports platform.
      </footer>
    </div>
  );
}
