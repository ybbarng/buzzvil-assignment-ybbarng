import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types/game";

interface DifficultyFormProps {
  difficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
  onPrev: () => void;
  onStartBattle: () => void;
}

const DIFFICULTY_OPTIONS: {
  value: Difficulty;
  label: string;
  description: string;
  testId: string;
}[] = [
  {
    value: "easy",
    label: "쉬움",
    description: "훈련 로봇과 대전합니다",
    testId: "difficulty-easy",
  },
  {
    value: "normal",
    label: "보통",
    description: "전투 드론과 대전합니다",
    testId: "difficulty-normal",
  },
  {
    value: "hard",
    label: "어려움",
    description: "타론 요원과 대전합니다",
    testId: "difficulty-hard",
  },
];

export function DifficultyForm({
  difficulty,
  onSelect,
  onPrev,
  onStartBattle,
}: DifficultyFormProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border bg-bg-secondary">
        <CardHeader>
          <CardTitle className="text-accent-orange">난이도 선택</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              data-testid={opt.testId}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-left transition-colors",
                difficulty === opt.value
                  ? "border-accent-orange bg-accent-orange/10 text-text-primary"
                  : "border-border bg-bg-tertiary text-text-secondary hover:border-text-muted",
              )}
              onClick={() => onSelect(opt.value)}
            >
              <div className="font-semibold">{opt.label}</div>
              <div className="text-sm text-text-muted">{opt.description}</div>
            </button>
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
          data-testid="start-battle-button"
          className="flex-1 bg-accent-orange font-bold text-bg-primary hover:bg-accent-orange-hover"
          onClick={onStartBattle}
        >
          전투 시작
        </Button>
      </div>
    </div>
  );
}
