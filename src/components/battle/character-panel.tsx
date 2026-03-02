import { HpBar } from "@/components/battle/hp-bar";
import { cn } from "@/lib/utils";
import { getEffectiveStat } from "@/logic/buff";
import type {
  ActiveBuff,
  BattleCharacter,
  CharacterSnapshot,
} from "@/types/battle";

interface CharacterPanelProps {
  character: BattleCharacter;
  snapshot?: CharacterSnapshot | null;
  testId: string;
  nameTestId: string;
  side: "player" | "enemy";
  isActive?: boolean;
}

function StatLabel({
  label,
  value,
  base,
}: {
  label: string;
  value: number;
  base: number;
}) {
  const color =
    value > base
      ? "text-buff"
      : value < base
        ? "text-debuff"
        : "text-text-secondary";

  return (
    <span>
      {label} <span className={color}>{value}</span>
    </span>
  );
}

function BuffIndicator({ buff }: { buff: ActiveBuff }) {
  const isBuff = buff.value > 0;
  const label = `${buff.target.toUpperCase()} ${isBuff ? "+" : ""}${buff.value}`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium",
        isBuff ? "bg-buff/20 text-buff" : "bg-debuff/20 text-debuff",
      )}
    >
      {label}
      <span className="text-text-muted">({buff.remainingTurns}턴)</span>
    </span>
  );
}

export function CharacterPanel({
  character,
  snapshot,
  testId,
  nameTestId,
  side,
  isActive = false,
}: CharacterPanelProps) {
  const isPlayer = side === "player";

  // 스냅샷이 있으면 display용 값 사용, 없으면 character 직접 사용
  const displayHp = snapshot?.currentHp ?? character.currentHp;
  const displayMp = snapshot?.currentMp ?? character.currentMp;
  const displayBuffs = snapshot?.buffs ?? character.buffs;

  const source = snapshot ?? character;
  const effectiveAtk = getEffectiveStat(source, "atk");
  const effectiveDef = getEffectiveStat(source, "def");
  const baseSpd = source.baseStats.spd;

  return (
    <div
      data-testid={testId}
      className={cn(
        "border-l-2 bg-bg-secondary p-4 transition-shadow duration-300",
        isPlayer ? "border-accent-blue" : "border-damage",
        isActive &&
          (isPlayer ? "animate-active-glow-blue" : "animate-active-glow-red"),
      )}
    >
      <h3
        data-testid={nameTestId}
        className={cn(
          "mb-3 text-lg font-bold",
          isPlayer ? "text-accent-blue" : "text-damage",
        )}
      >
        {character.name}
      </h3>
      <div className="space-y-2">
        <HpBar current={displayHp} max={character.baseStats.hp} type="hp" />
        <HpBar current={displayMp} max={character.baseStats.mp} type="mp" />
      </div>
      <div className="mt-2 flex gap-3 text-xs text-text-secondary">
        <StatLabel
          label="ATK"
          value={effectiveAtk}
          base={source.baseStats.atk}
        />
        <StatLabel
          label="DEF"
          value={effectiveDef}
          base={source.baseStats.def}
        />
        <StatLabel label="SPD" value={baseSpd} base={baseSpd} />
      </div>
      <div className="mt-2 flex min-h-6 flex-wrap gap-1">
        {displayBuffs.map((buff, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: buffs are ordered and index is stable within render
          <BuffIndicator key={index} buff={buff} />
        ))}
      </div>
    </div>
  );
}
