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
import { STAT_LABELS } from "@/constants/stats";

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

/** SKILL_CONSTRAINTS의 min과 max의 중간값을 반환. step이 있으면 해당 단위로 반올림 */
function mid(field: { min: number; max: number; step?: number }) {
  const raw = (field.min + field.max) / 2;
  const step = field.step ?? 1;
  return Math.round(raw / step) * step;
}

const DEFAULT_VALUES: CustomSkillFormData = {
  name: "",
  type: "attack",
  mpCost: mid(SKILL_CONSTRAINTS.mpCost),
  multiplier: mid(SKILL_CONSTRAINTS.multiplier),
};

function getDefaultForType(
  type: CustomSkillFormData["type"],
): CustomSkillFormData {
  const mpCost = mid(SKILL_CONSTRAINTS.mpCost);
  switch (type) {
    case "attack":
      return {
        name: "",
        type: "attack",
        mpCost,
        multiplier: mid(SKILL_CONSTRAINTS.multiplier),
      };
    case "heal":
      return {
        name: "",
        type: "heal",
        mpCost,
        healAmount: mid(SKILL_CONSTRAINTS.healAmount),
      };
    case "buff":
      return {
        name: "",
        type: "buff",
        mpCost,
        target: "atk",
        value: mid(SKILL_CONSTRAINTS.value),
        duration: mid(SKILL_CONSTRAINTS.duration),
      };
    case "debuff":
      return {
        name: "",
        type: "debuff",
        mpCost,
        target: "def",
        value: mid(SKILL_CONSTRAINTS.value),
        duration: mid(SKILL_CONSTRAINTS.duration),
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label className="text-text-secondary">스킬 이름</Label>
        <Input
          data-testid="skill-name-input"
          placeholder={`스킬 이름 (최대 ${SKILL_CONSTRAINTS.name.max}자)`}
          maxLength={SKILL_CONSTRAINTS.name.max}
          className="border-border bg-bg-tertiary text-text-primary placeholder:text-text-muted"
          {...register("name")}
        />
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
          <Label className="text-text-secondary">마나(MP) 소모량</Label>
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
                {(["atk", "def"] as const).map((key) => (
                  <SelectItem key={key} value={key}>
                    {STAT_LABELS[key].ko} {STAT_LABELS[key].en}
                  </SelectItem>
                ))}
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
  );
}
