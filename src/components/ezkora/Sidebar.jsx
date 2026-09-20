import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LogoMark, IconCompass, IconUsers, IconCalendar, IconTrophy, IconSettings, IconUser, IconX, SportIcon } from "./EzkoraIcons";
import { Avatar } from "./CommonUI";
import { useEzkoraStore, SPORTS } from "../../store/ezkoraStore";

export function Sidebar({ mobileClose }) {
  const location = useLocation();
  const activeSportName = useEzkoraStore((s) => s.activeSport);
  const sport = SPORTS.find((s) => s.name === activeSportName) || SPORTS[0];
  const me = useEzkoraStore((s) => s.me);

  const links = [
    { href: "/", label: "Home", icon: <IconCompass size={18} /> },
    { href: "/players", label: "Players & Chat", icon: <IconUsers size={18} /> },
    { href: "/matches", label: "Matches", icon: <IconTrophy size={18} /> },
  ];

  return (
    <aside className="flex h-full w-[256px] shrink-0 flex-col bg-[#1c2e30] px-4 py-5 text-[#FAF7F2] shadow-xl">
      {/* Brand & Mobile Close */}
      <div className="flex items-center justify-between px-2">
        <Link to="/" onClick={mobileClose} className="hover:opacity-90">
          <LogoMark light />
        </Link>
        {mobileClose && (
          <button
            type="button"
            onClick={mobileClose}
            aria-label="Close navigation"
            className="grid size-8 place-items-center rounded-lg text-[#FAF7F2]/60 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <IconX size={18} />
          </button>
        )}
      </div>

      {/* Active Sport Lens Card */}
      <div className="mt-8 px-2">
        <p className="mono-font text-[10px] uppercase tracking-[0.2em] text-[#FAF7F2]/45">
          Active lens
        </p>
        <div className="mt-2.5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
          <span
            className="grid size-10 place-items-center rounded-xl text-white shadow-md"
            style={{ backgroundColor: sport.accent }}
          >
            <SportIcon name={sport.name} size={18} />
          </span>
          <span className="min-w-0">
            <span className="block text-[14px] font-bold tracking-tight text-white">
              {sport.name}
            </span>
            <span className="mt-0.5 block truncate text-[11px] text-[#FAF7F2]/60">
              {sport.descriptor}
            </span>
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="mt-8 space-y-1.5" aria-label="Main navigation">
        <p className="px-2 pb-1 mono-font text-[10px] uppercase tracking-[0.2em] text-[#FAF7F2]/45">
          Explore
        </p>
        {links.map((item) => {
          const active =
            item.href === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={mobileClose}
              className={`action-ring flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all ${
                active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-[#FAF7F2]/65 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span style={{ color: active ? sport.accent : "currentColor" }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {active && (
                <span
                  className="ml-auto size-2 rounded-full"
                  style={{ backgroundColor: sport.accent }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile & Settings */}
      <div className="mt-auto border-t border-white/10 pt-4">
        <Link
          to="/settings"
          onClick={mobileClose}
          className="action-ring flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] text-[#FAF7F2]/70 hover:bg-white/10 hover:text-white"
        >
          <IconSettings size={18} />
          <span>Settings</span>
        </Link>
        <Link
          to="/settings"
          onClick={mobileClose}
          className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5 hover:bg-white/10 transition-colors"
        >
          <Avatar player={me} size="sm" />
          <div className="min-w-0 flex-1 truncate">
            <span className="block truncate text-[12px] font-bold text-white">
              {me?.displayName}
            </span>
            <span className="mono-font block truncate text-[10px] text-[#FAF7F2]/50">
              {me?.publicId}
            </span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
