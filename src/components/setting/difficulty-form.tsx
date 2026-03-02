import { GameButton } from "@/components/ui/game-button";
import { SKEW, SKEW_TEXT, slideInClass, staggerDelay } from "@/constants/theme";
import { cn } from "@/lib/utils";
import type { Difficulty, Direction } from "@/types/game";

interface DifficultyFormProps {
  difficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
  onPrev: () => void;
  onStartBattle: () => void;
  enterDirection: Direction;
}

const DIFFICULTY_OPTIONS: {
  value: Difficulty;
  label: string;
  description: string;
  testId: string;
  color: { selected: string; border: string };
}[] = [
  {
    value: "easy",
    label: "쉬움",
    description: "훈련 로봇과 대전합니다",
    testId: "difficulty-easy",
    color: { selected: "border-heal bg-heal/10", border: "border-heal" },
  },
  {
    value: "normal",
    label: "보통",
    description: "전투 드론과 대전합니다",
    testId: "difficulty-normal",
    color: { selected: "border-buff bg-buff/10", border: "border-buff" },
  },
  {
    value: "hard",
    label: "어려움",
    description: "타론 요원과 대전합니다",
    testId: "difficulty-hard",
    color: { selected: "border-damage bg-damage/10", border: "border-damage" },
  },
];

export function DifficultyForm({
  difficulty,
  onSelect,
  onPrev,
  onStartBattle,
  enterDirection,
}: DifficultyFormProps) {
  const slideIn = slideInClass(enterDirection);

  return (
    <div className="space-y-6">
      <section
        className={`${slideIn} border-l-2 border-accent-orange bg-bg-secondary/60 px-5 py-4`}
        data-animate
        style={staggerDelay(2)}
      >
        <h2 className="mb-3 text-sm font-bold tracking-wider text-accent-orange uppercase">
          난이도 선택
        </h2>
        <div className="space-y-3">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              data-testid={opt.testId}
              className={cn(
                SKEW,
                "w-full cursor-pointer border-2 px-4 py-3 text-left transition-all",
                difficulty === opt.value
                  ? `${opt.color.selected} text-text-primary`
                  : "border-border/50 bg-bg-tertiary text-text-secondary hover:border-text-muted hover:bg-bg-tertiary/80",
              )}
              onClick={() => onSelect(opt.value)}
            >
              <div className={`${SKEW_TEXT} font-semibold`}>{opt.label}</div>
              <div className={`${SKEW_TEXT} text-sm text-text-muted`}>
                {opt.description}
              </div>
            </button>
          ))}
        </div>
      </section>

      <div
        className={`${slideIn} flex gap-2`}
        data-animate
        style={staggerDelay(3)}
      >
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
          active
          data-testid="start-battle-button"
          className="flex-1"
          onClick={onStartBattle}
        >
          전투 시작
        </GameButton>
      </div>
    </div>
  );
}
