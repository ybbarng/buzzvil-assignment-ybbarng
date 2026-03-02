import { useState } from "react";
import { SkillCard } from "@/components/setting/skill-card";
import { SkillCreator } from "@/components/setting/skill-creator";
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
  const emptySlotCount = MAX_CUSTOM_SKILLS - customSkillCount;

  const handleAdd = (skill: Skill) => {
    onAddSkill(skill);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      <section className="border-l-2 border-accent-orange bg-bg-secondary/60 px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-wider text-accent-orange uppercase">
            보유 스킬
          </h2>
          <span className={`${SKEW} text-sm text-text-muted`}>
            <span className={`${SKEW_TEXT} block`}>
              커스텀 {customSkillCount}/{MAX_CUSTOM_SKILLS}
            </span>
          </span>
        </div>
        <div className="space-y-2">
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

          {!isCreating && emptySlotCount > 0 && (
            <button
              type="button"
              data-testid="add-skill-button"
              className={`${SKEW} w-full cursor-pointer border-2 border-dashed border-accent-orange/50 px-4 py-2.5 text-sm font-bold tracking-wider text-accent-orange uppercase transition-all hover:border-accent-orange hover:bg-accent-orange/10`}
              onClick={() => setIsCreating(true)}
            >
              <span className={`${SKEW_TEXT} block`}>+ 스킬 추가</span>
            </button>
          )}
          {!isCreating && emptySlotCount > 1 && (
            <div
              className={`${SKEW} w-full border-2 border-dashed border-border/50 px-4 py-2.5 text-center text-sm text-text-muted`}
            >
              <span className={`${SKEW_TEXT} block`}>빈 슬롯</span>
            </div>
          )}
        </div>
      </section>

      {isCreating && (
        <SkillCreator onAdd={handleAdd} onCancel={() => setIsCreating(false)} />
      )}

      <div className="flex gap-2">
        <GameButton
          type="button"
          variant="blue"
          data-testid="prev-button"
          className="flex-1"
          onClick={onPrev}
        >
          이전
        </GameButton>
        <GameButton
          type="button"
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
