import { SkillCard } from "@/components/setting/skill-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Skill } from "@/types/skill";

interface SkillFormProps {
  skills: Skill[];
  onPrev: () => void;
  onNext: () => void;
}

export function SkillForm({ skills, onPrev, onNext }: SkillFormProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border bg-bg-secondary">
        <CardHeader>
          <CardTitle className="text-accent-orange">보유 스킬</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {skills.map((skill, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skills are ordered and index is stable within render
            <SkillCard key={index} skill={skill} />
          ))}
        </CardContent>
      </Card>

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
