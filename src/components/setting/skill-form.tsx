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

  const customCount = skills.filter((s) => !s.isDefault).length;
  const canAddMore = customCount < MAX_CUSTOM_SKILLS;

  const handleAdd = (skill: Skill) => {
    onAddSkill(skill);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-bg-secondary">
        <CardHeader>
          <CardTitle className="text-accent-orange">보유 스킬</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {skills.map((skill, index) => (
            <SkillCard
              // biome-ignore lint/suspicious/noArrayIndexKey: skills are identified by index for removal
              key={index}
              skill={skill}
              index={index}
              onRemove={!skill.isDefault ? onRemoveSkill : undefined}
            />
          ))}
        </CardContent>
      </Card>

      {isCreating ? (
        <SkillCreator onAdd={handleAdd} onCancel={() => setIsCreating(false)} />
      ) : (
        canAddMore && (
          <Button
            type="button"
            data-testid="add-skill-button"
            className="w-full bg-accent-blue font-bold text-white hover:bg-accent-blue-hover"
            onClick={() => setIsCreating(true)}
          >
            커스텀 스킬 추가 ({customCount}/{MAX_CUSTOM_SKILLS})
          </Button>
        )
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
