import { GameButton } from "@/components/ui/game-button";
import type { BattleCharacter } from "@/types/battle";
import type { SkillType } from "@/types/skill";

const SKILL_TYPE_ICON: Record<SkillType, { emoji: string; color: string }> = {
  attack: { emoji: "⚔", color: "text-damage" },
  defend: { emoji: "🛡", color: "text-white" },
  heal: { emoji: "💚", color: "text-hp" },
  buff: { emoji: "⬆", color: "text-buff" },
  debuff: { emoji: "⬇", color: "text-debuff" },
};

interface ActionPanelProps {
  player: BattleCharacter;
  onAction: (skillIndex: number) => void;
}

export function ActionPanel({ player, onAction }: ActionPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {player.skills.map((skill, index) => {
        const canUse = skill.mpCost <= player.currentMp;
        const icon = SKILL_TYPE_ICON[skill.type];
        return (
          <GameButton
            key={skill.name}
            type="button"
            data-testid={`skill-button-${index}`}
            disabled={!canUse}
            variant="blue"
            className="h-auto flex-col gap-0.5 py-2"
            onClick={() => onAction(index)}
          >
            <span className="flex items-center gap-1.5 font-semibold">
              <span className={icon.color}>{icon.emoji}</span>
              {skill.name}
            </span>
            {skill.mpCost > 0 && (
              <span className="text-xs text-mp">MP {skill.mpCost}</span>
            )}
          </GameButton>
        );
      })}
    </div>
  );
}
