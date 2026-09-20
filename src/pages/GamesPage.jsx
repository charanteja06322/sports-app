import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useEzkoraStore, SPORTS } from "../store/ezkoraStore";
import { PageHeader, Button, EmptyState, Field } from "../components/ezkora/CommonUI";
import { IconPlus, IconCalendar, IconClock, IconMapPin, IconArrowUpRight, IconX } from "../components/ezkora/EzkoraIcons";

export default function GamesPage() {
  const activeSportName = useEzkoraStore((s) => s.activeSport);
  const sport = SPORTS.find((s) => s.name === activeSportName) || SPORTS[0];
  const games = useEzkoraStore((s) => s.games);
  const addGame = useEzkoraStore((s) => s.addGame);

  const [createOpen, setCreateOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formLocation, setFormLocation] = useState("");

  const sportGames = games.filter((g) => g.sport === activeSportName);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    addGame({
      sport: activeSportName,
      title: formTitle.trim(),
      scheduledAt: formDate ? new Date(formDate).toISOString() : new Date().toISOString(),
      location: formLocation.trim() || "Local Arena",
    });

    setFormTitle("");
    setFormDate("");
    setFormLocation("");
    setCreateOpen(false);
  };

  return (
    <main className="mx-auto max-w-[1120px] px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      <PageHeader
        eyebrow={`${sport.name} / Games & Matchups`}
        title="Make a plan."
        body={`Create or join a ${sport.name.toLowerCase()} game. Your sport lens keeps fixtures focused on what you actually want to play.`}
        action={
          <Button
            onClick={() => setCreateOpen(true)}
            style={{ backgroundColor: sport.accent }}
            className="text-white shadow-md hover:brightness-105"
          >
            <IconPlus size={16} />
            <span>Create a game</span>
          </Button>
        }
      />

      <div className="mt-10">
        {sportGames.length === 0 ? (
          <EmptyState
            icon={<IconCalendar size={24} />}
            title={`No ${sport.name.toLowerCase()} games scheduled yet.`}
            body="Start with a title, a time, and a location. Teammates can RSVP and join rosters immediately."
            action={
              <Button onClick={() => setCreateOpen(true)}>
                <IconPlus size={15} />
                <span>Create the first game</span>
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
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-bold"
                    style={{
                      color: sport.deep,
                      backgroundColor: sport.wash,
                    }}
                  >
                    {game.status.toUpperCase()}
                  </span>
                  <IconArrowUpRight
                    size={18}
                    className="text-[#71807d] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

                <h3 className="display-font mt-5 text-xl font-bold leading-snug text-[#253638]">
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

                <div className="mt-6 flex items-center justify-between border-t border-[#DDD6C8] pt-4 text-xs font-semibold text-[#71807d]">
                  <span>Hosted by {game.host?.displayName || "Captain"}</span>
                  <span className="text-[#277863] font-bold">
                    {game.players?.length || 1} playing →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Game Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="ezkora-fade w-full max-w-[500px] rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="flex justify-between items-start">
              <div>
                <p
                  className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold"
                  style={{ color: sport.deep }}
                >
                  New {sport.name} Game
                </p>
                <h2 className="display-font mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#253638]">
                  Set the fixture details.
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
              <Field label="Fixture Title">
                <input
                  required
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={`Saturday ${sport.name.toLowerCase()} session`}
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

              <Field label="Where (Venue or Field)">
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Central Sports Complex, Pitch 4"
                  className="field"
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-[#DDD6C8]">
              <Button variant="quiet" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: sport.accent }}
                className="text-white"
              >
                Create game
              </Button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
