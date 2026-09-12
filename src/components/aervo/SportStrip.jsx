import React from "react";
import { SportIcon } from "./AervoIcons";
import { useAervoStore, SPORTS } from "../../store/aervoStore";

export function SportStrip() {
  const activeSport = useAervoStore((s) => s.activeSport);
  const setSport = useAervoStore((s) => s.setSport);

  return (
    <div className="thin-scrollbar flex gap-2 overflow-x-auto border-b border-[#DDD6C8] bg-white/50 px-5 py-2 sm:px-8 lg:px-10">
      {SPORTS.map((item) => {
        const isSelected = item.name === activeSport;
        return (
          <button
            type="button"
            key={item.name}
            onClick={() => setSport(item.name)}
            className={`action-ring flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-all ${
              isSelected
                ? "text-white shadow-sm scale-[1.02]"
                : "bg-white text-[#71807d] border border-[#DDD6C8] hover:bg-[#EAE4D7] hover:text-[#253638]"
            }`}
            style={
              isSelected
                ? { backgroundColor: item.accent, borderColor: item.accent }
                : undefined
            }
          >
            <SportIcon name={item.name} size={15} />
            <span>{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}
