import React from "react";
import { Link } from "react-router-dom";

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
  testId,
  style,
}) {
  const styles = {
    primary: "bg-[#277863] text-white hover:brightness-110 shadow-sm",
    quiet: "bg-[#EAE4D7] text-[#253638] hover:bg-[#DDD6C8]",
    outline: "border border-[#DDD6C8] bg-white text-[#253638] hover:border-[#277863]/60 shadow-sm",
    danger: "bg-[#bd5549] text-white hover:brightness-110 shadow-sm",
    sport: "text-white shadow-sm hover:brightness-105",
  }[variant] || "bg-[#277863] text-white";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
      style={style}
      className={`action-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Avatar({ player, size = "md", className = "" }) {
  const sizeConfig = {
    xl: { px: 64, text: "text-xl", font: "font-bold" },
    lg: { px: 48, text: "text-base", font: "font-bold" },
    md: { px: 36, text: "text-xs", font: "font-bold" },
    sm: { px: 28, text: "text-[10px]", font: "font-bold" },
    xs: { px: 22, text: "text-[9px]", font: "font-semibold" },
  }[size] || { px: 36, text: "text-xs", font: "font-bold" };

  const initials = (player?.displayName || player?.publicId || "A")
    .slice(0, 1)
    .toUpperCase();

  const px = sizeConfig.px;

  if (player?.avatarUrl) {
    return (
      <img
        src={player.avatarUrl}
        alt={player?.displayName || "Player avatar"}
        style={{
          width: `${px}px`,
          height: `${px}px`,
          minWidth: `${px}px`,
          minHeight: `${px}px`,
          maxWidth: `${px}px`,
          maxHeight: `${px}px`,
        }}
        className={`shrink-0 rounded-full object-cover border border-[#DDD6C8] shadow-xs ${className}`}
      />
    );
  }

  return (
    <span
      style={{
        width: `${px}px`,
        height: `${px}px`,
        minWidth: `${px}px`,
        minHeight: `${px}px`,
      }}
      className={`${sizeConfig.text} ${sizeConfig.font} grid shrink-0 place-items-center rounded-full bg-[#d8b99f] text-[#5b3d31] shadow-xs ${className}`}
    >
      {initials}
    </span>
  );
}

export function EmptyState({ icon, title, body, action }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#DDD6C8] bg-white/60 px-6 py-10 text-center shadow-xs">
      <span className="grid w-12 h-12 place-items-center rounded-2xl bg-[#EAE4D7] text-[#277863] shadow-xs">
        {icon}
      </span>
      <h3 className="display-font mt-4 text-[21px] font-bold tracking-tight text-[#253638]">
        {title}
      </h3>
      <p className="mt-2 max-w-[420px] text-[13px] leading-relaxed text-[#71807d]">
        {body}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="block space-y-1.5 text-left">
      <span className="mono-font text-[10px] font-bold uppercase tracking-[0.16em] text-[#71807d]">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[11px] text-[#71807d]">{hint}</span>}
    </label>
  );
}

export function PageHeader({ eyebrow, title, body, action }) {
  return (
    <div className="ezkora-enter flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-[720px]">
        <p className="mono-font text-[10px] uppercase tracking-[0.2em] font-semibold text-[#277863]">
          {eyebrow}
        </p>
        <h1 className="display-font mt-2 text-[clamp(32px,5vw,56px)] font-bold leading-[0.96] tracking-[-0.07em] text-[#253638]">
          {title}
        </h1>
        <p className="mt-3.5 max-w-[580px] text-[14px] leading-relaxed text-[#71807d]">
          {body}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
