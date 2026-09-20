import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEzkoraStore, SPORTS } from "../store/ezkoraStore";
import { Button, Avatar, EmptyState } from "../components/ezkora/CommonUI";
import { IconArrowLeft, IconCheck, IconClock, IconMapPin, IconUsers } from "../components/ezkora/EzkoraIcons";

export default function GameDetailPage() {
  const { gameId } = useParams();
  const idNum = Number(gameId);

  const games = useEzkoraStore((s) => s.games);
  const me = useEzkoraStore((s) => s.me);
  const joinGame = useEzkoraStore((s) => s.joinGame);
  const updateRoster = useEzkoraStore((s) => s.updateRosterStatus);

  const game = games.find((g) => g.id === idNum);

  if (!game) {
    return (
      <main className="mx-auto max-w-[800px] px-5 py-16 text-center">
        <EmptyState
          icon={<IconUsers size={24} />}
          title="Game fixture not found"
          body="This fixture might have been concluded or moved. Explore active games from the calendar."
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
  const isHost = game.host?.id === me?.id;
  const myEntry = game.players?.find((entry) => entry.player.id === me?.id);

  return (
    <main className="mx-auto max-w-[950px] px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      <Link
        to="/games"
        className="inline-flex items-center gap-2 text-[13px] font-bold text-[#71807d] hover:text-[#253638]"
      >
        <IconArrowLeft size={16} /> All {game.sport} games
      </Link>

      <div className="ezkora-enter mt-6 rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span
              className="rounded-full px-3 py-1 text-[11px] font-bold"
              style={{
                color: sportConfig.deep,
                backgroundColor: sportConfig.wash,
              }}
            >
              {game.status.toUpperCase()}
            </span>
            <h1 className="display-font mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#253638]">
              {game.title}
            </h1>
          </div>

          <div>
            {!isHost && !myEntry && (
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
          </div>
        </div>

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

      {/* Roster Section */}
      <section className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold text-[#277863]">
              Confirmed Lineup
            </p>
            <h2 className="display-font mt-1 text-2xl font-bold tracking-tight text-[#253638]">
              Roster ({game.players?.length || 0} players)
            </h2>
          </div>
          {isHost && (
            <span className="rounded-full bg-[#FAF7F2] border border-[#DDD6C8] px-3 py-1 text-[11px] font-bold text-[#71807d]">
              Host controls active
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          {game.players?.map((entry) => (
            <div
              key={entry.player.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DDD6C8] bg-white p-4 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Avatar player={entry.player} size="md" />
                <div>
                  <p className="font-bold text-sm text-[#253638]">
                    {entry.player.displayName}
                  </p>
                  <p className="mono-font text-[10px] text-[#71807d]">
                    {entry.player.publicId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                    entry.status === "confirmed"
                      ? "bg-[#277863]/10 text-[#277863]"
                      : entry.status === "waitlisted"
                      ? "bg-[#d47336]/10 text-[#d47336]"
                      : "bg-[#bd5549]/10 text-[#bd5549]"
                  }`}
                >
                  {entry.status.toUpperCase()}
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
                    <button
                      type="button"
                      onClick={() => updateRoster(game.id, entry.player.id, "waitlisted")}
                      className="rounded-lg px-2.5 py-1 text-[11px] font-bold bg-[#FAF7F2] text-[#71807d] hover:bg-[#EAE4D7]"
                    >
                      Waitlist
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
