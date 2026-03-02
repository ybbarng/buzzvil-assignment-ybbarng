import { GameButton } from "@/components/ui/game-button";
import { cn } from "@/lib/utils";
import { useBattleStore } from "@/stores/battle-store";
import { useGameStore } from "@/stores/game-store";
import { useSettingStore } from "@/stores/setting-store";
import type { BattleOutcome } from "@/types/game";

const OUTCOME_LABELS: Record<BattleOutcome, string> = {
  win: "승리",
  lose: "패배",
  draw: "무승부",
};

const OUTCOME_COLORS: Record<BattleOutcome, string> = {
  win: "text-accent-blue",
  lose: "text-damage",
  draw: "text-accent-orange",
};

export function ResultScreen() {
  const outcome = useGameStore((s) => s.outcome);
  const totalTurns = useGameStore((s) => s.totalTurns);
  const restart = useGameStore((s) => s.restart);

  const handleRestart = () => {
    useBattleStore.getState().reset();
    useSettingStore.getState().reset();
    restart();
  };

  return (
    <div className="animate-slide-in-bottom flex flex-col items-center gap-6 py-8">
      <h2
        data-testid="result-title"
        className={cn(
          "text-4xl font-bold",
          outcome ? OUTCOME_COLORS[outcome] : "text-accent-orange",
        )}
      >
        {outcome ? OUTCOME_LABELS[outcome] : ""}
      </h2>

      <p data-testid="result-turns" className="text-lg text-text-secondary">
        {totalTurns}턴 만에 전투 종료
      </p>

      <GameButton
        type="button"
        data-testid="restart-button"
        variant="orange"
        active
        skew
        className="mt-4 px-10 py-3 text-lg"
        onClick={handleRestart}
      >
        다시 시작
      </GameButton>
    </div>
  );
}
