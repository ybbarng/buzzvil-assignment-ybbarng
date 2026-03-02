import { z } from "zod/v4";

/** 스킬 필드별 제약 조건 — 스키마 검증과 UI에서 공유 */
export const SKILL_CONSTRAINTS = {
  name: { min: 1, max: 8 },
  mpCost: { min: 1, max: 30 },
  multiplier: { min: 1.0, max: 3.0, step: 0.1 },
  healAmount: { min: 10, max: 50 },
  value: { min: 1, max: 10 },
  duration: { min: 1, max: 5 },
} as const;

const baseFields = {
  name: z
    .string()
    .min(SKILL_CONSTRAINTS.name.min, "스킬 이름을 입력해주세요")
    .max(
      SKILL_CONSTRAINTS.name.max,
      `스킬 이름은 ${SKILL_CONSTRAINTS.name.max}자 이하로 입력해주세요`,
    ),
  mpCost: z
    .number()
    .int()
    .min(SKILL_CONSTRAINTS.mpCost.min, `최소 ${SKILL_CONSTRAINTS.mpCost.min}`)
    .max(SKILL_CONSTRAINTS.mpCost.max, `최대 ${SKILL_CONSTRAINTS.mpCost.max}`),
};

const attackSchema = z.object({
  ...baseFields,
  type: z.literal("attack"),
  multiplier: z
    .number()
    .min(SKILL_CONSTRAINTS.multiplier.min)
    .max(SKILL_CONSTRAINTS.multiplier.max),
});

const healSchema = z.object({
  ...baseFields,
  type: z.literal("heal"),
  healAmount: z
    .number()
    .int()
    .min(
      SKILL_CONSTRAINTS.healAmount.min,
      `최소 ${SKILL_CONSTRAINTS.healAmount.min}`,
    )
    .max(
      SKILL_CONSTRAINTS.healAmount.max,
      `최대 ${SKILL_CONSTRAINTS.healAmount.max}`,
    ),
});

const buffSchema = z.object({
  ...baseFields,
  type: z.literal("buff"),
  target: z.enum(["atk", "def"]),
  value: z
    .number()
    .int()
    .min(SKILL_CONSTRAINTS.value.min, `최소 ${SKILL_CONSTRAINTS.value.min}`)
    .max(SKILL_CONSTRAINTS.value.max, `최대 ${SKILL_CONSTRAINTS.value.max}`),
  duration: z
    .number()
    .int()
    .min(
      SKILL_CONSTRAINTS.duration.min,
      `최소 ${SKILL_CONSTRAINTS.duration.min}턴`,
    )
    .max(
      SKILL_CONSTRAINTS.duration.max,
      `최대 ${SKILL_CONSTRAINTS.duration.max}턴`,
    ),
});

const debuffSchema = z.object({
  ...baseFields,
  type: z.literal("debuff"),
  target: z.enum(["atk", "def"]),
  value: z
    .number()
    .int()
    .min(SKILL_CONSTRAINTS.value.min, `최소 ${SKILL_CONSTRAINTS.value.min}`)
    .max(SKILL_CONSTRAINTS.value.max, `최대 ${SKILL_CONSTRAINTS.value.max}`),
  duration: z
    .number()
    .int()
    .min(
      SKILL_CONSTRAINTS.duration.min,
      `최소 ${SKILL_CONSTRAINTS.duration.min}턴`,
    )
    .max(
      SKILL_CONSTRAINTS.duration.max,
      `최대 ${SKILL_CONSTRAINTS.duration.max}턴`,
    ),
});

export const customSkillSchema = z.discriminatedUnion("type", [
  attackSchema,
  healSchema,
  buffSchema,
  debuffSchema,
]);

export type CustomSkillFormData = z.infer<typeof customSkillSchema>;
