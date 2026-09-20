import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  IconCompass,
  IconUsers,
  IconCalendar,
  IconTrophy,
  IconSettings,
} from "./EzkoraIcons";
import { useEzkoraStore, SPORTS } from "../../store/ezkoraStore";

export function MobileBottomNav() {
  const location = useLocation();
  const activeSportName = useEzkoraStore((s) => s.activeSport);
  const sport = SPORTS.find((s) => s.name === activeSportName) || SPORTS[0];

  const tabs = [
    { href: "/", label: "Home", icon: <IconCompass size={20} /> },
    { href: "/players", label: "Chat", icon: <IconUsers size={20} /> },
    { href: "/matches", label: "Matches", icon: <IconTrophy size={20} /> },
    { href: "/settings", label: "Profile", icon: <IconSettings size={20} /> },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#DDD6C8] bg-[#FAF7F2]/95 backdrop-blur-md px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-all active:scale-90 ${
                isActive ? "font-bold" : "text-[#71807d] hover:text-[#253638]"
              }`}
              style={isActive ? { color: sport.accent } : undefined}
            >
              <span className="relative">
                {tab.icon}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: sport.accent }}
                  />
                )}
              </span>
              <span className="text-[10px] tracking-tight mt-1">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
