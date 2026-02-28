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
      {character.buffs.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {character.buffs.map((buff, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: buffs are ordered and index is stable
              key={i}
              className={`rounded px-1.5 py-0.5 text-xs ${
                buff.isDebuff
                  ? "bg-debuff/20 text-debuff"
                  : "bg-buff/20 text-buff"
              }`}
            >
              {buff.target.toUpperCase()} {buff.isDebuff ? "-" : "+"}
              {buff.value} ({buff.remainingTurns}턴)
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
