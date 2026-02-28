import { Dices, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  STAT_KEYS,
  STAT_LABELS,
  STAT_RANGES,
  TOTAL_POINTS,
} from "@/constants/stats";
import { cn } from "@/lib/utils";
import {
  clearStat,
  distributeRandomToStat,
  distributeRemainingStats,
} from "@/logic/random-stats";
import type { StatKey, Stats } from "@/types/character";

interface StatAllocatorProps {
  stats: Stats;
  onChange: (stats: Stats) => void;
}

export function StatAllocator({ stats, onChange }: StatAllocatorProps) {
  const totalUsed = Object.values(stats).reduce((a, b) => a + b, 0);
  const remaining = TOTAL_POINTS - totalUsed;

  const handleStatChange = (key: StatKey, value: number) => {
    const { min, max } = STAT_RANGES[key];
    const clamped = Math.max(min, Math.min(max, value));

    const otherTotal = totalUsed - stats[key];
    const maxAllowed = Math.min(clamped, TOTAL_POINTS - otherTotal);
    const finalValue = Math.max(min, maxAllowed);

    onChange({ ...stats, [key]: finalValue });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">잔여 포인트</span>
        <div className="flex items-center gap-2">
          <span
            data-testid="remaining-points"
            className={cn(
              "text-lg font-bold",
              remaining === 0
                ? "text-hp"
                : remaining > 0
                  ? "text-accent-orange"
                  : "text-damage",
            )}
          >
            {remaining}
          </span>
          <Button
            variant="outline"
            size="xs"
            type="button"
            onClick={() => onChange(distributeRemainingStats(stats))}
          >
            <Dices />
            랜덤 배분하기
          </Button>
        </div>
      </div>

      {STAT_KEYS.map((key) => {
        const { min, max } = STAT_RANGES[key];
        return (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <label
                  htmlFor={`stat-${key}`}
                  className="text-sm font-medium text-text-primary"
                >
                  {STAT_LABELS[key]}
                </label>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  type="button"
                  title={`${STAT_LABELS[key]} 랜덤 배분`}
                  disabled={remaining === 0 && stats[key] >= max}
                  onClick={() => onChange(distributeRandomToStat(stats, key))}
                >
                  <Dices />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  type="button"
                  title={`${STAT_LABELS[key]} 초기화`}
                  disabled={stats[key] <= min}
                  onClick={() => onChange(clearStat(stats, key))}
                >
                  <X />
                </Button>
              </div>
              <input
                id={`stat-${key}`}
                data-testid={`stat-${key}`}
                type="number"
                min={min}
                max={max}
                value={stats[key]}
                onChange={(e) => {
                  const v = Number.parseInt(e.target.value, 10);
                  if (!Number.isNaN(v)) {
                    handleStatChange(key, v);
                  }
                }}
                className="w-16 rounded border border-border bg-bg-tertiary px-2 py-1 text-center text-sm text-text-primary outline-none focus:border-accent-orange"
              />
            </div>
            <Slider
              min={min}
              max={max}
              value={[stats[key]]}
              onValueChange={([v]) => handleStatChange(key, v)}
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>{min}</span>
              <span>{max}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
