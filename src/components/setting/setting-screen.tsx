import { NameStatForm } from "@/components/setting/name-stat-form";
import { SkillForm } from "@/components/setting/skill-form";
import { StepIndicator } from "@/components/setting/step-indicator";
import type { NameStatFormData } from "@/schemas/name-stat.schema";
import { useSettingStore } from "@/stores/setting-store";

export function SettingScreen() {
  const step = useSettingStore((s) => s.step);
  const name = useSettingStore((s) => s.name);
  const stats = useSettingStore((s) => s.stats);
  const skills = useSettingStore((s) => s.skills);
  const setStep = useSettingStore((s) => s.setStep);
  const setName = useSettingStore((s) => s.setName);
  const setStats = useSettingStore((s) => s.setStats);

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
          onPrev={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <div className="text-center text-text-secondary">
          난이도 설정 (준비 중)
        </div>
      )}
    </div>
  );
}
