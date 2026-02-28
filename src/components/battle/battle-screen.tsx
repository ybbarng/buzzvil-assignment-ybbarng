import { useEffect, useRef } from "react";
import { ActionPanel } from "@/components/battle/action-panel";
import { BattleLog } from "@/components/battle/battle-log";
import { CharacterPanel } from "@/components/battle/character-panel";
import { Button } from "@/components/ui/button";
import { useBattleStore } from "@/stores/battle-store";
import { useGameStore } from "@/stores/game-store";
import { useSettingStore } from "@/stores/setting-store";

export function BattleScreen() {
  const player = useBattleStore((s) => s.player);
  const enemy = useBattleStore((s) => s.enemy);
  const round = useBattleStore((s) => s.round);
  const outcome = useBattleStore((s) => s.outcome);
  const initBattle = useBattleStore((s) => s.initBattle);
  const logs = useBattleStore((s) => s.logs);
  const executePlayerAction = useBattleStore((s) => s.executePlayerAction);

  const showResult = useGameStore((s) => s.showResult);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const { name, stats, skills, difficulty } = useSettingStore.getState();
    initBattle(name, stats, skills, difficulty);
  }, [initBattle]);

  if (!player || !enemy) return null;

  const handleShowResult = () => {
    if (outcome) {
      showResult(outcome, round - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div
        data-testid="round-display"
        className="text-center text-lg font-bold text-accent-orange"
      >
        라운드 {outcome ? round - 1 : round}
      </div>

      {outcome && (
        <div className="text-center">
          <p className="text-xl font-bold text-accent-orange">
            {outcome === "win"
              ? "승리!"
              : outcome === "lose"
                ? "패배..."
                : "무승부"}
          </p>
          <Button
            type="button"
            className="mt-2 bg-accent-orange font-bold text-bg-primary hover:bg-accent-orange-hover"
            onClick={handleShowResult}
          >
            결과 확인
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <CharacterPanel
          character={player}
          testId="player-panel"
          nameTestId="player-name"
        />
        <CharacterPanel
          character={enemy}
          testId="enemy-panel"
          nameTestId="enemy-name"
        />
      </div>

      {!outcome && (
        <ActionPanel player={player} onAction={executePlayerAction} />
      )}

      <BattleLog logs={logs} />
    </div>
  );
}
