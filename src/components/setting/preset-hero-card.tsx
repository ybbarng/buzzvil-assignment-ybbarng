import { ROLE_COLORS, ROLE_LABELS } from "@/constants/presets";
import { STAT_LABELS, STAT_RANGES } from "@/constants/stats";
import type { StatKey } from "@/types/character";
import type { HeroPreset } from "@/types/preset";

const STAT_BAR_COLORS: Record<StatKey, string> = {
  hp: "bg-hp",
  mp: "bg-mp",
  atk: "bg-damage",
  def: "bg-accent-blue",
  spd: "bg-buff",
};

export function PresetHeroDetail({ hero }: { hero: HeroPreset }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className={`h-3 w-1 rounded-full ${ROLE_COLORS[hero.role]}`} />
        <span className="text-xs text-text-secondary">
          {ROLE_LABELS[hero.role]}
        </span>
      </div>
      <p className="font-bold text-text-primary">{hero.name}</p>
      <p className="text-xs text-text-muted">{hero.description}</p>
      <div className="flex flex-col gap-1.5 pt-1">
        {(Object.keys(hero.stats) as StatKey[]).map((key) => {
          const value = hero.stats[key];
          const range = STAT_RANGES[key];
          const percent = ((value - range.min) / (range.max - range.min)) * 100;
          return (
            <div key={key} className="flex items-center gap-2">
              <span className="w-7 text-right text-[11px] font-medium text-text-secondary">
                {STAT_LABELS[key]}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-primary">
                <div
                  className={`h-full rounded-full transition-all ${STAT_BAR_COLORS[key]}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-6 text-right text-[11px] tabular-nums text-text-muted">
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
