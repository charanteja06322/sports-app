import React, { useState } from "react";
import { useEzkoraStore, SPORTS } from "../store/ezkoraStore";
import { PageHeader, Field, Button, Avatar } from "../components/ezkora/CommonUI";
import { SportIcon, IconCheck, IconPlus } from "../components/ezkora/EzkoraIcons";

export default function EzkoraSettingsPage() {
  const me = useEzkoraStore((s) => s.me);
  const allAthletes = useEzkoraStore((s) => s.allAthletes);
  const switchAthlete = useEzkoraStore((s) => s.switchAthlete);
  const createAthlete = useEzkoraStore((s) => s.createAthlete);
  const clearAllData = useEzkoraStore((s) => s.clearAllData);

  const activeSport = useEzkoraStore((s) => s.activeSport);
  const setSport = useEzkoraStore((s) => s.setSport);
  const updateProfile = useEzkoraStore((s) => s.updateProfile);

  const [displayName, setDisplayName] = useState(me?.displayName || "");
  const [bio, setBio] = useState(me?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(me?.avatarUrl || "");
  const [saved, setSaved] = useState(false);

  // New athlete form modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newAthleteName, setNewAthleteName] = useState("");
  const [newAthleteSport, setNewAthleteSport] = useState("Football");
  const [newAthleteBio, setNewAthleteBio] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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

  return (
    <main className="mx-auto max-w-[880px] px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      <PageHeader
        eyebrow="Preferences"
        title="Profile & Lens Settings"
        body="Manage your verified EZKORA athlete identity, public Player ID, active sporting perspective, and multi-user testing."
      />

      <div className="mt-8 space-y-8">
        {/* Active Sport Lens Switcher */}
        <section className="rounded-3xl border border-[#DDD6C8] bg-white p-6 sm:p-8 shadow-sm">
          <p className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold text-[#277863]">
            Active Sport Lens
          </p>
          <h2 className="display-font mt-1 text-2xl font-bold tracking-tight text-[#253638]">
            Switch Your Sports Perspective
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[#71807d]">
            Selecting a sport reorganizes your community feed, game schedules, scoring engines, and context.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SPORTS.map((s) => {
              const isSelected = s.name === activeSport;
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setSport(s.name)}
                  className={`action-ring flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? "border-transparent text-white shadow-md scale-105"
                      : "border-[#DDD6C8] bg-[#FAF7F2] text-[#253638] hover:border-[#277863]/50"
                  }`}
                  style={isSelected ? { backgroundColor: s.accent } : undefined}
                >
                  <span className="grid w-10 h-10 place-items-center rounded-xl bg-white/20 mb-2">
                    <SportIcon name={s.name} size={20} />
                  </span>
                  <span className="font-bold text-xs">{s.name}</span>
                  <span
                    className={`text-[10px] mt-0.5 line-clamp-1 ${
                      isSelected ? "text-white/80" : "text-[#71807d]"
                    }`}
                  >
                    {s.phrase}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Multi-Athlete / Social Testing Switcher */}
        <section className="rounded-3xl border border-[#DDD6C8] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold text-[#277863]">
                Social Simulation
              </p>
              <h2 className="display-font mt-1 text-2xl font-bold tracking-tight text-[#253638]">
                Switch Active Athlete
              </h2>
              <p className="mt-1 text-xs text-[#71807d]">
                Test real multi-user social interaction (like Instagram/LinkedIn). One athlete posts or creates a game, switch athlete to see and interact with it.
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

        {/* Profile Details Form */}
        <section className="rounded-3xl border border-[#DDD6C8] bg-white p-6 sm:p-8 shadow-sm">
          <p className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold text-[#277863]">
            Athlete Credentials
          </p>
          <h2 className="display-font mt-1 text-2xl font-bold tracking-tight text-[#253638]">
            Edit Active Profile
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="flex items-center gap-4">
              <Avatar player={{ displayName, avatarUrl }} size="lg" />
              <div>
                <span className="mono-font rounded-md bg-[#FAF7F2] border border-[#DDD6C8] px-2.5 py-1 text-xs font-bold text-[#253638]">
                  ID: {me?.publicId}
                </span>
                <p className="mt-1 text-[11px] text-[#71807d]">
                  Permanent athlete identifier for roster invites and verification.
                </p>
              </div>
            </div>

            <Field label="Athlete Display Name">
              <input
                required
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="field"
              />
            </Field>

            <Field label="Athletic Bio & Playing Position">
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="field"
              />
            </Field>

            <Field label="Profile Photo (Upload from device or enter URL)">
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
                  className="block w-full text-xs text-[#71807d] file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#277863] file:text-white hover:file:brightness-110 cursor-pointer"
                />
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="Or enter direct image URL (https://...)"
                  className="field text-xs"
                />
              </div>
            </Field>

            <div className="flex items-center justify-between pt-4 border-t border-[#DDD6C8]">
              {saved ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#277863]">
                  <IconCheck size={16} /> Changes saved successfully
                </span>
              ) : (
                <span />
              )}
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </section>

        {/* Danger Zone: Wipe / Reset Data */}
        <section className="rounded-3xl border border-[#bd5549]/30 bg-[#bd5549]/5 p-6 sm:p-8">
          <h3 className="display-font text-lg font-bold text-[#bd5549]">
            Data Management
          </h3>
          <p className="mt-1 text-xs text-[#71807d]">
            Need a completely fresh start? Clear all uploaded posts, matches, and connections from the live database.
          </p>
          <div className="mt-4">
            <Button
              variant="danger"
              className="text-xs"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all posts and fixtures?")) {
                  clearAllData();
                }
              }}
            >
              Reset Live Database to Clean Slate
            </Button>
          </div>
        </section>
      </div>

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
              Add a second athlete profile to test real live posting, commenting, and liking across accounts.
            </p>

            <div className="mt-5 space-y-4">
              <Field label="Full Name">
                <input
                  required
                  type="text"
                  value={newAthleteName}
                  onChange={(e) => setNewAthleteName(e.target.value)}
                  placeholder="e.g. Taylor Swift"
                  className="field"
                />
              </Field>

              <Field label="Primary Sport">
                <select
                  value={newAthleteSport}
                  onChange={(e) => setNewAthleteSport(e.target.value)}
                  className="field"
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
                  placeholder="e.g. Marathon runner, striker, or enthusiast"
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
