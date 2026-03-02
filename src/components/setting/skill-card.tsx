import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SKILL_TYPE_COLORS, SKILL_TYPE_ICONS } from "@/constants/skills";
import { SKEW, SKEW_TEXT } from "@/constants/theme";
import type { Skill } from "@/types/skill";

interface SkillCardProps {
  skill: Skill;
  onRemove?: () => void;
}

function getSkillDescription(skill: Skill): string {
  switch (skill.type) {
    case "attack":
      return `ATK × ${skill.multiplier} 데미지`;
    case "defend":
      return "피해 50% 감소";
    case "heal":
      return `HP ${skill.healAmount} 회복`;
    case "buff":
      return `${skill.target.toUpperCase()} +${skill.value} (${skill.duration}턴)`;
    case "debuff":
      return `${skill.target.toUpperCase()} -${skill.value} (${skill.duration}턴)`;
  }
}

export function SkillCard({ skill, onRemove }: SkillCardProps) {
  return (
    <div
      className={`${SKEW} flex items-center justify-between border-l-2 ${SKILL_TYPE_COLORS[skill.type].border} bg-bg-tertiary px-4 py-3`}
    >
      <div className={`${SKEW_TEXT} space-y-0.5`}>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary">{skill.name}</span>
          {(() => {
            const Icon = SKILL_TYPE_ICONS[skill.type];
            return (
              <Icon
                className={`size-4 ${SKILL_TYPE_COLORS[skill.type].text}`}
              />
            );
          })()}
          {skill.mpCost > 0 && (
            <span className="text-xs text-mp">MP {skill.mpCost}</span>
          )}
        </div>
        <p className="text-sm text-text-secondary">
          {getSkillDescription(skill)}
        </p>
      </div>
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          data-testid="remove-skill-button"
          className={`${SKEW_TEXT} size-8 text-text-muted hover:text-damage`}
          onClick={onRemove}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}
