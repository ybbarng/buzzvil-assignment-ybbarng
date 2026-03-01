import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { GameButton } from "@/components/ui/game-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SKEW } from "@/constants/theme";
import {
  type CustomSkillFormData,
  customSkillSchema,
} from "@/schemas/skill.schema";
import type { Skill, SkillType } from "@/types/skill";

interface SkillCreatorProps {
  onAdd: (skill: Skill) => void;
  onCancel: () => void;
}

const SKILL_TYPE_OPTIONS: {
  value: Exclude<SkillType, "defend">;
  label: string;
}[] = [
  { value: "attack", label: "공격" },
  { value: "heal", label: "회복" },
  { value: "buff", label: "버프" },
  { value: "debuff", label: "디버프" },
];

const DEFAULT_VALUES: CustomSkillFormData = {
  name: "",
  type: "attack",
  mpCost: 5,
  multiplier: 1.5,
};

function getDefaultForType(
  type: CustomSkillFormData["type"],
): CustomSkillFormData {
  switch (type) {
    case "attack":
      return { name: "", type: "attack", mpCost: 5, multiplier: 1.5 };
    case "heal":
      return { name: "", type: "heal", mpCost: 10, healAmount: 30 };
    case "buff":
      return {
        name: "",
        type: "buff",
        mpCost: 8,
        target: "atk",
        value: 5,
        duration: 3,
      };
    case "debuff":
      return {
        name: "",
        type: "debuff",
        mpCost: 8,
        target: "def",
        value: 5,
        duration: 3,
      };
  }
}

export function SkillCreator({ onAdd, onCancel }: SkillCreatorProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors },
  } = useForm<CustomSkillFormData>({
    resolver: zodResolver(customSkillSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const skillType = useWatch({ control, name: "type" });
  // "target"은 buff/debuff 변형에만 존재하는 필드라 discriminated union 추론이 안 됨
  const targetValue = useWatch({ control, name: "target" as "target" });

  const handleTypeChange = (value: string) => {
    const newType = value as CustomSkillFormData["type"];
    const currentName = getValues("name");
    const defaults = getDefaultForType(newType);
    reset({ ...defaults, name: currentName });
  };

  const onSubmit = (data: CustomSkillFormData) => {
    const skill = { ...data, isDefault: false } as Skill;
    onAdd(skill);
  };

  return (
    <section className="border-l-2 border-accent-orange bg-bg-secondary/60 px-5 py-4">
      <h2 className="mb-4 text-sm font-bold tracking-wider text-accent-orange uppercase">
        커스텀 스킬 생성
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-text-secondary">스킬 이름</Label>
          <div className={`${SKEW} bg-bg-tertiary px-4 py-2`}>
            <Input
              data-testid="skill-name-input"
              placeholder="스킬 이름 (최대 8자)"
              className="border-none bg-transparent text-text-primary shadow-none placeholder:text-text-muted"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-damage">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-text-secondary">스킬 타입</Label>
          <Select value={skillType} onValueChange={handleTypeChange}>
            <SelectTrigger className="border-border bg-bg-tertiary text-text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SKILL_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-text-secondary">MP 소모량</Label>
          <div className={`${SKEW} bg-bg-tertiary px-4 py-2`}>
            <Input
              type="number"
              className="border-none bg-transparent text-text-primary shadow-none"
              {...register("mpCost", { valueAsNumber: true })}
            />
          </div>
          {errors.mpCost && (
            <p className="text-xs text-damage">{errors.mpCost.message}</p>
          )}
        </div>

        {skillType === "attack" && (
          <div className="space-y-2">
            <Label className="text-text-secondary">공격 배율 (1.0 ~ 3.0)</Label>
            <div className={`${SKEW} bg-bg-tertiary px-4 py-2`}>
              <Input
                type="number"
                step="0.1"
                className="border-none bg-transparent text-text-primary shadow-none"
                {...register("multiplier", { valueAsNumber: true })}
              />
            </div>
            {"multiplier" in errors && errors.multiplier && (
              <p className="text-xs text-damage">{errors.multiplier.message}</p>
            )}
          </div>
        )}

        {skillType === "heal" && (
          <div className="space-y-2">
            <Label className="text-text-secondary">회복량 (10 ~ 50)</Label>
            <div className={`${SKEW} bg-bg-tertiary px-4 py-2`}>
              <Input
                type="number"
                className="border-none bg-transparent text-text-primary shadow-none"
                {...register("healAmount", { valueAsNumber: true })}
              />
            </div>
            {"healAmount" in errors && errors.healAmount && (
              <p className="text-xs text-damage">{errors.healAmount.message}</p>
            )}
          </div>
        )}

        {(skillType === "buff" || skillType === "debuff") && (
          <>
            <div className="space-y-2">
              <Label className="text-text-secondary">대상 스탯</Label>
              <Select
                value={targetValue ?? "atk"}
                onValueChange={(v) =>
                  setValue("target" as "target", v as "atk" | "def")
                }
              >
                <SelectTrigger className="border-border bg-bg-tertiary text-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="atk">ATK</SelectItem>
                  <SelectItem value="def">DEF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-text-secondary">수치 (1 ~ 10)</Label>
              <div className={`${SKEW} bg-bg-tertiary px-4 py-2`}>
                <Input
                  type="number"
                  className="border-none bg-transparent text-text-primary shadow-none"
                  {...register("value", { valueAsNumber: true })}
                />
              </div>
              {"value" in errors && errors.value && (
                <p className="text-xs text-damage">{errors.value.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-text-secondary">지속 턴 (1 ~ 5)</Label>
              <div className={`${SKEW} bg-bg-tertiary px-4 py-2`}>
                <Input
                  type="number"
                  className="border-none bg-transparent text-text-primary shadow-none"
                  {...register("duration", { valueAsNumber: true })}
                />
              </div>
              {"duration" in errors && errors.duration && (
                <p className="text-xs text-damage">{errors.duration.message}</p>
              )}
            </div>
          </>
        )}

        <div className="flex gap-2">
          <GameButton
            type="button"
            variant="blue"
            skew
            className="flex-1"
            onClick={onCancel}
          >
            취소
          </GameButton>
          <GameButton
            type="submit"
            skew
            data-testid="submit-skill-button"
            className="flex-1"
          >
            스킬 추가
          </GameButton>
        </div>
      </form>
    </section>
  );
}
