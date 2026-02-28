import { afterEach, describe, expect, it, vi } from "vitest";
import type { BattleCharacter } from "@/types/battle";
import { determineFirstMover } from "./turn";

function makeCharacter(spd: number): BattleCharacter {
  return {
    name: "테스트",
    baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd },
    currentHp: 100,
    currentMp: 50,
    skills: [],
    isDefending: false,
    buffs: [],
  };
}

describe("determineFirstMover", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("플레이어 SPD가 높으면 player를 반환한다", () => {
    const player = makeCharacter(20);
    const enemy = makeCharacter(10);
    expect(determineFirstMover(player, enemy)).toBe("player");
  });

  it("적 SPD가 높으면 enemy를 반환한다", () => {
    const player = makeCharacter(10);
    const enemy = makeCharacter(20);
    expect(determineFirstMover(player, enemy)).toBe("enemy");
  });

  it("SPD가 같으면 랜덤으로 player를 반환할 수 있다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.3);
    const player = makeCharacter(10);
    const enemy = makeCharacter(10);
    expect(determineFirstMover(player, enemy)).toBe("player");
  });

  it("SPD가 같으면 랜덤으로 enemy를 반환할 수 있다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.7);
    const player = makeCharacter(10);
    const enemy = makeCharacter(10);
    expect(determineFirstMover(player, enemy)).toBe("enemy");
  });
});
