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
      <h1 className="mb-2 text-center text-3xl font-bold text-accent-orange">
        캐릭터 세팅
      </h1>
      <StepIndicator currentStep={step} />

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
