import { useEffect } from "react";
import { ActionPanel } from "@/components/battle/action-panel";
import { BattleLog } from "@/components/battle/battle-log";
import { CharacterPanel } from "@/components/battle/character-panel";
import { useBattleStore } from "@/stores/battle-store";
import { useGameStore } from "@/stores/game-store";
import { useSettingStore } from "@/stores/setting-store";

export function BattleScreen() {
  const player = useBattleStore((s) => s.player);
  const enemy = useBattleStore((s) => s.enemy);
  const round = useBattleStore((s) => s.round);
  const logs = useBattleStore((s) => s.logs);
  const outcome = useBattleStore((s) => s.outcome);
  const initBattle = useBattleStore((s) => s.initBattle);
  const executePlayerAction = useBattleStore((s) => s.executePlayerAction);

  const name = useSettingStore((s) => s.name);
  const stats = useSettingStore((s) => s.stats);
  const skills = useSettingStore((s) => s.skills);
  const difficulty = useSettingStore((s) => s.difficulty);

  const showResult = useGameStore((s) => s.showResult);

  useEffect(() => {
    initBattle(name, stats, skills, difficulty);
  }, [name, stats, skills, difficulty, initBattle]);

  useEffect(() => {
    if (outcome) {
      showResult(outcome, round - 1);
    }
  }, [outcome, round, showResult]);

  if (!player || !enemy) return null;

  return (
    <div className="space-y-4">
      <div
        data-testid="round-display"
        className="text-center text-lg font-bold text-accent-orange"
      >
        라운드 {round}
      </div>

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

      <ActionPanel
        player={player}
        onAction={executePlayerAction}
        disabled={outcome !== null}
      />

      <BattleLog logs={logs} />
    </div>
  );
}
