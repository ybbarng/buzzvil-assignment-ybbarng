import { z } from "zod/v4";
import { STAT_RANGES, TOTAL_POINTS } from "@/constants/stats";

const statField = (key: keyof typeof STAT_RANGES) =>
  z.number().int().min(STAT_RANGES[key].min).max(STAT_RANGES[key].max);

export const nameStatSchema = z
  .object({
    name: z
      .string()
      .min(1, "이름을 입력해주세요")
      .max(10, "이름은 10자 이하로 입력해주세요"),
    stats: z.object({
      hp: statField("hp"),
      mp: statField("mp"),
      atk: statField("atk"),
      def: statField("def"),
      spd: statField("spd"),
    }),
  })
  .refine(
    (data) => {
      const total = Object.values(data.stats).reduce((a, b) => a + b, 0);
      return total === TOTAL_POINTS;
    },
    {
      message: `포인트를 모두 배분해주세요`,
      path: ["stats"],
    },
  );

export type NameStatFormData = z.infer<typeof nameStatSchema>;
