import { useState } from "react";
import { SkillCard } from "@/components/setting/skill-card";
import { SkillCreator } from "@/components/setting/skill-creator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MAX_CUSTOM_SKILLS } from "@/constants/skills";
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
            <Button
              type="button"
              variant="outline"
              data-testid="add-skill-button"
              className="w-full border-dashed border-accent-orange/50 text-accent-orange hover:bg-accent-orange/10"
              onClick={() => setIsCreating(true)}
            >
              + 스킬 추가
            </Button>
          )}
        </CardContent>
      </Card>

      {isCreating && (
        <SkillCreator onAdd={handleAdd} onCancel={() => setIsCreating(false)} />
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          data-testid="prev-button"
          className="flex-1"
          onClick={onPrev}
        >
          이전
        </Button>
        <Button
          type="button"
          data-testid="next-button"
          className="flex-1 bg-accent-orange font-bold text-bg-primary hover:bg-accent-orange-hover"
          onClick={onNext}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
