import { HpBar } from "@/components/battle/hp-bar";
import { cn } from "@/lib/utils";
import type { ActiveBuff, BattleCharacter } from "@/types/battle";

interface CharacterPanelProps {
  character: BattleCharacter;
  testId: string;
  nameTestId: string;
}

function BuffIndicator({ buff }: { buff: ActiveBuff }) {
  const isBuff = buff.value > 0;
  const label = `${buff.target.toUpperCase()} ${isBuff ? "+" : ""}${buff.value}`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium",
        isBuff
          ? "bg-accent-orange/20 text-accent-orange"
          : "bg-damage/20 text-damage",
      )}
    >
      {label}
      <span className="text-text-muted">({buff.remainingTurns}턴)</span>
    </span>
  );
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
          {character.buffs.map((buff, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: buffs are ordered and index is stable within render
            <BuffIndicator key={index} buff={buff} />
          ))}
        </div>
      )}
    </div>
  );
}
