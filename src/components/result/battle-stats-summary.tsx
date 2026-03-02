import { useMemo } from "react";
import { STAGGER_MS } from "@/constants/theme";
import { useCountUpProgress } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";
import type { BattleStats } from "@/logic/battle-stats";
import type { BattleCharacter } from "@/types/battle";

interface BattleStatsSummaryProps {
  player: BattleCharacter;
  enemy: BattleCharacter;
  playerStats: BattleStats;
  enemyStats: BattleStats;
  /** 카운트업 애니메이션 시작 전 대기 시간 (ms) */
  baseDelay: number;
}

interface RowConfig {
  label: string;
  playerValue: number;
  enemyValue: number;
  playerPct: number;
  enemyPct: number;
  barColor: string;
}

function buildRows(
  player: BattleCharacter,
  enemy: BattleCharacter,
  playerStats: BattleStats,
  enemyStats: BattleStats,
): RowConfig[] {
  const relativePct = (a: number, b: number) => {
    const max = Math.max(a, b);
    return max === 0 ? 0 : (a / max) * 100;
  };

  return [
    {
      label: "남은 체력",
      playerValue: Math.max(0, player.currentHp),
      enemyValue: Math.max(0, enemy.currentHp),
      playerPct: (Math.max(0, player.currentHp) / player.baseStats.hp) * 100,
      enemyPct: (Math.max(0, enemy.currentHp) / enemy.baseStats.hp) * 100,
      barColor: "bg-hp",
    },
    {
      label: "남은 마나",
      playerValue: Math.max(0, player.currentMp),
      enemyValue: Math.max(0, enemy.currentMp),
      playerPct: (Math.max(0, player.currentMp) / player.baseStats.mp) * 100,
      enemyPct: (Math.max(0, enemy.currentMp) / enemy.baseStats.mp) * 100,
      barColor: "bg-mp",
    },
    {
      label: "가한 데미지",
      playerValue: playerStats.damageDealt,
      enemyValue: enemyStats.damageDealt,
      playerPct: relativePct(playerStats.damageDealt, enemyStats.damageDealt),
      enemyPct: relativePct(enemyStats.damageDealt, playerStats.damageDealt),
      barColor: "bg-damage",
    },
    {
      label: "받은 데미지",
      playerValue: playerStats.damageReceived,
      enemyValue: enemyStats.damageReceived,
      playerPct: relativePct(
        playerStats.damageReceived,
        enemyStats.damageReceived,
      ),
      enemyPct: relativePct(
        enemyStats.damageReceived,
        playerStats.damageReceived,
      ),
      barColor: "bg-accent-orange",
    },
    {
      label: "회복량",
      playerValue: playerStats.healingDone,
      enemyValue: enemyStats.healingDone,
      playerPct: relativePct(playerStats.healingDone, enemyStats.healingDone),
      enemyPct: relativePct(enemyStats.healingDone, playerStats.healingDone),
      barColor: "bg-heal",
    },
    {
      label: "스킬 사용",
      playerValue: playerStats.skillsUsed,
      enemyValue: enemyStats.skillsUsed,
      playerPct: relativePct(playerStats.skillsUsed, enemyStats.skillsUsed),
      enemyPct: relativePct(enemyStats.skillsUsed, playerStats.skillsUsed),
      barColor: "bg-accent-blue",
    },
  ];
}

export function BattleStatsSummary({
  player,
  enemy,
  playerStats,
  enemyStats,
  baseDelay,
}: BattleStatsSummaryProps) {
  const rows = useMemo(
    () => buildRows(player, enemy, playerStats, enemyStats),
    [player, enemy, playerStats, enemyStats],
  );

  return (
    <div className="w-full max-w-lg space-y-3">
      {/* 이름 헤더 */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-1">
        <span className="text-right text-sm font-bold text-text-secondary">
          {player.name}
        </span>
        <span className="text-xs font-bold text-text-muted">VS</span>
        <span className="text-left text-sm font-bold text-text-secondary">
          {enemy.name}
        </span>
      </div>

      {/* 통계 행 */}
      {rows.map((row, i) => (
        <StatBar
          key={row.label}
          {...row}
          delay={baseDelay + i * (STAGGER_MS / 2)}
        />
      ))}
    </div>
  );
}

function StatBar({
  label,
  playerValue,
  enemyValue,
  playerPct,
  enemyPct,
  barColor,
  delay,
}: RowConfig & { delay: number }) {
  const progress = useCountUpProgress(delay);

  const displayedPlayer = Math.round(progress * playerValue);
  const displayedEnemy = Math.round(progress * enemyValue);
  const playerBarPct = progress * playerPct;
  const enemyBarPct = progress * enemyPct;

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <span className="text-right text-sm font-bold text-text-primary">
          {displayedPlayer}
        </span>
        <span className="text-xs text-text-muted">{label}</span>
        <span className="text-left text-sm font-bold text-text-primary">
          {displayedEnemy}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {/* 플레이어 바: 오른쪽에서 왼쪽으로 채워짐 */}
        <div className="flex justify-end">
          <div className="h-2 w-full overflow-hidden rounded-l bg-bg-tertiary">
            <div
              className={cn("ml-auto h-full rounded-l", barColor)}
              style={{ width: `${playerBarPct}%` }}
            />
          </div>
        </div>
        {/* 적 바: 왼쪽에서 오른쪽으로 채워짐 */}
        <div className="h-2 w-full overflow-hidden rounded-r bg-bg-tertiary">
          <div
            className={cn("h-full rounded-r", barColor)}
            style={{ width: `${enemyBarPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
