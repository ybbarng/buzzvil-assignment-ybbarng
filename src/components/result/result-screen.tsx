import { useMemo } from "react";
import { BattleStatsSummary } from "@/components/result/battle-stats-summary";
import { GameButton } from "@/components/ui/game-button";
import { STAGGER_MS, staggerDelay } from "@/constants/theme";
import { cn } from "@/lib/utils";
import { computeBattleStats } from "@/logic/battle-stats";
import { useBattleStore } from "@/stores/battle-store";
import { useGameStore } from "@/stores/game-store";
import { useSettingStore } from "@/stores/setting-store";
import type { BattleOutcome } from "@/types/game";

const OUTCOME_LABELS: Record<BattleOutcome, string> = {
  win: "승리!",
  lose: "패배",
  draw: "무승부",
};

const OUTCOME_STYLES: Record<BattleOutcome, string> = {
  win: "text-accent-orange animate-result-glow-win",
  lose: "text-damage animate-result-glow-lose",
  draw: "text-accent-blue",
};

export function ResultScreen() {
  const outcome = useGameStore((s) => s.outcome);
  const totalTurns = useGameStore((s) => s.totalTurns);
  const restart = useGameStore((s) => s.restart);

  const player = useBattleStore((s) => s.player);
  const enemy = useBattleStore((s) => s.enemy);
  const events = useBattleStore((s) => s.events);

  const handleRestart = () => {
    useBattleStore.getState().reset();
    useSettingStore.getState().reset();
    restart();
  };

  const hasBattleData = player !== null && enemy !== null;
  const playerStats = useMemo(
    () => (hasBattleData ? computeBattleStats(events, player.name) : null),
    [hasBattleData, events, player?.name],
  );
  const enemyStats = useMemo(
    () => (hasBattleData ? computeBattleStats(events, enemy.name) : null),
    [hasBattleData, events, enemy?.name],
  );

  // 순차 등장 인덱스 계산
  let idx = 0;
  const titleIdx = idx++;
  const turnsIdx = idx++;
  const statsIdx = hasBattleData ? idx++ : -1;
  const buttonIdx = idx++;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* 결과 텍스트: scale-in(래퍼)과 glow(h2) 분리 — 같은 요소에 두면 animation 충돌 */}
      <div className="animate-result-scale-in" style={staggerDelay(titleIdx)}>
        <h2
          data-testid="result-title"
          className={cn(
            "text-7xl font-bold",
            outcome ? OUTCOME_STYLES[outcome] : "text-accent-orange",
          )}
        >
          {outcome ? OUTCOME_LABELS[outcome] : ""}
        </h2>
      </div>

      {/* 턴 수 */}
      <p
        data-testid="result-turns"
        className="animate-slide-in-right text-lg text-text-secondary"
        style={staggerDelay(turnsIdx)}
      >
        {totalTurns}턴 만에 전투 종료
      </p>

      {/* 전투 통계 (HP/MP + 데미지/회복/스킬) */}
      {hasBattleData && playerStats && enemyStats && (
        <div
          className="animate-slide-in-right flex w-full justify-center"
          style={staggerDelay(statsIdx)}
        >
          <BattleStatsSummary
            player={player}
            enemy={enemy}
            playerStats={playerStats}
            enemyStats={enemyStats}
            baseDelay={statsIdx * STAGGER_MS}
          />
        </div>
      )}

      {/* 다시 시작 버튼 */}
      <div
        className="animate-slide-in-right mt-2"
        style={staggerDelay(buttonIdx)}
      >
        <GameButton
          type="button"
          data-testid="restart-button"
          active
          skew
          onClick={handleRestart}
        >
          다시 시작
        </GameButton>
      </div>
    </div>
  );
}
