import { Badge } from "@/components/ui/badge";
import { ROLE_COLORS, ROLE_LABELS } from "@/constants/presets";
import { STAT_LABELS, STAT_RANGES } from "@/constants/stats";
import type { StatKey } from "@/types/character";
import type { HeroPreset } from "@/types/preset";

interface PresetHeroCardProps {
  hero: HeroPreset;
  onSelect: (hero: HeroPreset) => void;
}

const STAT_BAR_COLORS: Record<StatKey, string> = {
  hp: "bg-hp",
  mp: "bg-mp",
  atk: "bg-damage",
  def: "bg-accent-blue",
  spd: "bg-buff",
};

export function PresetHeroCard({ hero, onSelect }: PresetHeroCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(hero)}
      className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-bg-tertiary transition-all hover:scale-[1.03] hover:border-accent-orange"
    >
      <div className={`h-1.5 w-full ${ROLE_COLORS[hero.role]}`} />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start justify-between gap-1">
          <span className="text-left font-bold text-text-primary">
            {hero.name}
          </span>
          <Badge
            variant="outline"
            className="shrink-0 border-border text-xs text-text-secondary"
          >
            {ROLE_LABELS[hero.role]}
          </Badge>
        </div>
        <p className="text-left text-xs text-text-muted">{hero.description}</p>
        <div className="mt-auto flex flex-col gap-1">
          {(Object.keys(hero.stats) as StatKey[]).map((key) => {
            const value = hero.stats[key];
            const range = STAT_RANGES[key];
            const percent =
              ((value - range.min) / (range.max - range.min)) * 100;
            return (
              <div key={key} className="flex items-center gap-1.5">
                <span className="w-7 text-right text-[10px] text-text-secondary">
                  {STAT_LABELS[key]}
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-primary">
                  <div
                    className={`h-full rounded-full ${STAT_BAR_COLORS[key]}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-5 text-right text-[10px] text-text-muted">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </button>
  );
}
