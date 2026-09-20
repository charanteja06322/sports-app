import React from "react";
import {
  LuCompass,
  LuUsers,
  LuCalendarDays,
  LuTrophy,
  LuSettings,
  LuSearch,
  LuBell,
  LuChevronDown,
  LuPlus,
  LuHeart,
  LuMessageCircle,
  LuImagePlus,
  LuCheck,
  LuX,
  LuArrowUpRight,
  LuArrowRight,
  LuArrowLeft,
  LuClock3,
  LuMapPin,
  LuCircleDot,
  LuFootprints,
  LuBike,
  LuShieldCheck,
  LuUserRound,
  LuMenu,
  LuSun,
  LuMoon,
  LuZap,
} from "react-icons/lu";
import { FaVolleyballBall } from "react-icons/fa";
import { MdSportsCricket } from "react-icons/md";
import { FaBasketball, FaFutbol, FaVolleyball } from "react-icons/fa6";
import { GiShuttlecock } from "react-icons/gi";

export function IconGoogle({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export {
  LuCompass as IconCompass,
  LuUsers as IconUsers,
  LuCalendarDays as IconCalendar,
  LuTrophy as IconTrophy,
  LuSettings as IconSettings,
  LuSearch as IconSearch,
  LuBell as IconBell,
  LuChevronDown as IconChevronDown,
  LuPlus as IconPlus,
  LuHeart as IconHeart,
  LuMessageCircle as IconMessageCircle,
  LuImagePlus as IconImagePlus,
  LuCheck as IconCheck,
  LuX as IconX,
  LuArrowUpRight as IconArrowUpRight,
  LuArrowRight as IconArrowRight,
  LuArrowLeft as IconArrowLeft,
  LuClock3 as IconClock,
  LuMapPin as IconMapPin,
  LuCircleDot as IconCircleDot,
  LuFootprints as IconFootprints,
  LuBike as IconBike,
  LuShieldCheck as IconShield,
  LuUserRound as IconUser,
  LuMenu as IconMenu,
  LuSun as IconSun,
  LuMoon as IconMoon,
  LuZap as IconZap,
  FaVolleyballBall as IconVolleyball,
  MdSportsCricket as IconCricket,
  FaBasketball as IconBasketball,
  FaFutbol as IconFootball,
};

export function SportIcon({ name, size = 16, className = "" }) {
  switch (name) {
    case "Football":
      return <FaFutbol size={size} className={className} />;
    case "Basketball":
      return <FaBasketball size={size} className={className} />;
    case "Badminton":
      return <GiShuttlecock size={size} className={className} />;
    case "Cricket":
      return <MdSportsCricket size={size} className={className} />;
    case "Running":
      return <LuFootprints size={size} className={className} />;
    case "Cycling":
      return <LuBike size={size} className={className} />;
    case "Volleyball":
      return <FaVolleyball size={size} className={className} />;
    default:
      return <FaFutbol size={size} className={className} />;
  }
}

export function LogoMark({ light = false }) {
  return (
    <div className={`flex items-center gap-2.5 ${light ? "text-[#FAF7F2]" : "text-[#253638]"}`}>
      <span
        className={`grid w-9 h-9 place-items-center rounded-[11px] ${
          light ? "bg-[#ce7045] text-white" : "bg-[#277863] text-white"
        } shadow-sm`}
      >
        <span className="relative block w-4 h-4">
          <span className="absolute left-1/2 top-0 h-4 w-[2px] -translate-x-1/2 rotate-45 rounded-full bg-current" />
          <span className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 rotate-45 rounded-full bg-current" />
        </span>
      </span>
      <span className="display-font text-[22px] font-bold tracking-[-0.06em]">EZKORA</span>
    </div>
  );
}
