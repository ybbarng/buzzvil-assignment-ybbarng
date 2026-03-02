import { HpBar } from "@/components/battle/hp-bar";
import type { BattleCharacter } from "@/types/battle";

interface FinalStatusComparisonProps {
  player: BattleCharacter;
  enemy: BattleCharacter;
}

export function FinalStatusComparison({
  player,
  enemy,
}: FinalStatusComparisonProps) {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-6">
      <CharacterStatus label={player.name} character={player} />
      <CharacterStatus label={enemy.name} character={enemy} />
    </div>
  );
}

function CharacterStatus({
  label,
  character,
}: {
  label: string;
  character: BattleCharacter;
}) {
  return (
    <div className="space-y-2">
      <p className="text-center text-sm font-bold text-text-secondary">
        {label}
      </p>
      <HpBar
        current={Math.max(0, character.currentHp)}
        max={character.baseStats.hp}
        type="hp"
      />
      <HpBar
        current={Math.max(0, character.currentMp)}
        max={character.baseStats.mp}
        type="mp"
      />
    </div>
  );
}
