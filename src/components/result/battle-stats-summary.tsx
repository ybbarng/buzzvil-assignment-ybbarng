import { STAGGER_MS } from "@/constants/theme";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";
import type { BattleStats } from "@/logic/battle-stats";

interface BattleStatsSummaryProps {
  playerName: string;
  playerStats: BattleStats;
  enemyName: string;
  enemyStats: BattleStats;
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
  playerName,
  playerStats,
  enemyName,
  enemyStats,
  baseDelay,
}: BattleStatsSummaryProps) {
  return (
    <div className="w-full max-w-md space-y-3">
      {/* 이름 헤더 */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <span className="text-right text-sm font-bold text-text-secondary">
          {playerName}
        </span>
        <span className="text-xs text-text-muted">VS</span>
        <span className="text-left text-sm font-bold text-text-secondary">
          {enemyName}
        </span>
      </div>

      {/* 통계 행 */}
      {STAT_ITEMS.map((item, i) => (
        <StatRow
          key={item.key}
          label={item.label}
          playerValue={playerStats[item.key]}
          enemyValue={enemyStats[item.key]}
          color={item.color}
          delay={baseDelay + i * (STAGGER_MS / 2)}
        />
      ))}
    </div>
  );
}

function StatRow({
  label,
  playerValue,
  enemyValue,
  color,
  delay,
}: {
  label: string;
  playerValue: number;
  enemyValue: number;
  color: string;
  delay: number;
}) {
  const displayedPlayer = useCountUp(playerValue, delay);
  const displayedEnemy = useCountUp(enemyValue, delay);

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <span className={cn("text-right text-lg font-bold", color)}>
        {displayedPlayer}
      </span>
      <span className="text-xs text-text-muted">{label}</span>
      <span className={cn("text-left text-lg font-bold", color)}>
        {displayedEnemy}
      </span>
    </div>
  );
}
