import React, { useState } from "react";
import { useEzkoraStore } from "../store/ezkoraStore";
import { PageHeader, Avatar, Button, EmptyState } from "../components/ezkora/CommonUI";
import { IconSearch, IconUsers, IconCheck, IconPlus } from "../components/ezkora/EzkoraIcons";

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const me = useEzkoraStore((s) => s.me);
  const players = useEzkoraStore((s) => s.players);
  const games = useEzkoraStore((s) => s.games);
  const friends = useEzkoraStore((s) => s.friends);
  const sendRequest = useEzkoraStore((s) => s.sendFriendRequest);
  const respondRequest = useEzkoraStore((s) => s.respondFriendRequest);

  const filteredPlayers = players.filter((p) => {
    if (p.id === me?.id || p.publicId === me?.publicId) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.displayName?.toLowerCase().includes(q) ||
      p.publicId?.toLowerCase().includes(q) ||
      p.primarySport?.toLowerCase().includes(q)
    );
  });

  const connectionFor = (playerId) => {
    return friends.find((f) => f.player.id === playerId);
  };

  const pendingIncoming = friends.filter(
    (f) => f.status === "pending" && f.direction === "incoming"
  );
  const acceptedFriends = friends.filter((f) => f.status === "accepted");

  return (
    <main className="mx-auto max-w-[1120px] px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      <PageHeader
        eyebrow="Player directory"
        title="Find your teammates."
        body="Search by verified EZKORA Player ID (e.g., PL-10001) or athlete name. Connections are real players across your sporting network."
      />

      <div className="mt-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
        {/* Left: Player Search & Results */}
        <section className="space-y-5">
          {/* Search bar */}
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-[#DDD6C8] bg-white px-4 shadow-sm focus-within:border-[#277863] focus-within:ring-2 focus-within:ring-[#277863]/10">
            <IconSearch size={18} className="text-[#71807d]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by athlete name, sport, or PL-XXXXXX ID..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none text-[#253638]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-[#71807d] hover:text-[#253638]"
              >
                Clear
              </button>
            )}
          </div>

          {filteredPlayers.length === 0 ? (
            <EmptyState
              icon={<IconUsers size={22} />}
              title="No athletes found"
              body="No athletes match your search criteria. Try a different name, sport, or verified Player ID."
            />
          ) : (
            <div className="space-y-3">
              {filteredPlayers.map((player) => {
                const conn = connectionFor(player.id);
                return (
                  <div
                    key={player.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#DDD6C8] bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-[#277863]/50"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Avatar player={player} size="md" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-[14px] font-bold text-[#253638]">
                            {player.displayName}
                          </p>
                          {player.primarySport && (
                            <span className="rounded-md bg-[#FAF7F2] border border-[#DDD6C8] px-2 py-0.5 text-[10px] font-bold text-[#71807d]">
                              {player.primarySport}
                            </span>
                          )}
                          {games.some(
                            (g) =>
                              g.status === "finished" &&
                              (g.host?.id === player.id ||
                                g.host?.publicId === player.publicId ||
                                g.players?.some(
                                  (p) =>
                                    p.player?.id === player.id ||
                                    p.player?.publicId === player.publicId
                                ))
                          ) && (
                            <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                              🏆 Matches Scored
                            </span>
                          )}
                        </div>
                        <p className="mono-font mt-0.5 truncate text-[11px] uppercase tracking-wider text-[#71807d]">
                          {player.publicId}
                        </p>
                        {player.bio && (
                          <p className="mt-1 text-xs text-[#71807d] line-clamp-1">
                            {player.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Connection Button */}
                    <div>
                      {conn?.status === "accepted" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#277863]/10 px-3 py-1.5 text-xs font-bold text-[#277863]">
                          <IconCheck size={14} /> Connected
                        </span>
                      ) : conn?.status === "pending" && conn?.direction === "incoming" ? (
                        <div className="flex gap-2">
                          <Button
                            variant="quiet"
                            className="min-h-8 px-2.5 text-xs"
                            onClick={() => respondRequest(conn.id, "declined")}
                          >
                            Decline
                          </Button>
                          <Button
                            className="min-h-8 px-3 text-xs"
                            onClick={() => respondRequest(conn.id, "accepted")}
                          >
                            Accept
                          </Button>
                        </div>
                      ) : conn?.status === "pending" ? (
                        <span className="rounded-xl border border-[#DDD6C8] bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#71807d]">
                          Request sent
                        </span>
                      ) : (
                        <Button
                          className="min-h-8 px-3.5 text-xs"
                          onClick={() => sendRequest(player.id)}
                        >
                          <IconPlus size={14} /> Connect
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Sidebar: Your Circle */}
        <aside className="space-y-6">
          <section className="rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-sm">
            <p className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold text-[#277863]">
              Your Network
            </p>
            <h2 className="display-font mt-1.5 text-2xl font-bold tracking-tight text-[#253638]">
              Your Circle ({acceptedFriends.length})
            </h2>

            {/* Pending Requests */}
            {pendingIncoming.length > 0 && (
              <div className="mt-5 border-b border-[#DDD6C8] pb-4">
                <p className="text-[11px] font-bold text-[#bd5549] uppercase tracking-wider mb-2">
                  Action Required ({pendingIncoming.length})
                </p>
                <div className="space-y-2.5">
                  {pendingIncoming.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between rounded-xl bg-[#FAF7F2] p-2.5 border border-[#DDD6C8]"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar player={f.player} size="sm" />
                        <span className="truncate text-xs font-bold text-[#253638]">
                          {f.player.displayName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => respondRequest(f.id, "accepted")}
                        className="text-xs font-bold text-[#277863] hover:underline"
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connected Teammates */}
            <div className="mt-5 space-y-3">
              {acceptedFriends.length === 0 ? (
                <p className="text-xs leading-relaxed text-[#71807d]">
                  Your circle is waiting. Search and connect with players to schedule matches and compare stats.
                </p>
              ) : (
                acceptedFriends.map((f) => (
                  <div key={f.id} className="flex items-center gap-3">
                    <Avatar player={f.player} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-[#253638]">
                        {f.player.displayName}
                      </p>
                      <p className="mono-font text-[10px] text-[#71807d]">
                        {f.player.publicId}
                      </p>
                    </div>
                    <span className="text-[#277863]">
                      <IconCheck size={14} />
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
