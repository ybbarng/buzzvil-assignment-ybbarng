import { useMemo, useState } from "react";
import { ReplayListDialog } from "@/components/replay/replay-list-dialog";
import { BattleStatsSummary } from "@/components/result/battle-stats-summary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GameButton } from "@/components/ui/game-button";
import { staggerDelay } from "@/constants/theme";
import { cn } from "@/lib/utils";
import { computeBattleStats } from "@/logic/battle-stats";
import { useBattleStore } from "@/stores/battle-store";
import { useGameStore } from "@/stores/game-store";
import { useReplayStore } from "@/stores/replay-store";
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
  const phase = useGameStore((s) => s.phase);
  const outcome = useGameStore((s) => s.outcome);
  const totalTurns = useGameStore((s) => s.totalTurns);
  const restart = useGameStore((s) => s.restart);

  const player = useBattleStore((s) => s.player);
  const enemy = useBattleStore((s) => s.enemy);
  const events = useBattleStore((s) => s.events);

  const replays = useReplayStore((s) => s.replays);

  const [statsOpen, setStatsOpen] = useState(false);
  const [replayOpen, setReplayOpen] = useState(false);

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
  const buttonIdx = idx++;
  const analysisIdx = hasBattleData ? idx++ : -1;
  const replayIdx = replays.length > 0 ? idx++ : -1;

  return (
    <div
      className="flex flex-col items-center gap-6 py-8"
      aria-live="assertive"
    >
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
          새 게임
        </GameButton>
      </div>

      {/* 전투 분석 버튼 */}
      {hasBattleData && (
        <div
          className="animate-slide-in-right"
          style={staggerDelay(analysisIdx)}
        >
          <GameButton
            type="button"
            variant="blue"
            skew
            onClick={() => setStatsOpen(true)}
          >
            전투 분석
          </GameButton>
        </div>
      )}

      {/* 다시보기 버튼 */}
      {replays.length > 0 && (
        <div className="animate-slide-in-right" style={staggerDelay(replayIdx)}>
          <GameButton
            type="button"
            variant="blue"
            skew
            onClick={() => setReplayOpen(true)}
          >
            다시보기
          </GameButton>
        </div>
      )}

      {/* 전투 분석 모달 */}
      {hasBattleData && playerStats && enemyStats && (
        <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
          <DialogContent
            className="border-border bg-bg-secondary"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle className="text-center text-text-primary">
                전투 분석
              </DialogTitle>
            </DialogHeader>
            <BattleStatsSummary
              player={player}
              enemy={enemy}
              playerStats={playerStats}
              enemyStats={enemyStats}
              baseDelay={0}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* 리플레이 목록 모달 */}
      {(phase === "result" || phase === "replay-result") && (
        <ReplayListDialog open={replayOpen} onOpenChange={setReplayOpen} />
      )}
    </div>
  );
}
