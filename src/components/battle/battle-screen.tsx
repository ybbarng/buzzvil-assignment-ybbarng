import { useEffect, useRef } from "react";
import { ActionPanel } from "@/components/battle/action-panel";
import { BattleLog } from "@/components/battle/battle-log";
import { CharacterPanel } from "@/components/battle/character-panel";
import { useBattleStore } from "@/stores/battle-store";
import { useSettingStore } from "@/stores/setting-store";

export function BattleScreen() {
  const player = useBattleStore((s) => s.player);
  const enemy = useBattleStore((s) => s.enemy);
  const round = useBattleStore((s) => s.round);
  const outcome = useBattleStore((s) => s.outcome);
  const initBattle = useBattleStore((s) => s.initBattle);
  const logs = useBattleStore((s) => s.logs);
  const executePlayerAction = useBattleStore((s) => s.executePlayerAction);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const { name, stats, skills, difficulty } = useSettingStore.getState();
    initBattle(name, stats, skills, difficulty);
  }, [initBattle]);

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

      {!outcome && (
        <ActionPanel player={player} onAction={executePlayerAction} />
      )}

      <BattleLog logs={logs} />
    </div>
  );
}
