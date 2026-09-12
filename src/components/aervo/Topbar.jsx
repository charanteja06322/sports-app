import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IconMenu, IconSearch, IconBell, IconChevronDown, SportIcon, IconCheck, IconPlus } from "./AervoIcons";
import { Avatar, Button } from "./CommonUI";
import { useAervoStore, SPORTS } from "../../store/aervoStore";

export function Topbar({ openMenu }) {
  const activeSportName = useAervoStore((s) => s.activeSport);
  const sport = SPORTS.find((s) => s.name === activeSportName) || SPORTS[0];
  const me = useAervoStore((s) => s.me);
  const allAthletes = useAervoStore((s) => s.allAthletes);
  const switchAthlete = useAervoStore((s) => s.switchAthlete);

  const [noticeOpen, setNoticeOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-[70px] shrink-0 items-center justify-between border-b border-[#DDD6C8] bg-[#FAF7F2]/90 px-5 backdrop-blur-md sm:px-8 lg:px-10">
      {/* Left: Mobile menu toggle & Sport indicator */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={openMenu}
          className="action-ring grid w-9 h-9 place-items-center rounded-xl border border-[#DDD6C8] bg-white text-[#253638] shadow-xs lg:hidden"
        >
          <IconMenu size={20} />
        </button>

        <div className="hidden items-center gap-2.5 text-[12px] sm:flex">
          <span className="mono-font uppercase tracking-[0.16em] text-[#71807d]">
            AERVO
          </span>
          <span className="w-1 h-1 rounded-full bg-[#DDD6C8]" />
          <span
            className="flex items-center gap-1.5 font-bold"
            style={{ color: sport.deep }}
          >
            <SportIcon name={sport.name} size={15} />
            {sport.name}
          </span>
          <span className="text-[#71807d]">· {sport.descriptor}</span>
        </div>

        <div className="flex items-center gap-2 text-[13px] sm:hidden">
          <span style={{ color: sport.accent }}>
            <SportIcon name={sport.name} size={16} />
          </span>
          <b className="text-[#253638]">{sport.name}</b>
        </div>
      </div>

      {/* Right: Search, Notifications, Profile Switcher */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live sync pill */}
        <div className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-700 md:flex border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>LIVE SYNC</span>
        </div>

        <Link
          to="/players"
          className="hidden h-9 w-[180px] items-center gap-2 rounded-xl border border-[#DDD6C8] bg-white px-3 text-[12px] text-[#71807d] shadow-xs hover:border-[#277863]/50 transition-colors md:flex"
        >
          <IconSearch size={14} />
          <span>Find athletes...</span>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setNoticeOpen((open) => !open);
              setProfileMenuOpen(false);
            }}
            className="action-ring grid w-9 h-9 place-items-center rounded-xl border border-[#DDD6C8] bg-white text-[#71807d] shadow-xs hover:bg-[#EAE4D7] hover:text-[#253638]"
          >
            <IconBell size={16} />
          </button>

          {noticeOpen && (
            <div className="aervo-fade absolute right-0 top-11 z-30 w-64 rounded-2xl border border-[#DDD6C8] bg-white p-4 shadow-xl">
              <p className="text-xs font-bold text-[#253638]">Live Notifications</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#71807d]">
                Instant updates on match RSVPs, post likes, and comments from fellow athletes.
              </p>
              <div className="mt-3 border-t border-[#DDD6C8] pt-2">
                <Link
                  to="/games"
                  onClick={() => setNoticeOpen(false)}
                  className="text-[11px] font-bold text-[#277863] hover:underline"
                >
                  View calendar fixtures →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile / Athlete Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen((open) => !open);
              setNoticeOpen(false);
            }}
            className="action-ring flex items-center gap-2 rounded-full border border-[#DDD6C8] bg-white py-1 pl-1 pr-2.5 shadow-xs hover:bg-[#FAF7F2] transition-colors"
          >
            <Avatar player={me} size="sm" />
            <span className="hidden text-xs font-bold text-[#253638] sm:inline max-w-[100px] truncate">
              {me?.displayName?.split(" ")[0]}
            </span>
            <IconChevronDown size={13} className="text-[#71807d]" />
          </button>

          {profileMenuOpen && (
            <div className="aervo-fade absolute right-0 top-11 z-30 w-72 rounded-2xl border border-[#DDD6C8] bg-white p-4 shadow-xl">
              {/* Current user info */}
              <div className="flex items-center gap-3 border-b border-[#DDD6C8] pb-3">
                <Avatar player={me} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-[#253638]">
                    {me?.displayName}
                  </p>
                  <span className="mono-font inline-block text-[10px] text-[#71807d]">
                    {me?.publicId}
                  </span>
                </div>
              </div>

              {/* Multi-user switch section */}
              <div className="mt-3">
                <p className="mono-font text-[10px] uppercase tracking-wider text-[#71807d] mb-1.5">
                  Switch Active Athlete
                </p>
                <div className="space-y-1">
                  {allAthletes.map((ath) => {
                    const isCurrent = ath.id === me?.id;
                    return (
                      <button
                        key={ath.id}
                        type="button"
                        onClick={() => {
                          switchAthlete(ath);
                          setProfileMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-left transition-colors ${
                          isCurrent
                            ? "bg-[#FAF7F2] font-bold text-[#277863]"
                            : "text-[#253638] hover:bg-[#FAF7F2]"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar player={ath} size="xs" />
                          <span className="truncate">{ath.displayName}</span>
                        </div>
                        {isCurrent && <IconCheck size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 border-t border-[#DDD6C8] pt-2.5 flex items-center justify-between">
                <Link
                  to="/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="text-xs font-bold text-[#277863] hover:underline"
                >
                  Edit profile & settings
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
