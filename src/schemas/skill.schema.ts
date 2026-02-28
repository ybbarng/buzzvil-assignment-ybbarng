import { z } from "zod/v4";

const baseFields = {
  name: z
    .string()
    .min(1, "스킬 이름을 입력해주세요")
    .max(8, "스킬 이름은 8자 이하로 입력해주세요"),
  mpCost: z.number().int().min(1, "최소 1").max(30, "최대 30"),
};

const attackSchema = z.object({
  ...baseFields,
  type: z.literal("attack"),
  multiplier: z.number().min(1.0).max(3.0),
});

const healSchema = z.object({
  ...baseFields,
  type: z.literal("heal"),
  healAmount: z.number().int().min(10, "최소 10").max(50, "최대 50"),
});

const buffSchema = z.object({
  ...baseFields,
  type: z.literal("buff"),
  target: z.enum(["atk", "def"]),
  value: z.number().int().min(1, "최소 1").max(10, "최대 10"),
  duration: z.number().int().min(1, "최소 1턴").max(5, "최대 5턴"),
});

const debuffSchema = z.object({
  ...baseFields,
  type: z.literal("debuff"),
  target: z.enum(["atk", "def"]),
  value: z.number().int().min(1, "최소 1").max(10, "최대 10"),
  duration: z.number().int().min(1, "최소 1턴").max(5, "최대 5턴"),
});

export const customSkillSchema = z.discriminatedUnion("type", [
  attackSchema,
  healSchema,
  buffSchema,
  debuffSchema,
]);

export type CustomSkillFormData = z.infer<typeof customSkillSchema>;
