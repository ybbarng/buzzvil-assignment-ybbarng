import { describe, expect, it, vi } from "vitest";
import type { BattleCharacter } from "@/types/battle";
import type { SkillEffectEvent, SkillUseEvent } from "@/types/battle-event";
import type { Skill } from "@/types/skill";
import { generateRoundEvents } from "./round-events";

function makeCharacter(
  overrides: Partial<BattleCharacter> = {},
): BattleCharacter {
  return {
    name: "테스터",
    baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 99 },
    currentHp: 100,
    currentMp: 50,
    skills: [
      {
        name: "공격",
        type: "attack",
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      { name: "방어", type: "defend", mpCost: 0, isDefault: true },
    ],
    isDefending: false,
    buffs: [],
    ...overrides,
  };
}

const ENEMY_SKILLS: Skill[] = [
  {
    name: "공격",
    type: "attack",
    mpCost: 0,
    multiplier: 1.0,
    isDefault: true,
  },
  { name: "방어", type: "defend", mpCost: 0, isDefault: true },
];

describe("generateRoundEvents", () => {
  it("기본 라운드 이벤트 시퀀스를 생성한다", () => {
    // 적 AI가 공격(index 0)을 선택하도록 고정
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    const player = makeCharacter();
    const enemy = makeCharacter({
      name: "훈련 로봇",
      baseStats: { hp: 80, mp: 30, atk: 10, def: 8, spd: 7 },
      currentHp: 80,
      currentMp: 30,
      skills: ENEMY_SKILLS,
    });

    const attackSkill = player.skills[0];
    const result = generateRoundEvents(player, enemy, 1, attackSkill, "easy");

    // speed-compare, skill-use/effect(선공), skill-use/effect(후공) — round-start는 스토어에서 별도 관리
    const types = result.events.map((e) => e.type);
    expect(types).not.toContain("round-start");
    expect(types[0]).toBe("speed-compare");

    const skillUses = result.events.filter((e) => e.type === "skill-use");
    expect(skillUses).toHaveLength(2);
    const skillEffects = result.events.filter((e) => e.type === "skill-effect");
    expect(skillEffects).toHaveLength(2);

    expect(result.outcome).toBeNull();
    expect(result.nextRound).toBe(2);

    vi.restoreAllMocks();
  });

  it("방어 선택 시 defend 이벤트가 생성되고 action은 1개만", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    const player = makeCharacter();
    const enemy = makeCharacter({
      name: "훈련 로봇",
      baseStats: { hp: 80, mp: 30, atk: 10, def: 8, spd: 7 },
      currentHp: 80,
      currentMp: 30,
      skills: ENEMY_SKILLS,
    });

    const defendSkill = player.skills[1];
    const result = generateRoundEvents(player, enemy, 1, defendSkill, "easy");

    const types = result.events.map((e) => e.type);
    expect(types).toContain("defend");

    const skillEffects = result.events.filter((e) => e.type === "skill-effect");
    expect(skillEffects).toHaveLength(1);
    expect(skillEffects[0].actorName).toBe("훈련 로봇");

    vi.restoreAllMocks();
  });

  it("적 HP가 0 이하면 battle-end 이벤트를 생성한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    const player = makeCharacter({
      baseStats: { hp: 100, mp: 50, atk: 200, def: 10, spd: 99 },
    });
    const enemy = makeCharacter({
      name: "훈련 로봇",
      baseStats: { hp: 80, mp: 30, atk: 10, def: 8, spd: 7 },
      currentHp: 10,
      currentMp: 30,
      skills: ENEMY_SKILLS,
    });

    const attackSkill = player.skills[0];
    const result = generateRoundEvents(player, enemy, 1, attackSkill, "easy");

    expect(result.outcome).toBe("win");
    const battleEnd = result.events.find((e) => e.type === "battle-end");
    expect(battleEnd).toBeDefined();

    vi.restoreAllMocks();
  });

  it("HP가 0 이하인 캐릭터는 skip-turn(defeated) 이벤트를 생성한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    const player = makeCharacter();
    const enemy = makeCharacter({
      name: "훈련 로봇",
      baseStats: { hp: 80, mp: 30, atk: 10, def: 8, spd: 7 },
      currentHp: 0,
      currentMp: 30,
      skills: ENEMY_SKILLS,
    });

    const attackSkill = player.skills[0];
    const result = generateRoundEvents(player, enemy, 1, attackSkill, "easy");

    const skipEvents = result.events.filter((e) => e.type === "skip-turn");
    expect(skipEvents).toHaveLength(1);
    expect(skipEvents[0]).toMatchObject({
      reason: "defeated",
      actorName: "훈련 로봇",
    });

    vi.restoreAllMocks();
  });

  it("MP 부족 시 skip-turn(no-mp) 이벤트를 생성하고 스킬명을 포함한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    const highCostSkill: Skill = {
      name: "강타",
      type: "attack",
      mpCost: 100,
      multiplier: 2.0,
      isDefault: false,
    };
    const player = makeCharacter({
      currentMp: 0,
      skills: [
        highCostSkill,
        { name: "방어", type: "defend", mpCost: 0, isDefault: true },
      ],
    });
    const enemy = makeCharacter({
      name: "훈련 로봇",
      baseStats: { hp: 80, mp: 30, atk: 10, def: 8, spd: 7 },
      currentHp: 80,
      currentMp: 30,
      skills: ENEMY_SKILLS,
    });

    const result = generateRoundEvents(player, enemy, 1, highCostSkill, "easy");

    const skipEvents = result.events.filter((e) => e.type === "skip-turn");
    expect(skipEvents).toHaveLength(1);
    expect(skipEvents[0]).toMatchObject({
      reason: "no-mp",
      skillName: "강타",
    });

    vi.restoreAllMocks();
  });

  it("skill-use 이벤트에서 MP만 차감되고 skill-effect에서 효과가 적용된다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    const mpSkill: Skill = {
      name: "강타",
      type: "attack",
      mpCost: 10,
      multiplier: 1.5,
      isDefault: false,
    };
    const player = makeCharacter({
      currentMp: 50,
      skills: [
        mpSkill,
        { name: "방어", type: "defend", mpCost: 0, isDefault: true },
      ],
    });
    const enemy = makeCharacter({
      name: "훈련 로봇",
      baseStats: { hp: 80, mp: 30, atk: 10, def: 8, spd: 7 },
      currentHp: 80,
      currentMp: 30,
      skills: ENEMY_SKILLS,
    });

    const result = generateRoundEvents(player, enemy, 1, mpSkill, "easy");

    // player가 선공 (spd 99 > 7)
    const skillUse = result.events.find(
      (e): e is SkillUseEvent =>
        e.type === "skill-use" && e.actorName === "테스터",
    );
    expect(skillUse).toBeDefined();
    expect(skillUse?.playerSnapshot.currentMp).toBe(40); // 50 - 10

    const skillEffect = result.events.find(
      (e): e is SkillEffectEvent =>
        e.type === "skill-effect" && e.actorName === "테스터",
    );
    expect(skillEffect).toBeDefined();
    // 적의 HP가 감소했어야 함
    expect(skillEffect?.enemySnapshot.currentHp).toBeLessThan(80);

    vi.restoreAllMocks();
  });

  it("적 턴에서 skill-effect의 value가 양수이다", () => {
    // 적이 선공하도록 spd 설정
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    const player = makeCharacter({
      baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 1 },
    });
    const enemy = makeCharacter({
      name: "훈련 로봇",
      baseStats: { hp: 80, mp: 30, atk: 15, def: 8, spd: 99 },
      currentHp: 80,
      currentMp: 30,
      skills: ENEMY_SKILLS,
    });

    const attackSkill = player.skills[0];
    const result = generateRoundEvents(player, enemy, 1, attackSkill, "easy");

    const enemyEffect = result.events.find(
      (e): e is SkillEffectEvent =>
        e.type === "skill-effect" && e.actor === "enemy",
    );
    expect(enemyEffect).toBeDefined();
    expect(enemyEffect?.value).toBeGreaterThan(0);

    vi.restoreAllMocks();
  });

  it("버프 만료 시 buff-expire 이벤트를 생성한다", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    const player = makeCharacter({
      buffs: [{ target: "atk", value: 5, remainingTurns: 1 }],
    });
    const enemy = makeCharacter({
      name: "훈련 로봇",
      baseStats: { hp: 80, mp: 30, atk: 10, def: 8, spd: 7 },
      currentHp: 80,
      currentMp: 30,
      skills: ENEMY_SKILLS,
    });

    const attackSkill = player.skills[0];
    const result = generateRoundEvents(player, enemy, 1, attackSkill, "easy");

    const expireEvents = result.events.filter((e) => e.type === "buff-expire");
    expect(expireEvents).toHaveLength(1);
    expect(expireEvents[0].targetName).toBe("테스터");

    vi.restoreAllMocks();
  });
});
