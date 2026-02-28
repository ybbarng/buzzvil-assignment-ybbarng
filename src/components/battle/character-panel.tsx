import { HpBar } from "@/components/battle/hp-bar";
import type { BattleCharacter } from "@/types/battle";

interface CharacterPanelProps {
  character: BattleCharacter;
  testId: string;
  nameTestId: string;
}

export function CharacterPanel({
  character,
  testId,
  nameTestId,
}: CharacterPanelProps) {
  return (
    <div
      data-testid={testId}
      className="rounded-lg border border-border bg-bg-secondary p-4"
    >
      <h3
        data-testid={nameTestId}
        className="mb-3 text-lg font-bold text-text-primary"
      >
        {character.name}
      </h3>
      <div className="space-y-2">
        <HpBar
          current={character.currentHp}
          max={character.baseStats.hp}
          type="hp"
        />
        <HpBar
          current={character.currentMp}
          max={character.baseStats.mp}
          type="mp"
        />
      </div>
    </div>
  );
}
