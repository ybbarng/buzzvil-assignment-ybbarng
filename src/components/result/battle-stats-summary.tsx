import { STAGGER_MS } from "@/constants/theme";
import { useCountUp } from "@/hooks/use-count-up";
import type { BattleStats } from "@/logic/battle-stats";

interface BattleStatsSummaryProps {
  stats: BattleStats;
  /** 카운트업 애니메이션 시작 전 대기 시간 (ms) */
  baseDelay: number;
}

const STAT_ITEMS: { key: keyof BattleStats; label: string; color: string }[] = [
  { key: "damageDealt", label: "가한 데미지", color: "text-damage" },
  { key: "damageReceived", label: "받은 데미지", color: "text-accent-orange" },
  { key: "healingDone", label: "회복량", color: "text-heal" },
  { key: "skillsUsed", label: "스킬 사용", color: "text-accent-blue" },
];

export function BattleStatsSummary({
  stats,
  baseDelay,
}: BattleStatsSummaryProps) {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-x-6 gap-y-3">
      {STAT_ITEMS.map((item, i) => (
        <StatItem
          key={item.key}
          label={item.label}
          value={stats[item.key]}
          color={item.color}
          delay={baseDelay + i * (STAGGER_MS / 2)}
        />
      ))}
    </div>
  );
}

function StatItem({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  const displayed = useCountUp(value, delay);

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-muted">{label}</span>
      <span className={`text-lg font-bold ${color}`}>{displayed}</span>
    </div>
  );
}
