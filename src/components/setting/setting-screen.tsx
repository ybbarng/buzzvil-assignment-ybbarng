import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ReplayListDialog } from "@/components/replay/replay-list-dialog";
import { DifficultyForm } from "@/components/setting/difficulty-form";
import { NameStatForm } from "@/components/setting/name-stat-form";
import { SkillForm } from "@/components/setting/skill-form";
import { StepIndicator } from "@/components/setting/step-indicator";
import { GameButton } from "@/components/ui/game-button";
import { slideInClass, staggerDelay } from "@/constants/theme";
import { cn, josa } from "@/lib/utils";
import type { NameStatFormData } from "@/schemas/name-stat.schema";
import { useGameStore } from "@/stores/game-store";
import { useReplayStore } from "@/stores/replay-store";
import { useSettingStore } from "@/stores/setting-store";
import type { Direction, SettingStep } from "@/types/game";

type IntroPhase = "center" | "moving" | "done";

/** fade-in(800ms) 완료 후 여유 시간을 포함한 대기 시간 */
export const INTRO_FADE_IN_WAIT_MS = 1500;
/** intro-settle(700ms) + 여유. onAnimationEnd가 동작하지 않을 때의 fallback */
export const INTRO_SETTLE_FALLBACK_MS = 800;
/** CSS @keyframes 이름. onAnimationEnd에서 버블링 필터링에 사용 */
const INTRO_SETTLE_ANIMATION = "intro-settle";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const INTRO_PHASE_CLASS: Record<IntroPhase, string> = {
  center: "animate-intro-fade-in",
  moving: "animate-intro-settle",
  done: "",
};

function getStepGuide(step: SettingStep, name: string): React.ReactNode {
  if (step === 2 && name) {
    return (
      <>
        <span className="font-bold text-white">{name}</span>
        {josa(name, "이", "가")} 전투에 사용할 스킬을 장착하세요. 공격, 방어와
        함께 추가 스킬 2개를 보유할 수 있습니다.
      </>
    );
  }
  const guides: Record<SettingStep, string> = {
    1: "영웅 등록을 시작합니다. 이름과 능력치를 설정하세요.",
    2: "전투에 사용할 스킬을 장착하세요. 공격, 방어와 함께 추가 스킬 2개를 보유할 수 있습니다.",
    3: "전투 난이도를 선택하세요. 난이도에 따라 적의 강도가 달라집니다.",
  };
  return guides[step];
}

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

  const prefersReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;

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

/**
 * 전투 시작 퇴장 애니메이션.
 * 헤더([data-header])는 위로, 설정 구성요소들은 아래로 동시 퇴장시킨 뒤 callback을 호출한다.
 */
