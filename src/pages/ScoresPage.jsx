import React from "react";
import { useAervoStore, SPORTS } from "../store/aervoStore";
import { PageHeader } from "../components/aervo/CommonUI";
import { ScoreboardDemo } from "../components/aervo/ScoreboardDemo";

export default function ScoresPage() {
  const activeSportName = useAervoStore((s) => s.activeSport);
  const games = useAervoStore((s) => s.games);
  const sport = SPORTS.find((s) => s.name === activeSportName) || SPORTS[0];

  return (
    <main className="mx-auto max-w-[1020px] px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-12">
      <PageHeader
        eyebrow={`${sport.name} / Official Scoring`}
        title="Keep the result."
        body={`A clear scoreboard for verified ${sport.name.toLowerCase()} match records. Official ball-by-ball updates, point progression, and historical fixtures.`}
      />

      <div className="mt-8 space-y-8">
        <ScoreboardDemo />

        {/* Historical Matches */}
        <section className="rounded-3xl border border-[#DDD6C8] bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div>
            <p className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold text-[#277863]">
              Official Records
            </p>
            <h3 className="display-font mt-1 text-2xl font-bold tracking-tight text-[#253638]">
              Recent {sport.name} Results
            </h3>
          </div>

          {games.filter((g) => g.status === "finished" && g.sport === activeSportName).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DDD6C8] bg-[#FAF7F2] p-8 text-center">
              <p className="text-sm font-semibold text-[#253638]">
                No recorded {sport.name.toLowerCase()} match results yet.
              </p>
              <p className="mt-1 text-xs text-[#71807d]">
                Official scores and match statistics will automatically appear here as games are completed.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {games
                .filter((g) => g.status === "finished" && g.sport === activeSportName)
                .map((game) => (
                  <div
                    key={game.id}
                    className="flex flex-wrap items-center justify-between rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] p-4 text-xs font-semibold"
                  >
                    <div className="space-y-1">
                      <span className="mono-font text-[10px] uppercase tracking-wider text-[#71807d]">
                        {game.sport} Match
                      </span>
                      <p className="text-[14px] font-bold text-[#253638]">
                        {game.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-sm text-[#277863]">
                        Completed
                      </span>
                      <p className="mono-font text-[11px] text-[#71807d]">
                        {new Date(game.scheduledAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
