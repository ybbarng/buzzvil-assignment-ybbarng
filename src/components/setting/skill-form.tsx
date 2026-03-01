import { useState } from "react";
import { SkillCard } from "@/components/setting/skill-card";
import { SkillCreator } from "@/components/setting/skill-creator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameButton } from "@/components/ui/game-button";
import { MAX_CUSTOM_SKILLS } from "@/constants/skills";
import { SKEW, SKEW_TEXT } from "@/constants/theme";
import type { Skill } from "@/types/skill";

interface SkillFormProps {
  skills: Skill[];
  onAddSkill: (skill: Skill) => void;
  onRemoveSkill: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function SkillForm({
  skills,
  onAddSkill,
  onRemoveSkill,
  onPrev,
  onNext,
}: SkillFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const customSkillCount = skills.filter((s) => !s.isDefault).length;
  const canAddMore = customSkillCount < MAX_CUSTOM_SKILLS;

  const handleAdd = (skill: Skill) => {
    onAddSkill(skill);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-bg-secondary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-accent-orange">보유 스킬</CardTitle>
            <span className="text-sm text-text-muted">
              커스텀 {customSkillCount}/{MAX_CUSTOM_SKILLS}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {skills.map((skill, index) => (
            <SkillCard
              // biome-ignore lint/suspicious/noArrayIndexKey: skills are ordered and index is stable within render
              key={index}
              skill={skill}
              onRemove={
                skill.isDefault ? undefined : () => onRemoveSkill(index)
              }
            />
          ))}

          {!isCreating && canAddMore && (
            <button
              type="button"
              data-testid="add-skill-button"
              className={`${SKEW} w-full cursor-pointer border-2 border-dashed border-accent-orange/50 px-4 py-2.5 text-sm font-bold tracking-wider text-accent-orange uppercase transition-all hover:border-accent-orange hover:bg-accent-orange/10`}
              onClick={() => setIsCreating(true)}
            >
              <span className={`${SKEW_TEXT} block`}>+ 스킬 추가</span>
            </button>
          )}
        </CardContent>
      </Card>

      {isCreating && (
        <SkillCreator onAdd={handleAdd} onCancel={() => setIsCreating(false)} />
      )}

      <div className="flex gap-2">
        <GameButton
          type="button"
          variant="blue"
          skew
          data-testid="prev-button"
          className="flex-1"
          onClick={onPrev}
        >
          이전
        </GameButton>
        <GameButton
          type="button"
          skew
          data-testid="next-button"
          className="flex-1"
          onClick={onNext}
        >
          다음
        </GameButton>
      </div>
    </div>
  );
}
