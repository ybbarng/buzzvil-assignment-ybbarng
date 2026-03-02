import { describe, expect, it } from "vitest";
import type { CharacterSnapshot } from "@/types/battle";
import type { RoundEvent } from "@/types/battle-event";
import { formatEvent } from "./event-formatter";

const snap: CharacterSnapshot = {
  name: "테스터",
  baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 15 },
  currentHp: 100,
  currentMp: 50,
  isDefending: false,
  buffs: [],
};

describe("formatEvent", () => {
  it("round-start 이벤트를 포맷한다", () => {
    const event: RoundEvent = {
      type: "round-start",
      round: 3,
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe("── 3 라운드 ──");
  });

  it("defend 이벤트를 포맷한다 (받침 있음)", () => {
    const event: RoundEvent = {
      type: "defend",
      round: 1,
      actor: "player",
      actorName: "전투원",
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe(
      "전투원이 방어 태세를 취하여 받는 피해가 50% 감소합니다.",
    );
  });

  it("defend 이벤트를 포맷한다 (받침 없음)", () => {
    const event: RoundEvent = {
      type: "defend",
      round: 1,
      actor: "enemy",
      actorName: "드래고",
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe(
      "드래고가 방어 태세를 취하여 받는 피해가 50% 감소합니다.",
    );
  });

  it("speed-compare 이벤트를 포맷한다", () => {
    const event: RoundEvent = {
      type: "speed-compare",
      round: 1,
      firstName: "테스터",
      firstSpd: 15,
      secondName: "훈련 로봇",
      secondSpd: 7,
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe(
      "테스터의 속도(15) > 훈련 로봇의 속도(7), 테스터가 먼저 행동합니다.",
    );
  });

  it("speed-compare: 속도 동일 시 간략한 형식", () => {
    const event: RoundEvent = {
      type: "speed-compare",
      round: 1,
      firstName: "테스터",
      firstSpd: 10,
      secondName: "적",
      secondSpd: 10,
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe("테스터가 먼저 행동합니다.");
  });

  it("skill-use 이벤트를 포맷한다 (MP 소비 있음)", () => {
    const event: RoundEvent = {
      type: "skill-use",
      round: 1,
      actor: "player",
      actorName: "테스터",
      targetName: "훈련 로봇",
      skillName: "강타",
      skillType: "attack",
      mpCost: 10,
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe("테스터가 강타를 시전! (MP -10)");
  });

  it("skill-use 이벤트를 포맷한다 (MP 소비 없음)", () => {
    const event: RoundEvent = {
      type: "skill-use",
      round: 1,
      actor: "player",
      actorName: "테스터",
      targetName: "훈련 로봇",
      skillName: "공격",
      skillType: "attack",
      mpCost: 0,
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe("테스터가 공격을 시전!");
  });

  it("skill-effect(attack) 이벤트를 포맷한다", () => {
    const event: RoundEvent = {
      type: "skill-effect",
      round: 1,
      actor: "player",
      actorName: "테스터",
      targetName: "훈련 로봇",
      skillName: "강타",
      skillType: "attack",
      value: 25,
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe("테스터의 강타! 훈련 로봇에게 25 데미지!");
  });

  it("skill-effect(heal) 이벤트를 포맷한다", () => {
    const event: RoundEvent = {
      type: "skill-effect",
      round: 2,
      actor: "enemy",
      actorName: "적",
      targetName: "테스터",
      skillName: "회복",
      skillType: "heal",
      value: 20,
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe("적의 회복! HP 20 회복!");
  });

  it("skill-effect(buff) 이벤트를 포맷한다", () => {
    const event: RoundEvent = {
      type: "skill-effect",
      round: 1,
      actor: "player",
      actorName: "테스터",
      targetName: "적",
      skillName: "강화",
      skillType: "buff",
      value: 5,
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe("테스터의 강화! 능력치가 강화되었습니다.");
  });

  it("skill-effect(debuff) 이벤트를 포맷한다", () => {
    const event: RoundEvent = {
      type: "skill-effect",
      round: 1,
      actor: "enemy",
      actorName: "적",
      targetName: "테스터",
      skillName: "약화",
      skillType: "debuff",
      value: 5,
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe(
      "적의 약화! 테스터의 능력치가 약화되었습니다.",
    );
  });

  it("buff-expire 이벤트를 포맷한다", () => {
    const event: RoundEvent = {
      type: "buff-expire",
      round: 3,
      targetName: "테스터",
      buffTarget: "atk",
      wasBuff: true,
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe("테스터의 ATK 강화 효과가 만료되었습니다.");
  });

  it("buff-expire(디버프) 이벤트를 포맷한다", () => {
    const event: RoundEvent = {
      type: "buff-expire",
      round: 3,
      targetName: "적",
      buffTarget: "def",
      wasBuff: false,
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe("적의 DEF 약화 효과가 만료되었습니다.");
  });

  it("battle-end(win) 이벤트를 포맷한다", () => {
    const event: RoundEvent = {
      type: "battle-end",
      round: 5,
      outcome: "win",
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe("전투에서 승리했습니다!");
  });

  it("battle-end(lose) 이벤트를 포맷한다", () => {
    const event: RoundEvent = {
      type: "battle-end",
      round: 5,
      outcome: "lose",
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe("전투에서 패배했습니다...");
  });

  it("battle-end(draw) 이벤트를 포맷한다", () => {
    const event: RoundEvent = {
      type: "battle-end",
      round: 20,
      outcome: "draw",
      playerSnapshot: snap,
      enemySnapshot: snap,
    };
    expect(formatEvent(event)).toBe("무승부로 전투가 종료되었습니다.");
  });
});
