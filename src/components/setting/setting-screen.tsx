import { DifficultyForm } from "@/components/setting/difficulty-form";
import { NameStatForm } from "@/components/setting/name-stat-form";
import { SkillForm } from "@/components/setting/skill-form";
import { StepIndicator } from "@/components/setting/step-indicator";
import type { NameStatFormData } from "@/schemas/name-stat.schema";
import { useGameStore } from "@/stores/game-store";
import { useSettingStore } from "@/stores/setting-store";

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

  const handleStep1Submit = (data: NameStatFormData) => {
    setName(data.name);
    setStats(data.stats);
    setStep(2);
  };

  return (
    <div>
      <div className="mb-8 select-none text-center">
        <h1 className="text-5xl font-black tracking-widest text-accent-orange uppercase">
          BUZZ ARENA
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          자신만의 강력한 영웅을 구성하고 치열한 전투에 참가해보세요!
        </p>
      </div>
      <StepIndicator currentStep={step} onStepClick={setStep} />

      {step === 1 && (
        <NameStatForm
          defaultName={name}
          defaultStats={stats}
          onSubmit={handleStep1Submit}
        />
      )}

      {step === 2 && (
        <SkillForm
          skills={skills}
          onAddSkill={addSkill}
          onRemoveSkill={removeSkill}
          onPrev={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <DifficultyForm
          difficulty={difficulty}
          onSelect={setDifficulty}
          onPrev={() => setStep(2)}
          onStartBattle={startBattle}
        />
      )}
    </div>
  );
}
