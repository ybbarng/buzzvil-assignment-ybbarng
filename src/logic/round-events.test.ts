import { describe, expect, it, vi } from "vitest";
import type { BattleCharacter } from "@/types/battle";
import type { Skill } from "@/types/skill";
import { eventsToLegacyLogs } from "./battle-log";
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

    // round-start, speed-compare, action(선공), action(후공)
    const types = result.events.map((e) => e.type);
    expect(types[0]).toBe("round-start");
    expect(types).toContain("speed-compare");

    const actions = result.events.filter((e) => e.type === "action");
    expect(actions).toHaveLength(2);

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

    const actions = result.events.filter((e) => e.type === "action");
    expect(actions).toHaveLength(1);
    expect(actions[0].actorName).toBe("훈련 로봇");

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

  it("eventsToLegacyLogs가 ActionEvent만 변환한다", () => {
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

    const legacyLogs = eventsToLegacyLogs(result.events);
    expect(legacyLogs).toHaveLength(2);
    expect(legacyLogs[0].actor).toBe("테스터");
    expect(legacyLogs[0].skillType).toBe("attack");
    expect(legacyLogs[1].actor).toBe("훈련 로봇");

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
