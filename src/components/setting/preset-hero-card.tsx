import { useEffect, useState } from "react";
import { STAT_COLORS, STAT_LABELS, STAT_RANGES } from "@/constants/stats";
import type { StatKey } from "@/types/character";
import type { HeroPreset } from "@/types/preset";

export function PresetHeroDetail({ hero }: { hero: HeroPreset }) {
  // 최초 마운트 시 스탯 바를 0%→실제값으로 애니메이션하기 위해
  // rAF로 한 프레임 지연 후 mounted를 true로 전환한다.
  // 이후 영웅 전환 시에는 컴포넌트가 유지되므로 CSS transition이 이전값→새값을 처리한다.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      {(Object.keys(hero.stats) as StatKey[]).map((key) => {
        const value = hero.stats[key];
        const range = STAT_RANGES[key];
        const percent = ((value - range.min) / (range.max - range.min)) * 100;
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="w-7 text-right text-[11px] font-medium text-text-secondary">
              {STAT_LABELS[key].en}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg-primary">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${STAT_COLORS[key].bg}`}
                style={{ width: mounted ? `${percent}%` : "0%" }}
              />
            </div>
            <span className="w-6 text-right text-[11px] tabular-nums text-text-muted">
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
