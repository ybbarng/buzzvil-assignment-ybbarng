import { GameButton } from "@/components/ui/game-button";
import { cn } from "@/lib/utils";
import type { BattleCharacter } from "@/types/battle";
import type { SkillType } from "@/types/skill";

const SKILL_TYPE_BORDER: Record<SkillType, string> = {
  attack: "border-l-2 border-damage",
  defend: "border-l-2 border-accent-blue",
  heal: "border-l-2 border-hp",
  buff: "border-l-2 border-buff",
  debuff: "border-l-2 border-debuff",
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
        return (
          <GameButton
            key={skill.name}
            type="button"
            data-testid={`skill-button-${index}`}
            disabled={!canUse}
            variant="blue"
            className={cn(
              "h-auto flex-col gap-0.5 py-2",
              SKILL_TYPE_BORDER[skill.type],
            )}
            onClick={() => onAction(index)}
          >
            <span className="font-semibold">{skill.name}</span>
            {skill.mpCost > 0 && (
              <span className="text-xs text-mp">MP {skill.mpCost}</span>
            )}
          </GameButton>
        );
      })}
    </div>
  );
}
