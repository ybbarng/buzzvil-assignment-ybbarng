import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SKILL_TYPE_COLORS, SKILL_TYPE_ICONS } from "@/constants/skills";
import { STAT_LABELS } from "@/constants/stats";
import { SKEW, SKEW_TEXT } from "@/constants/theme";
import type { Skill } from "@/types/skill";

interface SkillCardProps {
  skill: Skill;
  onRemove?: () => void;
}

function getSkillDescription(skill: Skill): string {
  switch (skill.type) {
    case "attack":
      return `대미지: 공격력(ATK) × ${skill.multiplier}`;
    case "defend":
      return "받는 피해 50% 감소";
    case "heal":
      return `체력(HP) ${skill.healAmount} 회복`;
    case "buff": {
      const { ko, en } = STAT_LABELS[skill.target];
      return `${skill.duration}턴 동안 ${ko}(${en}) +${skill.value}`;
    }
    case "debuff": {
      const { ko, en } = STAT_LABELS[skill.target];
      return `${skill.duration}턴 동안 ${ko}(${en}) -${skill.value}`;
    }
  }
}

export function SkillCard({ skill, onRemove }: SkillCardProps) {
  const TypeIcon = SKILL_TYPE_ICONS[skill.type];

  return (
    <div
      className={`${SKEW} flex items-center justify-between border-l-2 ${SKILL_TYPE_COLORS[skill.type].border} bg-bg-tertiary px-4 py-3 animate-fade-in transition-colors hover:bg-bg-tertiary/80`}
    >
      <div className={`${SKEW_TEXT} space-y-0.5`}>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary">{skill.name}</span>
          <TypeIcon
            className={`size-4 ${SKILL_TYPE_COLORS[skill.type].text}`}
          />
          {skill.mpCost > 0 && (
            <span className="text-xs text-mp">
              마나(MP) {skill.mpCost} 소모
            </span>
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
