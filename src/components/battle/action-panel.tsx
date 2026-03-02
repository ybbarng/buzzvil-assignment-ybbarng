import { GameButton } from "@/components/ui/game-button";
import { SKILL_TYPE_ICONS } from "@/constants/skills";
import type { BattleCharacter } from "@/types/battle";
import type { SkillType } from "@/types/skill";

/** 아이콘 색상 (배경은 공통 흰색 원) */
const SKILL_ICON_COLOR: Record<SkillType, string> = {
  attack: "text-damage",
  defend: "text-accent-blue",
  heal: "text-heal",
  buff: "text-buff",
  debuff: "text-debuff",
};

interface ActionPanelProps {
  player: BattleCharacter;
  onAction: (skillIndex: number) => void;
  disabled?: boolean;
}

export function ActionPanel({ player, onAction, disabled }: ActionPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {player.skills.map((skill, index) => {
        const canUse = !disabled && skill.mpCost <= player.currentMp;
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
            <span className="flex items-center justify-center gap-1.5 font-semibold">
              {skill.name}
              <span
                className={`inline-flex items-center justify-center rounded-full bg-white p-0.5 ${SKILL_ICON_COLOR[skill.type]}`}
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
