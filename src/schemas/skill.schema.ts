import { z } from "zod/v4";

/** 스킬 필드별 min/max 범위 — 스키마 검증과 슬라이더 UI에서 공유 */
export const SKILL_RANGES = {
  mpCost: { min: 1, max: 30 },
  multiplier: { min: 1.0, max: 3.0, step: 0.1 },
  healAmount: { min: 10, max: 50 },
  value: { min: 1, max: 10 },
  duration: { min: 1, max: 5 },
} as const;

const baseFields = {
  name: z
    .string()
    .min(1, "스킬 이름을 입력해주세요")
    .max(8, "스킬 이름은 8자 이하로 입력해주세요"),
  mpCost: z
    .number()
    .int()
    .min(SKILL_RANGES.mpCost.min, `최소 ${SKILL_RANGES.mpCost.min}`)
    .max(SKILL_RANGES.mpCost.max, `최대 ${SKILL_RANGES.mpCost.max}`),
};

const attackSchema = z.object({
  ...baseFields,
  type: z.literal("attack"),
  multiplier: z
    .number()
    .min(SKILL_RANGES.multiplier.min)
    .max(SKILL_RANGES.multiplier.max),
});

const healSchema = z.object({
  ...baseFields,
  type: z.literal("heal"),
  healAmount: z
    .number()
    .int()
    .min(SKILL_RANGES.healAmount.min, `최소 ${SKILL_RANGES.healAmount.min}`)
    .max(SKILL_RANGES.healAmount.max, `최대 ${SKILL_RANGES.healAmount.max}`),
});

const buffSchema = z.object({
  ...baseFields,
  type: z.literal("buff"),
  target: z.enum(["atk", "def"]),
  value: z
    .number()
    .int()
    .min(SKILL_RANGES.value.min, `최소 ${SKILL_RANGES.value.min}`)
    .max(SKILL_RANGES.value.max, `최대 ${SKILL_RANGES.value.max}`),
  duration: z
    .number()
    .int()
    .min(SKILL_RANGES.duration.min, `최소 ${SKILL_RANGES.duration.min}턴`)
    .max(SKILL_RANGES.duration.max, `최대 ${SKILL_RANGES.duration.max}턴`),
});

const debuffSchema = z.object({
  ...baseFields,
  type: z.literal("debuff"),
  target: z.enum(["atk", "def"]),
  value: z
    .number()
    .int()
    .min(SKILL_RANGES.value.min, `최소 ${SKILL_RANGES.value.min}`)
    .max(SKILL_RANGES.value.max, `최대 ${SKILL_RANGES.value.max}`),
  duration: z
    .number()
    .int()
    .min(SKILL_RANGES.duration.min, `최소 ${SKILL_RANGES.duration.min}턴`)
    .max(SKILL_RANGES.duration.max, `최대 ${SKILL_RANGES.duration.max}턴`),
});

export const customSkillSchema = z.discriminatedUnion("type", [
  attackSchema,
  healSchema,
  buffSchema,
  debuffSchema,
]);

export type CustomSkillFormData = z.infer<typeof customSkillSchema>;
