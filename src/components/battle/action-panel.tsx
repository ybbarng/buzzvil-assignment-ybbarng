import { GameButton } from "@/components/ui/game-button";
import { SKILL_TYPE_COLORS, SKILL_TYPE_ICONS } from "@/constants/skills";
import type { BattleCharacter } from "@/types/battle";

interface ActionPanelProps {
  player: BattleCharacter;
  onAction: (skillIndex: number) => void;
}

export function ActionPanel({ player, onAction }: ActionPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {player.skills.map((skill, index) => {
        const canUse = skill.mpCost <= player.currentMp;
        const Icon = SKILL_TYPE_ICONS[skill.type];
        const color = SKILL_TYPE_COLORS[skill.type].text;
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
              <Icon className={`size-4 ${color}`} />
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
