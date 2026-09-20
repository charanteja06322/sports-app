import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useEzkoraStore, SPORTS } from "../store/ezkoraStore";
import { Button, Avatar, EmptyState, Field } from "../components/ezkora/CommonUI";
import {
  IconArrowLeft,
  IconCheck,
  IconClock,
  IconMapPin,
  IconUsers,
  IconX,
  IconTrophy,
  SportIcon,
} from "../components/ezkora/EzkoraIcons";

export default function GameDetailPage() {
  const { gameId } = useParams();

  const games = useEzkoraStore((s) => s.games);
  const me = useEzkoraStore((s) => s.me);
  const allAthletes = useEzkoraStore((s) => s.allAthletes);
  const joinGame = useEzkoraStore((s) => s.joinGame);
  const updateRoster = useEzkoraStore((s) => s.updateRosterStatus);
  const invitePlayerToGame = useEzkoraStore((s) => s.invitePlayerToGame);
  const recordMatchScore = useEzkoraStore((s) => s.recordMatchScore);

  // String-safe lookup that supports both numbers and Supabase UUIDs
  const game = games.find((g) => String(g.id) === String(gameId));

  // Invite states
  const [inviteInputId, setInviteInputId] = useState("");
  const [inviteFeedback, setInviteFeedback] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Scoring states
  const [scoringOpen, setScoringOpen] = useState(false);
  const [scoreText, setScoreText] = useState("");
  const [winnerName, setWinnerName] = useState("");
  const [scoreSaving, setScoreSaving] = useState(false);

  if (!game) {
    return (
      <main className="mx-auto max-w-[800px] px-5 py-16 text-center">
        <EmptyState
          icon={<IconUsers size={24} />}
          title="Game fixture not found"
          body="This fixture might have concluded or the ID might have changed. Explore active games from the calendar."
          action={
            <Link to="/games">
              <Button>Back to all games</Button>
            </Link>
          }
        />
      </main>
    );
  }

  const sportConfig = SPORTS.find((s) => s.name === game.sport) || SPORTS[0];
  const isHost = game.host?.id === me?.id || game.host?.publicId === me?.publicId;
  const myEntry = game.players?.find(
    (entry) => entry.player?.id === me?.id || entry.player?.publicId === me?.publicId
  );
  const isFinished = game.status === "finished";

  const handleInviteById = async (e) => {
    e.preventDefault();
    if (!inviteInputId.trim()) return;
    const res = await invitePlayerToGame(game.id, inviteInputId.trim());
    if (res.success) {
      setInviteFeedback(`✓ Invited ${res.player.displayName} (${res.player.publicId})!`);
      setInviteInputId("");
    } else {
      setInviteFeedback(`❌ ${res.error || "Player not found"}`);
    }
    setTimeout(() => setInviteFeedback(""), 3500);
  };

  const handleQuickInvite = async (athlete) => {
    const res = await invitePlayerToGame(game.id, athlete);
    if (res.success) {
      setInviteFeedback(`✓ Added ${athlete.displayName} to roster!`);
    } else {
      setInviteFeedback(`❌ ${res.error || "Failed to add"}`);
    }
    setTimeout(() => setInviteFeedback(""), 3000);
  };

  const handleCopyMatchLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSaveScore = async (e) => {
    e.preventDefault();
    if (!scoreText.trim()) return;
    setScoreSaving(true);
    await recordMatchScore({
      gameId: game.id,
      score: scoreText.trim(),
      winnerId: winnerName.trim() || undefined,
    });
    setScoreSaving(false);
    setScoringOpen(false);
  };

  return (
    <main className="mx-auto max-w-[950px] px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      <Link
        to="/matches"
        className="inline-flex items-center gap-2 text-[13px] font-bold text-[#71807d] hover:text-[#253638]"
      >
        <IconArrowLeft size={16} /> All {game.sport} matches
      </Link>

      {/* Main Fixture Card */}
      <div className="ezkora-enter mt-6 rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                  isFinished
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : ""
                }`}
                style={!isFinished ? { color: sportConfig.deep, backgroundColor: sportConfig.wash } : undefined}
              >
                {isFinished ? "MATCH CONCLUDED" : game.status.toUpperCase()}
              </span>
              <span className="mono-font text-xs text-[#71807d] uppercase">
                {game.sport}
              </span>
            </div>

            <h1 className="display-font mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#253638]">
              {game.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isHost && !myEntry && !isFinished && (
              <Button
                onClick={() => joinGame(game.id)}
                style={{ backgroundColor: sportConfig.accent }}
                className="text-white shadow-md hover:brightness-105"
              >
                Join game roster
              </Button>
            )}

            {!isHost && myEntry && (
              <span className="inline-flex items-center gap-2 rounded-2xl bg-[#EAE4D7] px-4 py-2.5 text-xs font-bold text-[#277863]">
                <IconCheck size={16} /> {myEntry.status.toUpperCase()}
              </span>
            )}

            {!isFinished && isHost && (
              <Button
                onClick={() => setScoringOpen(true)}
                variant="outline"
                className="text-xs font-bold"
              >
                <IconTrophy size={14} /> Record / Finalize Score
              </Button>
            )}

            {!isFinished && !isHost && (
              <span className="inline-flex items-center gap-1.5 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-3.5 py-2 text-xs font-bold text-[#71807d]">
                👁️ Spectator View (Host: {game.host?.displayName || "Organizer"})
              </span>
            )}
          </div>
        </div>

        {/* Finished Score Highlight Banner */}
        {isFinished && game.score && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                <IconTrophy size={22} />
              </div>
              <div>
                <p className="mono-font text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Official Match Result
                </p>
                <p className="display-font text-2xl sm:text-3xl font-extrabold text-[#18181b]">
                  {game.score}
                </p>
                {game.winnerId && (
                  <p className="text-xs font-bold text-emerald-900 mt-0.5">
                    Winner: {game.winnerId}
                  </p>
                )}
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-white border border-emerald-200 px-3 py-1 rounded-xl">
              ✓ Added to all players' profiles
            </span>
          </div>
        )}

        {/* Fixture Info Bar */}
        <div className="mt-8 grid gap-4 border-t border-[#DDD6C8] pt-6 sm:grid-cols-3 text-xs">
          <div>
            <p className="mono-font uppercase tracking-wider text-[#71807d] text-[10px]">
              WHEN
            </p>
            <p className="mt-1 font-bold text-[13px] text-[#253638]">
              {new Date(game.scheduledAt).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div>
            <p className="mono-font uppercase tracking-wider text-[#71807d] text-[10px]">
              WHERE
            </p>
            <p className="mt-1 font-bold text-[13px] text-[#253638]">
              {game.location || "Venue to be announced"}
            </p>
          </div>

          <div>
            <p className="mono-font uppercase tracking-wider text-[#71807d] text-[10px]">
              ORGANIZER
            </p>
            <div className="mt-1 flex items-center gap-2 font-bold text-[13px] text-[#253638]">
              <Avatar player={game.host} size="sm" />
              <span>{game.host?.displayName || game.host?.publicId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invites & Share Section (Requested: add players via invites, player id, scan qr) */}
      {!isFinished && (
        <section className="mt-6 rounded-3xl border border-[#DDD6C8] bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DDD6C8] pb-4">
            <div>
              <p className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold text-[#277863]">
                Player Invites
              </p>
              <h2 className="display-font mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#253638]">
                Invite Players to this Match
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyMatchLink}
                className="flex items-center gap-1.5 rounded-xl border border-[#DDD6C8] bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#253638] hover:bg-white"
              >
                <span>{copiedLink ? "✓ Link Copied!" : "🔗 Copy Match Link"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="flex items-center gap-1.5 rounded-xl border border-[#DDD6C8] bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#253638] hover:bg-white"
              >
                <span>📱 Match QR Code</span>
              </button>
            </div>
          </div>

          {/* Invite Form */}
          <form onSubmit={handleInviteById} className="mt-5 flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={inviteInputId}
              onChange={(e) => setInviteInputId(e.target.value)}
              placeholder="Enter Player ID (e.g. PL-512391) or Name..."
              className="flex-1 min-w-[200px] rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-2.5 text-xs font-medium text-[#253638] placeholder:text-[#9BA6A3] focus:bg-white focus:outline-none"
            />
            <Button type="submit" className="text-xs">
              Invite Player
            </Button>
          </form>

          {inviteFeedback && (
            <p className="mt-2 text-xs font-bold text-[#277863]">
              {inviteFeedback}
            </p>
          )}

          {/* Quick-add available athletes not already in roster */}
          {allAthletes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#DDD6C8]/60">
              <p className="text-[11px] font-bold text-[#71807d] mb-2 uppercase">
                Quick Add Athletes:
              </p>
              <div className="flex flex-wrap gap-2">
                {allAthletes
                  .filter(
                    (a) =>
                      !game.players?.some(
                        (p) => p.player?.id === a.id || p.player?.publicId === a.publicId
                      )
                  )
                  .map((ath) => (
                    <button
                      key={ath.id}
                      type="button"
                      onClick={() => handleQuickInvite(ath)}
                      className="flex items-center gap-1.5 rounded-xl border border-[#DDD6C8] bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#253638] hover:bg-white hover:border-[#277863]"
                    >
                      <Avatar player={ath} size="xs" />
                      <span>+ {ath.displayName}</span>
                      <span className="mono-font text-[9px] text-[#71807d]">({ath.publicId})</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Roster Section */}
      <section className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold text-[#277863]">
              Confirmed Lineup
            </p>
            <h2 className="display-font mt-1 text-2xl font-bold tracking-tight text-[#253638]">
              Match Roster ({game.players?.length || 0} players)
            </h2>
          </div>
          {isHost && (
            <span className="rounded-full bg-[#FAF7F2] border border-[#DDD6C8] px-3 py-1 text-[11px] font-bold text-[#71807d]">
              Organizer Controls
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          {game.players?.map((entry) => (
            <div
              key={entry.player?.id || entry.player?.publicId || Math.random()}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DDD6C8] bg-white p-4 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Avatar player={entry.player} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[#253638]">
                      {entry.player?.displayName}
                    </p>
                    {entry.player?.id === game.host?.id && (
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800">
                        Host
                      </span>
                    )}
                  </div>
                  <p className="mono-font text-[10px] text-[#71807d]">
                    {entry.player?.publicId} · {entry.player?.primarySport || game.sport}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                    entry.status === "confirmed"
                      ? "bg-[#277863]/10 text-[#277863]"
                      : "bg-[#d47336]/10 text-[#d47336]"
                  }`}
                >
                  {entry.status?.toUpperCase() || "CONFIRMED"}
                </span>

                {isHost && (
                  <div className="flex gap-1.5 ml-2">
                    <button
                      type="button"
                      onClick={() => updateRoster(game.id, entry.player.id, "confirmed")}
                      className="rounded-lg px-2.5 py-1 text-[11px] font-bold bg-[#FAF7F2] text-[#253638] hover:bg-[#EAE4D7]"
                    >
                      Confirm
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal: Live Score Record & Conclude Match */}
      {scoringOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSaveScore}
            className="ezkora-fade w-full max-w-[480px] rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex justify-between items-start pb-3 border-b border-[#DDD6C8]">
              <div>
                <p className="mono-font text-[10px] uppercase tracking-wider text-[#277863] font-bold">
                  {game.sport} Scoring Console
                </p>
                <h3 className="display-font text-2xl font-bold text-[#18181b] mt-0.5">
                  Record Match Result
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setScoringOpen(false)}
                className="p-1 text-[#71807d] hover:text-[#253638]"
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <Field label="Official Final Score / Point Breakdown">
                <input
                  required
                  type="text"
                  value={scoreText}
                  onChange={(e) => setScoreText(e.target.value)}
                  placeholder={
                    game.sport === "Badminton"
                      ? "e.g. 21 - 18, 19 - 21, 21 - 17"
                      : game.sport === "Football"
                      ? "e.g. 3 - 2 (FT)"
                      : game.sport === "Cricket"
                      ? "e.g. 178/5 (20.0) vs 165/8 (20.0)"
                      : "e.g. 98 - 92"
                  }
                  className="field text-sm font-bold"
                />
              </Field>

              <Field label="Winner / Victorious Side">
                <input
                  type="text"
                  value={winnerName}
                  onChange={(e) => setWinnerName(e.target.value)}
                  placeholder={game.host?.displayName || "Player or Team Name"}
                  className="field text-sm"
                />
              </Field>

              <div className="rounded-2xl bg-[#FAF7F2] p-3 text-[11px] text-[#71807d]">
                ℹ️ When finalized, this official score will be marked as finished and automatically added to the profile match records of all {game.players?.length || 1} participating players.
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-[#DDD6C8]">
              <Button variant="quiet" onClick={() => setScoringOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={scoreSaving}>
                {scoreSaving ? "Saving..." : "Conclude & Record Score"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Match QR Code */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="ezkora-fade w-full max-w-sm rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-2xl text-center">
            <div className="flex justify-between items-center pb-3 border-b border-[#DDD6C8]">
              <span className="text-sm font-bold text-[#253638]">Match QR Code</span>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="p-1 text-[#71807d] hover:text-[#253638]"
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="mt-5 p-4 bg-[#FAF7F2] rounded-2xl inline-block border border-[#DDD6C8]">
              <svg className="size-48 mx-auto" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="#FAF7F2" />
                <rect x="10" y="10" width="26" height="26" fill="#18181b" rx="4" />
                <rect x="15" y="15" width="16" height="16" fill="#FAF7F2" rx="2" />
                <rect x="18" y="18" width="10" height="10" fill="#18181b" rx="1" />

                <rect x="64" y="10" width="26" height="26" fill="#18181b" rx="4" />
                <rect x="69" y="15" width="16" height="16" fill="#FAF7F2" rx="2" />
                <rect x="72" y="18" width="10" height="10" fill="#18181b" rx="1" />

                <rect x="10" y="64" width="26" height="26" fill="#18181b" rx="4" />
                <rect x="15" y="69" width="16" height="16" fill="#FAF7F2" rx="2" />
                <rect x="18" y="72" width="10" height="10" fill="#18181b" rx="1" />

                <rect x="42" y="14" width="6" height="6" fill="#18181b" />
                <rect x="52" y="14" width="6" height="6" fill="#18181b" />
                <rect x="42" y="34" width="16" height="6" fill="#18181b" />
                <rect x="14" y="44" width="10" height="6" fill="#18181b" />
                <rect x="50" y="44" width="18" height="6" fill="#18181b" />
                <rect x="42" y="56" width="8" height="8" fill="#18181b" />
                <rect x="62" y="70" width="12" height="6" fill="#18181b" />
                <rect x="62" y="82" width="28" height="8" fill="#18181b" />
              </svg>
            </div>

            <p className="mt-3 font-bold text-sm text-[#18181b]">{game.title}</p>
            <p className="mt-1 text-xs text-[#71807d]">
              Other players can scan this code to jump directly into the match fixture and join the roster.
            </p>

            <div className="mt-5">
              <Button onClick={() => setShowQrModal(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
