import { describe, expect, it } from "vitest";
import type { BattleCharacter } from "@/types/battle";
import { checkBattleEnd } from "./battle-result";

function makeCharacter(hp: number): BattleCharacter {
  return {
    name: "테스트",
    baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 10 },
    currentHp: hp,
    currentMp: 50,
    skills: [],
    isDefending: false,
    buffs: [],
  };
}

describe("checkBattleEnd", () => {
  it("적 HP가 0이면 승리", () => {
    expect(checkBattleEnd(makeCharacter(50), makeCharacter(0), 5)).toBe("win");
  });

  it("플레이어 HP가 0이면 패배", () => {
    expect(checkBattleEnd(makeCharacter(0), makeCharacter(50), 5)).toBe("lose");
  });

  it("20라운드 초과 시 무승부", () => {
    expect(checkBattleEnd(makeCharacter(50), makeCharacter(50), 21)).toBe(
      "draw",
    );
  });

  it("아직 진행 중이면 null", () => {
    expect(checkBattleEnd(makeCharacter(50), makeCharacter(50), 5)).toBeNull();
  });
});
