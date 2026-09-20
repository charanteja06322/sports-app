import React from "react";
import { Link } from "react-router-dom";
import { useEzkoraStore, SPORTS } from "../store/ezkoraStore";
import { PageHeader, Button, EmptyState, Avatar } from "../components/ezkora/CommonUI";
import { PostCard } from "../components/ezkora/PostCard";
import { IconPlus, IconArrowUpRight, IconClock, IconMapPin, IconMessageCircle } from "../components/ezkora/EzkoraIcons";

export default function HomePage() {
  const activeSportName = useEzkoraStore((s) => s.activeSport);
  const sport = SPORTS.find((s) => s.name === activeSportName) || SPORTS[0];
  const me = useEzkoraStore((s) => s.me);
  const posts = useEzkoraStore((s) => s.posts);
  const games = useEzkoraStore((s) => s.games);
  const openComposer = useEzkoraStore((s) => s.openComposer);

  // Filter posts and games by active sport lens
  const sportPosts = posts.filter((p) => p.sport === activeSportName);
  const sportGames = games.filter((g) => g.sport === activeSportName);

  return (
    <main className="mx-auto max-w-[1240px] px-5 pb-16 pt-8 sm:px-8 lg:px-10 lg:pt-11">
      {/* Page Header */}
      <PageHeader
        eyebrow={`${sport.name} / Community Home`}
        title={me?.displayName ? `Welcome back, ${me.displayName.split(" ")[0]}.` : "Your sport, in motion."}
        body={`A focused place for ${sport.name.toLowerCase()} athletes to connect, organize games, and share what is happening on the field.`}
        action={
          <Button
            onClick={openComposer}
            style={{ backgroundColor: sport.accent }}
            className="text-white shadow-md hover:brightness-105"
          >
            <IconPlus size={16} />
            <span>Create Post</span>
          </Button>
        }
      />

      {/* Main Grid: Feed + Right Sidebar */}
      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left: Feed */}
        <section className="min-w-0 space-y-5">
          {/* Inline Post Creator Box */}
          <div className="rounded-3xl border border-[#DDD6C8] bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-[#18181b]/30">
            <div className="flex items-center gap-3">
              <Avatar player={me} size="md" />
              <button
                type="button"
                onClick={openComposer}
                className="flex-1 rounded-2xl border border-[#DDD6C8] bg-[#FAF7F2] px-4 py-3 text-left text-xs sm:text-[13px] font-medium text-[#71807d] hover:bg-white hover:border-[#18181b]/40 hover:text-[#253638] transition-all"
              >
                {me?.displayName
                  ? `What's happening in your ${sport.name} today, ${me.displayName.split(" ")[0]}?`
                  : `Share a ${sport.name} match highlight, score, or thought...`}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#DDD6C8]/60 pt-3 text-xs font-bold text-[#71807d]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openComposer}
                  className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 hover:bg-[#FAF7F2] hover:text-[#253638] transition-colors"
                >
                  <span className="text-emerald-600">📷</span>
                  <span>Photo</span>
                </button>
                <Link
                  to="/matches"
                  className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 hover:bg-[#FAF7F2] hover:text-[#253638] transition-colors"
                >
                  <span className="text-amber-600">🏆</span>
                  <span>Matches & Scoring</span>
                </Link>
                <Link
                  to="/players"
                  className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 hover:bg-[#FAF7F2] hover:text-[#253638] transition-colors"
                >
                  <span className="text-blue-600">💬</span>
                  <span>Chat</span>
                </Link>
              </div>
              <Button
                onClick={openComposer}
                style={{ backgroundColor: sport.accent }}
                className="text-white text-xs px-3.5 py-1.5 shadow-xs"
              >
                <IconPlus size={14} />
                <span>Create Post</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="mono-font text-[10px] uppercase tracking-[0.18em] text-[#71807d]">
                The {sport.name.toLowerCase()} feed
              </p>
              <h2 className="display-font mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#253638]">
                From the community
              </h2>
            </div>
            <Link
              to="/players"
              className="text-[12px] font-bold text-[#277863] hover:underline flex items-center gap-1"
            >
              Find athletes <IconArrowUpRight size={14} />
            </Link>
          </div>

          {sportPosts.length === 0 ? (
            <EmptyState
              icon={<IconMessageCircle size={24} />}
              title={`Your ${sport.name.toLowerCase()} feed is open.`}
              body={`There are no ${sport.name.toLowerCase()} posts yet. Be the first to share a real moment from your court or field.`}
              action={
                <Button onClick={openComposer}>
                  <IconPlus size={15} />
                  <span>Create a post</span>
                </Button>
              }
            />
          ) : (
            <div className="space-y-5">
              {sportPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

        </section>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Upcoming Matches Card */}
          <section className="rounded-3xl border border-[#DDD6C8] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="mono-font text-[10px] uppercase tracking-[0.18em] font-semibold"
                  style={{ color: sport.deep }}
                >
                  On the calendar
                </p>
                <h2 className="display-font mt-1.5 text-xl font-bold tracking-tight text-[#253638]">
                  Open {sport.name} Matches
                </h2>
              </div>
              <Link
                to="/matches"
                className="grid size-8 place-items-center rounded-full bg-[#FAF7F2] text-[#277863] hover:bg-[#EAE4D7]"
              >
                <IconArrowUpRight size={16} />
              </Link>
            </div>

            {sportGames.length === 0 ? (
              <p className="mt-4 text-[13px] leading-relaxed text-[#71807d]">
                No {sport.name.toLowerCase()} matches scheduled yet. Set one up for your circle!
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {sportGames.slice(0, 3).map((game) => (
                  <Link
                    to={`/matches/${game.id}`}
                    key={game.id}
                    className="block rounded-2xl border border-[#DDD6C8] p-3.5 transition-all hover:border-[#277863]/60 hover:bg-[#FAF7F2]/50"
                  >
                    <p className="truncate text-[13px] font-bold text-[#253638]">
                      {game.title}
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#71807d]">
                      <IconClock size={12} />
                      <span>{new Date(game.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </p>
                    {game.location && (
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#71807d]">
                        <IconMapPin size={12} />
                        <span className="truncate">{game.location}</span>
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-5 border-t border-[#DDD6C8] pt-3">
              <Link
                to="/matches"
                className="inline-flex items-center gap-1 text-[12px] font-bold text-[#277863] hover:underline"
              >
                View all matches <IconArrowUpRight size={13} />
              </Link>
            </div>
          </section>

          {/* EZKORA Principle Card */}
          <section
            className="relative overflow-hidden rounded-3xl p-6 text-white shadow-md"
            style={{ backgroundColor: sport.deep }}
          >
            <div className="absolute -right-8 -top-8 size-32 rounded-full border border-white/15 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 size-36 rounded-full border border-white/10 pointer-events-none" />
            <p className="relative mono-font text-[10px] uppercase tracking-[0.2em] text-white/70 font-semibold">
              EZKORA principle
            </p>
            <h3 className="relative display-font mt-2 text-2xl font-bold leading-tight tracking-tight">
              Real athletes.<br />Real matches.
            </h3>
            <p className="relative mt-3 text-[13px] leading-relaxed text-white/80">
              Everything in EZKORA is driven by genuine local athletes and real game scores. Seamlessly scoped to your active sport.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
