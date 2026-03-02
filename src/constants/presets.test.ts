import { describe, expect, it } from "vitest";
import {
  getPresetsByRole,
  getPresetsBySubRole,
  HERO_PRESETS,
} from "@/constants/presets";
import { nameStatSchema } from "@/schemas/name-stat.schema";

// 스탯 총합, 범위, ID 고유, 서브역할군 유효성은
// ow-hero-meta.test.ts + generateHeroPreset() 런타임 assertion에서 검증.
// 이 파일은 presets.ts 고유의 함수와 통합 검증만 담당한다.

describe("HERO_PRESETS", () => {
  it("역할군별 인원 수가 올바르다", () => {
    const tanks = getPresetsByRole("tank");
    const damage = getPresetsByRole("damage");
    const support = getPresetsByRole("support");

    expect(tanks.length).toBe(14);
    expect(damage.length).toBe(22);
    expect(support.length).toBe(14);
    expect(tanks.length + damage.length + support.length).toBe(
      HERO_PRESETS.length,
    );
  });

  it("getPresetsByRole이 해당 역할만 반환한다", () => {
    const tanks = getPresetsByRole("tank");
    expect(tanks.every((h) => h.role === "tank")).toBe(true);

    const damage = getPresetsByRole("damage");
    expect(damage.every((h) => h.role === "damage")).toBe(true);

    const support = getPresetsByRole("support");
    expect(support.every((h) => h.role === "support")).toBe(true);
  });

  it("getPresetsBySubRole이 해당 서브역할만 반환한다", () => {
    const initiators = getPresetsBySubRole("initiator");
    expect(initiators.every((h) => h.subRole === "initiator")).toBe(true);
    expect(initiators.length).toBeGreaterThan(0);
  });

  it("모든 프리셋이 폼 유효성 검증을 통과해야 한다", () => {
    for (const hero of HERO_PRESETS) {
      const result = nameStatSchema.safeParse({
        name: hero.name,
        stats: hero.stats,
      });
      expect(
        result.success,
        `${hero.name}이 폼 검증 실패: ${!result.success ? JSON.stringify(result.error.issues) : ""}`,
      ).toBe(true);
    }
  });
});
