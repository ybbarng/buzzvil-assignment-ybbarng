import { SKILL_TYPE_LABELS } from "@/constants/skills";
import type { Skill } from "@/types/skill";

interface SkillCardProps {
  skill: Skill;
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

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-bg-tertiary px-4 py-3">
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-primary">{skill.name}</span>
          <span className="rounded bg-bg-secondary px-1.5 py-0.5 text-xs text-text-muted">
            {SKILL_TYPE_LABELS[skill.type]}
          </span>
          {skill.mpCost > 0 && (
            <span className="text-xs text-mp">MP {skill.mpCost}</span>
          )}
        </div>
        <p className="text-sm text-text-secondary">
          {getSkillDescription(skill)}
        </p>
      </div>
    </div>
  );
}
