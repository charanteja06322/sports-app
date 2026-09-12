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
};

export function SportIcon({ name, size = 16, className = "" }) {
  switch (name) {
    case "Football":
      return <LuCircleDot size={size} className={className} />;
    case "Basketball":
      return <LuTrophy size={size} className={className} />;
    case "Tennis":
      return <LuCircleDot size={size} className={className} />;
    case "Cricket":
      return <LuShieldCheck size={size} className={className} />;
    case "Running":
      return <LuFootprints size={size} className={className} />;
    case "Cycling":
      return <LuBike size={size} className={className} />;
    case "Volleyball":
      return <FaVolleyballBall size={size} className={className} />;
    default:
      return <LuCircleDot size={size} className={className} />;
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
      <span className="display-font text-[22px] font-bold tracking-[-0.06em]">aervo</span>
    </div>
  );
}
