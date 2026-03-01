import { useRef, useState } from "react";
import { DifficultyForm } from "@/components/setting/difficulty-form";
import { NameStatForm } from "@/components/setting/name-stat-form";
import { SkillForm } from "@/components/setting/skill-form";
import { StepIndicator } from "@/components/setting/step-indicator";
import { slideInClass, staggerDelay } from "@/constants/theme";
import type { NameStatFormData } from "@/schemas/name-stat.schema";
import { useGameStore } from "@/stores/game-store";
import { useSettingStore } from "@/stores/setting-store";
import type { Direction, SettingStep } from "@/types/game";

const STEP_GUIDES: Record<SettingStep, string> = {
  1: "영웅 등록을 시작합니다. 이름과 능력치를 설정하세요.",
  2: "전투에 사용할 스킬을 장착하세요. 최대 4개까지 선택할 수 있습니다.",
  3: "전투 난이도를 선택하세요. 난이도에 따라 적의 강도가 달라집니다.",
};

/**
 * Web Animations API로 [data-animate] 요소들을 순차 퇴장시킨 뒤 callback을 호출한다.
 * forward: 왼쪽으로 퇴장, backward: 오른쪽으로 퇴장.
 * jsdom(테스트 환경)에서는 el.animate가 없으므로 즉시 callback을 호출한다.
 * prefers-reduced-motion이 활성화된 경우에도 애니메이션 없이 즉시 callback을 호출한다.
 */
function animateExitThenDo(
  container: HTMLElement | null,
  direction: Direction,
  callback: () => void,
  extraElements: HTMLElement[] = [],
) {
  const containerItems = container
    ? Array.from(container.querySelectorAll<HTMLElement>("[data-animate]"))
    : [];
  const items = [...extraElements, ...containerItems];

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (items.length === 0 || !items[0].animate || prefersReduced) {
    callback();
    return;
  }

  const exitX = direction === "forward" ? "-100vw" : "100vw";
  const EXIT_STAGGER_MS = 80;
  const animations = items.map((item, i) =>
    item.animate(
      [
        { transform: "translateX(0)", opacity: "1" },
        { transform: `translateX(${exitX})`, opacity: "0" },
      ],
      {
        duration: 150,
        delay: i * EXIT_STAGGER_MS,
        fill: "forwards",
        easing: "ease-in",
      },
    ),
  );

  Promise.all(animations.map((a) => a.finished))
    .then(callback)
    .catch(callback);
}

export function SettingScreen() {
  const step = useSettingStore((s) => s.step);
  const name = useSettingStore((s) => s.name);
  const stats = useSettingStore((s) => s.stats);
  const skills = useSettingStore((s) => s.skills);
  const difficulty = useSettingStore((s) => s.difficulty);
  const setStep = useSettingStore((s) => s.setStep);
  const setName = useSettingStore((s) => s.setName);
  const setStats = useSettingStore((s) => s.setStats);
  const addSkill = useSettingStore((s) => s.addSkill);
  const removeSkill = useSettingStore((s) => s.removeSkill);
  const setDifficulty = useSettingStore((s) => s.setDifficulty);
  const startBattle = useGameStore((s) => s.startBattle);

  const indicatorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isExiting = useRef(false);
  const [enterDirection, setEnterDirection] = useState<Direction>("forward");

  const withExit = (
    direction: Direction,
    callback: () => void,
    includeIndicator = false,
  ) => {
    if (isExiting.current) return;
    isExiting.current = true;
    setEnterDirection(direction);
    const extra =
      includeIndicator && indicatorRef.current ? [indicatorRef.current] : [];
    animateExitThenDo(
      contentRef.current,
      direction,
      () => {
        isExiting.current = false;
        callback();
      },
      extra,
    );
  };

  const handleStep1Submit = (data: NameStatFormData) => {
    setName(data.name);
    setStats(data.stats);
    withExit("forward", () => setStep(2));
  };

  const slideIn = slideInClass(enterDirection);

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="animate-title-blaze text-6xl font-bold tracking-wide text-accent-orange uppercase">
          BUZZ ARENA
        </h1>
        <p className="mt-2 text-base tracking-wide text-text-secondary">
          자신만의 강력한 영웅을 구성하고 치열한 전투에 참가해보세요!
        </p>
      </div>

      <div ref={indicatorRef} className="animate-slide-in-right">
        <StepIndicator
          currentStep={step}
          onStepClick={(s) =>
            withExit(s < step ? "backward" : "forward", () => setStep(s))
          }
        />
      </div>

      <div key={step} ref={contentRef}>
        <div className={slideIn} data-animate style={staggerDelay(1)}>
          <p className="mb-6 text-sm tracking-wide text-text-secondary">
            {STEP_GUIDES[step]}
          </p>
        </div>

        {step === 1 && (
          <NameStatForm
            defaultName={name}
            defaultStats={stats}
            onSubmit={handleStep1Submit}
            enterDirection={enterDirection}
          />
        )}

        {step === 2 && (
          <div className={slideIn} data-animate style={staggerDelay(2)}>
            <SkillForm
              skills={skills}
              onAddSkill={addSkill}
              onRemoveSkill={removeSkill}
              onPrev={() => withExit("backward", () => setStep(1))}
              onNext={() => withExit("forward", () => setStep(3))}
            />
          </div>
        )}

        {step === 3 && (
          <div className={slideIn} data-animate style={staggerDelay(2)}>
            <DifficultyForm
              difficulty={difficulty}
              onSelect={setDifficulty}
              onPrev={() => withExit("backward", () => setStep(2))}
              onStartBattle={() => withExit("forward", startBattle, true)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
