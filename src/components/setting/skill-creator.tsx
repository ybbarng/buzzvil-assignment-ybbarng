import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  CUSTOM_SKILL_TYPES,
  type CustomSkillType,
  SKILL_TYPE_LABELS,
} from "@/constants/skills";
import {
  type CustomSkillFormData,
  customSkillSchema,
} from "@/schemas/skill.schema";
import type { Skill } from "@/types/skill";

interface SkillCreatorProps {
  onAdd: (skill: Skill) => void;
  onCancel: () => void;
}

const defaultValues: CustomSkillFormData = {
  name: "",
  type: "attack",
  mpCost: 10,
  multiplier: 1.5,
};

export function SkillCreator({ onAdd, onCancel }: SkillCreatorProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CustomSkillFormData>({
    resolver: zodResolver(customSkillSchema),
    defaultValues,
  });

  const skillType = useWatch({ control, name: "type" });

  const handleTypeChange = (value: string) => {
    const newType = value as CustomSkillType;
    setValue("type", newType, { shouldValidate: true });
    // 타입 변경 시 타입별 기본값 설정
    if (newType === "attack") {
      setValue("multiplier", 1.5);
    } else if (newType === "heal") {
      setValue("healAmount", 20);
    } else if (newType === "buff" || newType === "debuff") {
      setValue("target", "atk");
      setValue("value", 5);
      setValue("duration", 3);
    }
  };

  const onSubmit = (data: CustomSkillFormData) => {
    onAdd({ ...data, isDefault: false } as Skill);
  };

  return (
    <Card className="border-border bg-bg-secondary">
      <CardHeader>
        <CardTitle className="text-accent-orange">커스텀 스킬 생성</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>스킬 이름</Label>
              <Input
                data-testid="skill-name-input"
                placeholder="1~8자"
                maxLength={8}
                className="border-border bg-bg-tertiary text-text-primary"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-damage">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>타입</Label>
              <Select value={skillType} onValueChange={handleTypeChange}>
                <SelectTrigger className="border-border bg-bg-tertiary text-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOM_SKILL_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {SKILL_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>
              MP 소모 ({1}~{30})
            </Label>
            <div className="flex items-center gap-3">
              <Slider
                min={1}
                max={30}
                defaultValue={[10]}
                onValueChange={([v]) =>
                  setValue("mpCost", v, { shouldValidate: true })
                }
              />
              <Input
                type="number"
                className="w-16 border-border bg-bg-tertiary text-center text-text-primary"
                {...register("mpCost", { valueAsNumber: true })}
              />
            </div>
            {errors.mpCost && (
              <p className="text-xs text-damage">{errors.mpCost.message}</p>
            )}
          </div>

          {skillType === "attack" && (
            <div className="space-y-1.5">
              <Label>배율 (1.0~3.0)</Label>
              <div className="flex items-center gap-3">
                <Slider
                  min={10}
                  max={30}
                  defaultValue={[15]}
                  onValueChange={([v]) =>
                    setValue("multiplier", v / 10, { shouldValidate: true })
                  }
                />
                <Input
                  type="number"
                  step="0.1"
                  className="w-16 border-border bg-bg-tertiary text-center text-text-primary"
                  {...register("multiplier", { valueAsNumber: true })}
                />
              </div>
            </div>
          )}

          {skillType === "heal" && (
            <div className="space-y-1.5">
              <Label>회복량 (10~50)</Label>
              <div className="flex items-center gap-3">
                <Slider
                  min={10}
                  max={50}
                  defaultValue={[20]}
                  onValueChange={([v]) =>
                    setValue("healAmount", v, { shouldValidate: true })
                  }
                />
                <Input
                  type="number"
                  className="w-16 border-border bg-bg-tertiary text-center text-text-primary"
                  {...register("healAmount", { valueAsNumber: true })}
                />
              </div>
            </div>
          )}

          {(skillType === "buff" || skillType === "debuff") && (
            <>
              <div className="space-y-1.5">
                <Label>대상 스탯</Label>
                <Select
                  defaultValue="atk"
                  onValueChange={(v) =>
                    setValue("target", v as "atk" | "def", {
                      shouldValidate: true,
                    })
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

              <div className="space-y-1.5">
                <Label>수치 (1~10)</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    min={1}
                    max={10}
                    defaultValue={[5]}
                    onValueChange={([v]) =>
                      setValue("value", v, { shouldValidate: true })
                    }
                  />
                  <Input
                    type="number"
                    className="w-16 border-border bg-bg-tertiary text-center text-text-primary"
                    {...register("value", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>지속 턴 (1~5)</Label>
                <div className="flex items-center gap-3">
                  <Slider
                    min={1}
                    max={5}
                    defaultValue={[3]}
                    onValueChange={([v]) =>
                      setValue("duration", v, { shouldValidate: true })
                    }
                  />
                  <Input
                    type="number"
                    className="w-16 border-border bg-bg-tertiary text-center text-text-primary"
                    {...register("duration", { valueAsNumber: true })}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              data-testid="submit-skill-button"
              className="flex-1 bg-accent-orange font-bold text-bg-primary hover:bg-accent-orange-hover"
            >
              생성
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
