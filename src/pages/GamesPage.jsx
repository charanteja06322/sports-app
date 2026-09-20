import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEzkoraStore, SPORTS } from "../store/ezkoraStore";
import { PageHeader, Button, EmptyState, Field, Avatar } from "../components/ezkora/CommonUI";
import {
  IconPlus,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconArrowUpRight,
  IconX,
  IconTrophy,
  IconUsers,
  SportIcon,
} from "../components/ezkora/EzkoraIcons";

export default function GamesPage() {
  const activeSportName = useEzkoraStore((s) => s.activeSport);
  const sport = SPORTS.find((s) => s.name === activeSportName) || SPORTS[0];
  const games = useEzkoraStore((s) => s.games);
  const allAthletes = useEzkoraStore((s) => s.allAthletes);
  const addGame = useEzkoraStore((s) => s.addGame);

  const [createOpen, setCreateOpen] = useState(false);
  const [formSport, setFormSport] = useState(activeSportName);
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [invitePlayerId, setInvitePlayerId] = useState("");
  const [selectedInviteAthletes, setSelectedInviteAthletes] = useState([]);

  // Keep form sport synced when active sport changes
  React.useEffect(() => {
    setFormSport(activeSportName);
  }, [activeSportName]);

  const sportGames = games.filter((g) => g.sport === activeSportName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    // Find any player entered by ID
    let invited = [...selectedInviteAthletes];
    if (invitePlayerId.trim()) {
      const cleanId = invitePlayerId.trim().toUpperCase();
      const found = allAthletes.find(
        (a) => a.publicId?.toUpperCase() === cleanId || a.displayName?.toLowerCase() === cleanId.toLowerCase()
      );
      if (found && !invited.some((i) => i.id === found.id)) {
        invited.push(found);
      }
    }

    addGame({
      sport: formSport,
      title: formTitle.trim(),
      scheduledAt: formDate ? new Date(formDate).toISOString() : new Date().toISOString(),
      location: formLocation.trim() || "Local Sports Arena",
      invitedPlayers: invited,
    });

    setFormTitle("");
    setFormDate("");
    setFormLocation("");
    setInvitePlayerId("");
    setSelectedInviteAthletes([]);
    setCreateOpen(false);
  };

  const toggleInviteAthlete = (athlete) => {
    if (selectedInviteAthletes.some((a) => a.id === athlete.id)) {
      setSelectedInviteAthletes(selectedInviteAthletes.filter((a) => a.id !== athlete.id));
    } else {
      setSelectedInviteAthletes([...selectedInviteAthletes, athlete]);
    }
  };

  return (
    <main className="mx-auto max-w-[1120px] px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      <PageHeader
        eyebrow={`${sport.name} / Match Fixtures & Roster`}
        title="Create & Organize Matches."
        body={`Create a match, invite players via Player ID or direct invite, and record official scores that sync directly to everyone's profile.`}
        action={
          <Button
            onClick={() => setCreateOpen(true)}
            style={{ backgroundColor: sport.accent }}
            className="text-white shadow-md hover:brightness-105"
          >
            <IconPlus size={16} />
            <span>Create a match</span>
          </Button>
        }
      />

      <div className="mt-10">
        {sportGames.length === 0 ? (
          <EmptyState
            icon={<IconCalendar size={24} />}
            title={`No ${sport.name.toLowerCase()} matches scheduled yet.`}
            body="Start a new match, invite teammates or opponents via their Player ID, and score live."
            action={
              <Button onClick={() => setCreateOpen(true)}>
                <IconPlus size={15} />
                <span>Create the first match</span>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sportGames.map((game) => (
              <Link
                key={game.id}
                to={`/games/${game.id}`}
                className="group rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#277863]/60 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                        game.status === "finished"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "text-white"
                      }`}
                      style={game.status !== "finished" ? { backgroundColor: sport.deep } : undefined}
                    >
                      {game.status === "finished" ? "COMPLETED" : "OPEN"}
                    </span>
                    {game.score && (
                      <span className="mono-font rounded-full bg-[#18181b] px-3 py-0.5 text-[11px] font-bold text-white shadow-xs">
                        {game.score}
                      </span>
                    )}
                  </div>
                  <IconArrowUpRight
                    size={18}
                    className="text-[#71807d] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

                <h3 className="display-font mt-4 text-xl font-bold leading-snug text-[#253638]">
                  {game.title}
                </h3>

                <div className="mt-4 space-y-2 text-xs text-[#71807d]">
                  <p className="flex items-center gap-2">
                    <IconClock size={14} />
                    <span>
                      {new Date(game.scheduledAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                  {game.location && (
                    <p className="flex items-center gap-2">
                      <IconMapPin size={14} />
                      <span className="truncate">{game.location}</span>
                    </p>
                  )}
                </div>

                {/* Match Roster / Participants */}
                <div className="mt-6 flex items-center justify-between border-t border-[#DDD6C8] pt-4 text-xs font-semibold text-[#71807d]">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#71807d]">Host:</span>
                    <span className="font-bold text-[#253638]">
                      {game.host?.displayName || "Captain"}
                    </span>
                  </div>
                  <span className="text-[#277863] font-bold flex items-center gap-1">
                    <IconUsers size={14} />
                    {game.players?.length || 1} on roster →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Match Modal with Player Invites */}
      {createOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="ezkora-fade max-h-[92vh] overflow-y-auto w-full max-w-[520px] rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex justify-between items-start">
              <div>
                <p
                  className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold"
                  style={{ color: sport.deep }}
                >
                  Create Match Fixture
                </p>
                <h2 className="display-font mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#253638]">
                  Set match details & invite.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="grid size-8 place-items-center rounded-full text-[#71807d] hover:bg-[#EAE4D7]"
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {/* Sport Selector */}
              <Field label="Sport Discipline">
                <select
                  value={formSport}
                  onChange={(e) => setFormSport(e.target.value)}
                  className="field font-semibold"
                >
                  {SPORTS.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Match / Fixture Title">
                <input
                  required
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={`e.g. ${formSport} Singles Championship, Evening 5v5`}
                  className="field"
                />
              </Field>

              <Field label="When (Date & Time)">
                <input
                  required
                  type="datetime-local"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="field"
                />
              </Field>

              <Field label="Venue / Court Location">
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Central Badminton Court 2, Turf Ground"
                  className="field"
                />
              </Field>

              {/* Invite Players by Player ID */}
              <div className="rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-4">
                <p className="mono-font text-[10px] font-bold uppercase tracking-wider text-[#277863] mb-1">
                  Invite Players (Via Player ID or Roster)
                </p>
                <p className="text-[11px] text-[#71807d] mb-3">
                  Enter an athlete's Player ID (e.g. <code>PL-512391</code>) or select from active players to invite them to this match.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={invitePlayerId}
                    onChange={(e) => setInvitePlayerId(e.target.value)}
                    placeholder="Enter Player ID (PL-XXXXXX)"
                    className="flex-1 rounded-xl border border-[#DDD6C8] bg-white px-3 py-2 text-xs font-mono font-bold text-[#18181b] placeholder:font-sans placeholder:font-normal placeholder:text-[#9BA6A3] focus:outline-none focus:border-[#18181b]"
                  />
                </div>

                {/* Available athletes to quick-add */}
                {allAthletes.length > 1 && (
                  <div className="mt-3 pt-3 border-t border-[#DDD6C8]/60">
                    <p className="text-[10px] font-bold text-[#71807d] mb-1.5 uppercase">
                      Quick Add Registered Athletes:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {allAthletes.map((ath) => {
                        const isSelected = selectedInviteAthletes.some((a) => a.id === ath.id);
                        return (
                          <button
                            key={ath.id}
                            type="button"
                            onClick={() => toggleInviteAthlete(ath)}
                            className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs transition-all ${
                              isSelected
                                ? "bg-[#18181b] text-white font-bold"
                                : "bg-white border border-[#DDD6C8] text-[#253638] hover:border-[#18181b]"
                            }`}
                          >
                            <Avatar player={ath} size="xs" />
                            <span>{ath.displayName}</span>
                            <span className="mono-font text-[9px] opacity-75">({ath.publicId})</span>
                            {isSelected && <span>✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-[#DDD6C8]">
              <Button variant="quiet" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: sport.accent }}
                className="text-white shadow-md"
              >
                Create Match & Send Invites
              </Button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