function animateBattleExitThenDo(
  settingEls: HTMLElement[],
  callback: () => void,
) {
  const headerEl = document.querySelector<HTMLElement>("[data-header]");
  const allEls = [headerEl, ...settingEls].filter(Boolean) as HTMLElement[];

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (allEls.length === 0 || !allEls[0].animate || prefersReduced) {
    callback();
    return;
  }

  const animations: Animation[] = [];

  if (headerEl?.animate) {
    animations.push(
      headerEl.animate(
        [
          { transform: "translateY(0)", opacity: "1" },
          { transform: "translateY(-100vh)", opacity: "0" },
        ],
        { duration: 400, fill: "forwards", easing: "ease-in" },
      ),
    );
  }

  for (const el of settingEls) {
    if (el.animate) {
      animations.push(
        el.animate(
          [
            { transform: "translateY(0)", opacity: "1" },
            { transform: "translateY(100vh)", opacity: "0" },
          ],
          { duration: 400, fill: "forwards", easing: "ease-in" },
        ),
      );
    }
  }

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
  const presetId = useSettingStore((s) => s.presetId);
  const setStep = useSettingStore((s) => s.setStep);
  const setName = useSettingStore((s) => s.setName);
  const setStats = useSettingStore((s) => s.setStats);
  const addSkill = useSettingStore((s) => s.addSkill);
  const removeSkill = useSettingStore((s) => s.removeSkill);
  const setDifficulty = useSettingStore((s) => s.setDifficulty);
  const setPresetId = useSettingStore((s) => s.setPresetId);
  const startBattle = useGameStore((s) => s.startBattle);
  const replays = useReplayStore((s) => s.replays);
  const [replayOpen, setReplayOpen] = useState(false);

  const indicatorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isExiting = useRef(false);
  const [enterDirection, setEnterDirection] = useState<Direction>("forward");
  const [indicatorStep, setIndicatorStep] = useState<SettingStep>(step);
  const [introPhase, setIntroPhase] = useState<IntroPhase>(() => {
    const prefersReduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    return prefersReduced ? "done" : "center";
  });

  useEffect(() => {
    if (introPhase !== "center") return;

    const timer = setTimeout(() => {
      setIntroPhase("moving");
    }, INTRO_FADE_IN_WAIT_MS);
    return () => clearTimeout(timer);
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "moving") return;

    const fallback = setTimeout(() => {
      setIntroPhase("done");
    }, INTRO_SETTLE_FALLBACK_MS);

    return () => clearTimeout(fallback);
  }, [introPhase]);

  // 외부에서 step이 변경될 경우에도 indicatorStep을 동기화
  useEffect(() => {
    setIndicatorStep(step);
  }, [step]);

  const withExit = (
    direction: Direction,
    callback: () => void,
    options?: { includeIndicator?: boolean; targetStep?: SettingStep },
  ) => {
    if (isExiting.current) return;
    isExiting.current = true;
    setEnterDirection(direction);
    if (options?.targetStep) {
      setIndicatorStep(options.targetStep);
    }
    const extra =
      options?.includeIndicator && indicatorRef.current
        ? [indicatorRef.current]
        : [];
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

  const handleStep1Submit = (
    data: NameStatFormData,
    selectedPresetId: string | null,
  ) => {
    setName(data.name);
    setStats(data.stats);
    setPresetId(selectedPresetId);
    withExit("forward", () => setStep(2), { targetStep: 2 });
  };

  const slideIn = slideInClass(enterDirection);

  return (
    <div>
      <div
        data-header
        className={cn("mb-8 text-center", INTRO_PHASE_CLASS[introPhase])}
        onAnimationEnd={
          introPhase === "moving"
            ? (e) => {
                if (e.animationName !== INTRO_SETTLE_ANIMATION) return;
                setIntroPhase("done");
              }
            : undefined
        }
      >
        <h1 className="animate-title-blaze text-6xl font-bold tracking-wide text-accent-orange uppercase">
          BUZZ ARENA
        </h1>
        <p className="mt-2 text-base tracking-wide text-text-secondary">
          자신만의 강력한 영웅을 구성하고 치열한 전투에 참가해보세요!
        </p>
      </div>

      {introPhase === "done" && (
        <>
          <div ref={indicatorRef} className="animate-slide-in-right">
            <StepIndicator
              currentStep={indicatorStep}
              onStepClick={(s) =>
                withExit(s < step ? "backward" : "forward", () => setStep(s), {
                  targetStep: s,
                })
              }
              trailing={
                replays.length > 0 && (
                  <GameButton
                    type="button"
                    variant="blue"
                    size="sm"
                    onClick={() => setReplayOpen(true)}
                  >
                    다시보기
                  </GameButton>
                )
              }
            />
          </div>

          <div key={step} ref={contentRef}>
            <div className={slideIn} data-animate style={staggerDelay(1)}>
              <p className="mb-6 text-sm tracking-wide text-text-secondary">
                {getStepGuide(step, name)}
              </p>
            </div>

            {step === 1 && (
              <NameStatForm
                defaultName={name}
                defaultStats={stats}
                defaultPresetId={presetId}
                onSubmit={handleStep1Submit}
                enterDirection={enterDirection}
              />
            )}

            {step === 2 && (
              <SkillForm
                skills={skills}
                presetId={presetId}
                onAddSkill={addSkill}
                onRemoveSkill={removeSkill}
                onPrev={() =>
                  withExit("backward", () => setStep(1), { targetStep: 1 })
                }
                onNext={() =>
                  withExit("forward", () => setStep(3), { targetStep: 3 })
                }
                enterDirection={enterDirection}
              />
            )}

            {step === 3 && (
              <div className={slideIn} data-animate style={staggerDelay(2)}>
                <DifficultyForm
                  difficulty={difficulty}
                  onSelect={setDifficulty}
                  onPrev={() =>
                    withExit("backward", () => setStep(2), { targetStep: 2 })
                  }
                  onStartBattle={() => {
                    if (isExiting.current) return;
                    isExiting.current = true;
                    const settingEls = [
                      indicatorRef.current,
                      contentRef.current,
                    ].filter(Boolean) as HTMLElement[];
                    animateBattleExitThenDo(settingEls, () => {
                      isExiting.current = false;
                      startBattle();
                    });
                  }}
                  enterDirection={enterDirection}
                />
              </div>
            )}
          </div>
        </>
      )}

      <ReplayListDialog open={replayOpen} onOpenChange={setReplayOpen} />
    </div>
  );
}
