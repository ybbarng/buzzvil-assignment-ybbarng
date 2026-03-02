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
import { Slider } from "@/components/ui/slider";
import { SKILL_TYPE_ICONS, SKILL_TYPE_LABELS } from "@/constants/skills";
import { SKEW } from "@/constants/theme";
import {
  type CustomSkillFormData,
  customSkillSchema,
  SKILL_CONSTRAINTS,
} from "@/schemas/skill.schema";
import type { Skill, SkillType } from "@/types/skill";

interface SkillCreatorProps {
  onAdd: (skill: Skill) => void;
  onCancel: () => void;
}

const SKILL_TYPE_OPTIONS: Exclude<SkillType, "defend">[] = [
  "attack",
  "heal",
  "buff",
  "debuff",
];

const SLIDER_COLOR = "[&_[data-slot=slider-range]]:bg-accent-orange";

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

  // discriminated union 필드들을 개별 useWatch 대신 단일 구독으로 통합
  const watched = useWatch({ control }) as CustomSkillFormData;
  const { type: skillType, mpCost } = watched;
  const targetValue = "target" in watched ? watched.target : undefined;
  const multiplier = "multiplier" in watched ? watched.multiplier : undefined;
  const healAmount = "healAmount" in watched ? watched.healAmount : undefined;
  const buffValue = "value" in watched ? watched.value : undefined;
  const duration = "duration" in watched ? watched.duration : undefined;

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
              placeholder={`스킬 이름 (최대 ${SKILL_CONSTRAINTS.name.max}자)`}
              maxLength={SKILL_CONSTRAINTS.name.max}
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
              {SKILL_TYPE_OPTIONS.map((type) => {
                const Icon = SKILL_TYPE_ICONS[type];
                return (
                  <SelectItem key={type} value={type}>
                    <Icon className="size-4" /> {SKILL_TYPE_LABELS[type]}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-text-secondary">MP 소모량</Label>
            <span className="text-sm font-bold tabular-nums text-accent-orange">
              {mpCost}
            </span>
          </div>
          <Slider
            min={SKILL_CONSTRAINTS.mpCost.min}
            max={SKILL_CONSTRAINTS.mpCost.max}
            step={1}
            value={[mpCost]}
            onValueChange={([v]) => setValue("mpCost", v)}
            className={SLIDER_COLOR}
          />
          <div className="flex justify-between text-xs text-text-muted">
            <span>{SKILL_CONSTRAINTS.mpCost.min}</span>
            <span>{SKILL_CONSTRAINTS.mpCost.max}</span>
          </div>
          {errors.mpCost && (
            <p className="text-xs text-damage">{errors.mpCost.message}</p>
          )}
        </div>

        {skillType === "attack" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-text-secondary">공격 배율</Label>
              <span className="text-sm font-bold tabular-nums text-accent-orange">
                {multiplier?.toFixed(1)}
              </span>
            </div>
            <Slider
              min={SKILL_CONSTRAINTS.multiplier.min}
              max={SKILL_CONSTRAINTS.multiplier.max}
              step={SKILL_CONSTRAINTS.multiplier.step}
              value={[multiplier as number]}
              onValueChange={([v]) =>
                setValue("multiplier" as "multiplier", Math.round(v * 10) / 10)
              }
              className={SLIDER_COLOR}
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>{SKILL_CONSTRAINTS.multiplier.min.toFixed(1)}</span>
              <span>{SKILL_CONSTRAINTS.multiplier.max.toFixed(1)}</span>
            </div>
            {"multiplier" in errors && errors.multiplier && (
              <p className="text-xs text-damage">{errors.multiplier.message}</p>
            )}
          </div>
        )}

        {skillType === "heal" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-text-secondary">회복량</Label>
              <span className="text-sm font-bold tabular-nums text-accent-orange">
                {healAmount as number}
              </span>
            </div>
            <Slider
              min={SKILL_CONSTRAINTS.healAmount.min}
              max={SKILL_CONSTRAINTS.healAmount.max}
              step={1}
              value={[healAmount as number]}
              onValueChange={([v]) => setValue("healAmount" as "healAmount", v)}
              className={SLIDER_COLOR}
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>{SKILL_CONSTRAINTS.healAmount.min}</span>
              <span>{SKILL_CONSTRAINTS.healAmount.max}</span>
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
                  <SelectItem value="atk">공격력 ATK</SelectItem>
                  <SelectItem value="def">방어력 DEF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-text-secondary">수치</Label>
                <span className="text-sm font-bold tabular-nums text-accent-orange">
                  {buffValue as number}
                </span>
              </div>
              <Slider
                min={SKILL_CONSTRAINTS.value.min}
                max={SKILL_CONSTRAINTS.value.max}
                step={1}
                value={[buffValue as number]}
                onValueChange={([v]) => setValue("value" as "value", v)}
                className={SLIDER_COLOR}
              />
              <div className="flex justify-between text-xs text-text-muted">
                <span>{SKILL_CONSTRAINTS.value.min}</span>
                <span>{SKILL_CONSTRAINTS.value.max}</span>
              </div>
              {"value" in errors && errors.value && (
                <p className="text-xs text-damage">{errors.value.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-text-secondary">지속 턴</Label>
                <span className="text-sm font-bold tabular-nums text-accent-orange">
                  {duration as number}턴
                </span>
              </div>
              <Slider
                min={SKILL_CONSTRAINTS.duration.min}
                max={SKILL_CONSTRAINTS.duration.max}
                step={1}
                value={[duration as number]}
                onValueChange={([v]) => setValue("duration" as "duration", v)}
                className={SLIDER_COLOR}
              />
              <div className="flex justify-between text-xs text-text-muted">
                <span>{SKILL_CONSTRAINTS.duration.min}</span>
                <span>{SKILL_CONSTRAINTS.duration.max}</span>
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
