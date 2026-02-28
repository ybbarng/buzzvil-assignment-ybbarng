import { Button } from "@/components/ui/button";
import { useBattleStore } from "@/stores/battle-store";
import { useGameStore } from "@/stores/game-store";
import { useSettingStore } from "@/stores/setting-store";

const outcomeLabels: Record<string, string> = {
  win: "승리",
  lose: "패배",
  draw: "무승부",
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
    <div className="flex flex-col items-center gap-6 py-8">
      <h2
        data-testid="result-title"
        className="text-4xl font-bold text-accent-orange"
      >
        {outcome ? outcomeLabels[outcome] : ""}
      </h2>

      <p data-testid="result-turns" className="text-lg text-text-secondary">
        {totalTurns}턴 만에 전투 종료
      </p>

      <Button
        type="button"
        data-testid="restart-button"
        className="mt-4 bg-accent-orange px-8 py-3 text-lg font-bold text-bg-primary hover:bg-accent-orange-hover"
        onClick={handleRestart}
      >
        다시 시작
      </Button>
    </div>
  );
}
