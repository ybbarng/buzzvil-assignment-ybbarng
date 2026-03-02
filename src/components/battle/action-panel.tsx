import { GameButton } from "@/components/ui/game-button";
import { SKILL_TYPE_ICONS } from "@/constants/skills";
import type { BattleCharacter } from "@/types/battle";
import type { SkillType } from "@/types/skill";

/** 아이콘 배지에 사용할 배경 + 아이콘 색상 */
const SKILL_ICON_STYLE: Record<SkillType, string> = {
  attack: "bg-damage/20 text-damage",
  defend: "bg-accent-blue/20 text-accent-blue",
  heal: "bg-heal/20 text-heal",
  buff: "bg-buff/20 text-buff",
  debuff: "bg-debuff/20 text-debuff",
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
        const Icon = SKILL_TYPE_ICONS[skill.type];
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
              {skill.name}
              <span
                className={`inline-flex items-center justify-center rounded p-0.5 ${SKILL_ICON_STYLE[skill.type]}`}
              >
                <Icon className="size-3.5" />
              </span>
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
