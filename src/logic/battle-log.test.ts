import { describe, expect, it } from "vitest";
import type { BattleCharacter, CharacterSnapshot } from "@/types/battle";
import type { RoundEvent } from "@/types/battle-event";
import { createLogEntry, eventsToLegacyLogs } from "./battle-log";

function makeCharacter(
  overrides: Partial<BattleCharacter> = {},
): BattleCharacter {
  return {
    name: "테스트",
    baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 10 },
    currentHp: 100,
    currentMp: 50,
    skills: [],
    isDefending: false,
    buffs: [],
    ...overrides,
  };
}

describe("createLogEntry", () => {
  it("attack: 데미지 값을 기록한다", () => {
    const actor = makeCharacter({ name: "플레이어" });
    const target = makeCharacter({ name: "적", currentHp: 80 });
    const targetAfter = makeCharacter({ name: "적", currentHp: 65 });

    const log = createLogEntry(
      1,
      actor,
      target,
      {
        name: "공격",
        type: "attack",
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      actor,
      targetAfter,
    );

    expect(log.skillType).toBe("attack");
    expect(log.value).toBe(15);
    expect(log.actor).toBe("플레이어");
  });

  it("heal: 회복량을 기록한다", () => {
    const actor = makeCharacter({ name: "적", currentHp: 50 });
    const actorAfter = makeCharacter({ name: "적", currentHp: 80 });
    const target = makeCharacter();

    const log = createLogEntry(
      2,
      actor,
      target,
      {
        name: "회복",
        type: "heal",
        mpCost: 15,
        healAmount: 30,
        isDefault: false,
      },
      actorAfter,
      target,
    );

    expect(log.skillType).toBe("heal");
    expect(log.value).toBe(30);
  });

  it("defend: value가 0이다", () => {
    const actor = makeCharacter();
    const target = makeCharacter();

    const log = createLogEntry(
      1,
      actor,
      target,
      { name: "방어", type: "defend", mpCost: 0, isDefault: true },
      actor,
      target,
    );

    expect(log.skillType).toBe("defend");
    expect(log.value).toBe(0);
  });

  it("debuff: 스킬 value를 기록한다", () => {
    const actor = makeCharacter();
    const target = makeCharacter();

    const log = createLogEntry(
      3,
      actor,
      target,
      {
        name: "약화",
        type: "debuff",
        mpCost: 15,
        target: "def",
        value: 5,
        duration: 2,
        isDefault: false,
      },
      actor,
      target,
    );

    expect(log.skillType).toBe("debuff");
    expect(log.value).toBe(5);
  });
});

const snap: CharacterSnapshot = {
  name: "테스트",
  baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 10 },
  currentHp: 100,
  currentMp: 50,
  isDefending: false,
  buffs: [],
};

describe("eventsToLegacyLogs", () => {
  it("skill-effect 이벤트를 변환한다", () => {
    const events: RoundEvent[] = [
      {
        type: "skill-effect",
        round: 1,
        actor: "player",
        actorName: "플레이어",
        targetName: "적",
        skillName: "공격",
        skillType: "attack",
        value: 15,
        playerSnapshot: snap,
        enemySnapshot: snap,
      },
      {
        type: "skill-effect",
        round: 1,
        actor: "enemy",
        actorName: "적",
        targetName: "플레이어",
        skillName: "공격",
        skillType: "attack",
        value: 10,
        playerSnapshot: snap,
        enemySnapshot: snap,
      },
    ];

    const logs = eventsToLegacyLogs(events);
    expect(logs).toHaveLength(2);
    expect(logs[0]).toEqual({
      round: 1,
      actor: "플레이어",
      skillName: "공격",
      skillType: "attack",
      value: 15,
    });
    expect(logs[1]).toEqual({
      round: 1,
      actor: "적",
      skillName: "공격",
      skillType: "attack",
      value: 10,
    });
  });

  it("defend 이벤트를 변환한다", () => {
    const events: RoundEvent[] = [
      {
        type: "defend",
        round: 1,
        actor: "player",
        actorName: "전투원",
        playerSnapshot: snap,
        enemySnapshot: snap,
      },
    ];

    const logs = eventsToLegacyLogs(events);
    expect(logs).toHaveLength(1);
    expect(logs[0]).toEqual({
      round: 1,
      actor: "전투원",
      skillName: "방어",
      skillType: "defend",
      value: 0,
    });
  });

  it("skill-effect와 defend만 변환하고 나머지는 무시한다", () => {
    const events: RoundEvent[] = [
      {
        type: "round-start",
        round: 1,
        playerSnapshot: snap,
        enemySnapshot: snap,
      },
      {
        type: "speed-compare",
        round: 1,
        firstName: "A",
        firstSpd: 10,
        secondName: "B",
        secondSpd: 5,
        playerSnapshot: snap,
        enemySnapshot: snap,
      },
      {
        type: "skill-effect",
        round: 1,
        actor: "player",
        actorName: "A",
        targetName: "B",
        skillName: "공격",
        skillType: "attack",
        value: 20,
        playerSnapshot: snap,
        enemySnapshot: snap,
      },
      {
        type: "defend",
        round: 1,
        actor: "enemy",
        actorName: "B",
        playerSnapshot: snap,
        enemySnapshot: snap,
      },
      {
        type: "buff-expire",
        round: 1,
        targetName: "A",
        buffTarget: "atk",
        wasBuff: true,
        playerSnapshot: snap,
        enemySnapshot: snap,
      },
    ];

    const logs = eventsToLegacyLogs(events);
    expect(logs).toHaveLength(2);
    expect(logs[0].skillType).toBe("attack");
    expect(logs[1].skillType).toBe("defend");
  });

  it("빈 배열이면 빈 배열을 반환한다", () => {
    expect(eventsToLegacyLogs([])).toEqual([]);
  });
});
