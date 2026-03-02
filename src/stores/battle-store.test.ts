import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CharacterSnapshot } from "@/types/battle";
import type { RoundEvent } from "@/types/battle-event";
import { useBattleStore } from "./battle-store";

function getPlayer() {
  const player = useBattleStore.getState().player;
  if (!player) throw new Error("player is not initialized");
  return player;
}

function getEnemy() {
  const enemy = useBattleStore.getState().enemy;
  if (!enemy) throw new Error("enemy is not initialized");
  return enemy;
}

const playerSnapshot: CharacterSnapshot = {
  name: "플레이어",
  baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 15 },
  currentHp: 100,
  currentMp: 50,
  isDefending: false,
  buffs: [],
};

const enemySnapshot: CharacterSnapshot = {
  name: "적",
  baseStats: { hp: 80, mp: 40, atk: 15, def: 8, spd: 10 },
  currentHp: 80,
  currentMp: 40,
  isDefending: false,
  buffs: [],
};

function createReplayEvents(): RoundEvent[] {
  return [
    {
      type: "round-start",
      round: 1,
      playerSnapshot,
      enemySnapshot,
    },
    {
      type: "speed-compare",
      round: 1,
      firstName: "플레이어",
      firstSpd: 15,
      secondName: "적",
      secondSpd: 10,
      playerSnapshot,
      enemySnapshot,
    },
    {
      type: "skill-use",
      round: 1,
      actor: "player",
      actorName: "플레이어",
      targetName: "적",
      skillName: "공격",
      skillType: "attack",
      mpCost: 0,
      playerSnapshot,
      enemySnapshot: { ...enemySnapshot, currentHp: 60 },
    },
    {
      type: "skill-effect",
      round: 1,
      actor: "player",
      actorName: "플레이어",
      targetName: "적",
      skillName: "공격",
      skillType: "attack",
      value: 20,
      playerSnapshot,
      enemySnapshot: { ...enemySnapshot, currentHp: 60 },
    },
    {
      type: "battle-end",
      round: 1,
      outcome: "win",
      playerSnapshot,
      enemySnapshot: { ...enemySnapshot, currentHp: 0 },
    },
  ];
}

describe("battle-store", () => {
  beforeEach(() => {
    useBattleStore.getState().setAnimationEnabled(false);
  });

  afterEach(() => {
    useBattleStore.getState().reset();
    vi.restoreAllMocks();
  });

  it("initBattle로 전투를 초기화한다", () => {
    const stats = { hp: 100, mp: 50, atk: 20, def: 10, spd: 15 };
    const skills = [
      {
        name: "공격",
        type: "attack" as const,
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      { name: "방어", type: "defend" as const, mpCost: 0, isDefault: true },
    ];

    useBattleStore.getState().initBattle("테스터", stats, skills, "easy");
    const state = useBattleStore.getState();

    expect(state.player?.name).toBe("테스터");
    expect(state.player?.currentHp).toBe(100);
    expect(state.enemy?.name).toBe("훈련 로봇");
    expect(state.round).toBe(1);
    expect(state.outcome).toBeNull();

    // 초기 round-start 이벤트가 events에 포함되어야 한다
    expect(state.events).toHaveLength(1);
    expect(state.events[0].type).toBe("round-start");
    expect(state.events[0].round).toBe(1);
  });

  it("공격 시 적 HP가 감소한다", () => {
    // SPD를 높게 해서 플레이어가 선공하도록
    const stats = { hp: 100, mp: 50, atk: 20, def: 10, spd: 99 };
    const skills = [
      {
        name: "공격",
        type: "attack" as const,
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      { name: "방어", type: "defend" as const, mpCost: 0, isDefault: true },
    ];

    useBattleStore.getState().initBattle("테스터", stats, skills, "easy");
    const enemyHpBefore = getEnemy().currentHp;

    useBattleStore.getState().executePlayerAction(0); // 공격

    const enemyHpAfter = getEnemy().currentHp;
    expect(enemyHpAfter).toBeLessThan(enemyHpBefore);
  });

  it("방어 후 받는 데미지가 감소한다", () => {
    // 적 AI가 항상 기본 공격(index 0)을 선택하도록 고정
    vi.spyOn(Math, "random").mockReturnValue(0.9);

    // SPD를 낮게 해서 적이 선공하도록
    const stats = { hp: 100, mp: 50, atk: 20, def: 10, spd: 1 };
    const skills = [
      {
        name: "공격",
        type: "attack" as const,
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      { name: "방어", type: "defend" as const, mpCost: 0, isDefault: true },
    ];

    // 공격 시 받는 데미지
    useBattleStore.getState().initBattle("테스터", stats, skills, "easy");
    useBattleStore.getState().executePlayerAction(0);
    const hpAfterAttack = getPlayer().currentHp;
    const damageWithoutDefend = 100 - hpAfterAttack;

    // 방어 시 받는 데미지
    useBattleStore.getState().reset();
    useBattleStore.getState().setAnimationEnabled(false);
    useBattleStore.getState().initBattle("테스터", stats, skills, "easy");
    useBattleStore.getState().executePlayerAction(1);
    const hpAfterDefend = getPlayer().currentHp;
    const damageWithDefend = 100 - hpAfterDefend;

    expect(damageWithDefend).toBeLessThan(damageWithoutDefend);
  });

  it("라운드가 진행된다", () => {
    const stats = { hp: 100, mp: 50, atk: 20, def: 10, spd: 15 };
    const skills = [
      {
        name: "공격",
        type: "attack" as const,
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      { name: "방어", type: "defend" as const, mpCost: 0, isDefault: true },
    ];

    useBattleStore.getState().initBattle("테스터", stats, skills, "easy");
    useBattleStore.getState().executePlayerAction(0);

    expect(useBattleStore.getState().round).toBe(2);
  });

  it("액션 실행 후 다음 round-start가 events 마지막에 추가된다", () => {
    const stats = { hp: 100, mp: 50, atk: 20, def: 10, spd: 99 };
    const skills = [
      {
        name: "공격",
        type: "attack" as const,
        mpCost: 0,
        multiplier: 1.0,
        isDefault: true,
      },
      { name: "방어", type: "defend" as const, mpCost: 0, isDefault: true },
    ];

    useBattleStore.getState().initBattle("테스터", stats, skills, "easy");
    useBattleStore.getState().executePlayerAction(0);

    const state = useBattleStore.getState();
    const lastEvent = state.events[state.events.length - 1];
    expect(lastEvent.type).toBe("round-start");
    expect(lastEvent.round).toBe(2);
  });

  describe("리플레이", () => {
    it("initReplay로 리플레이를 초기화한다", () => {
      const events = createReplayEvents();
      useBattleStore.getState().initReplay(events);

      const state = useBattleStore.getState();
      expect(state.isReplaying).toBe(true);
      expect(state.isReplayPaused).toBe(false);
      expect(state.allReplayEvents).toHaveLength(events.length);
      expect(state.events).toHaveLength(1);
      expect(state.events[0].type).toBe("round-start");
      expect(state.pendingEvents).toHaveLength(events.length - 1);
      expect(state.isAnimating).toBe(true);
      expect(state.player?.name).toBe("플레이어");
      expect(state.enemy?.name).toBe("적");
      expect(state.displayPlayer?.name).toBe("플레이어");
      expect(state.displayEnemy?.name).toBe("적");
    });

    it("toggleReplayPause로 일시정지를 토글한다", () => {
      useBattleStore.getState().initReplay(createReplayEvents());

      expect(useBattleStore.getState().isReplayPaused).toBe(false);
      useBattleStore.getState().toggleReplayPause();
      expect(useBattleStore.getState().isReplayPaused).toBe(true);
      useBattleStore.getState().toggleReplayPause();
      expect(useBattleStore.getState().isReplayPaused).toBe(false);
    });

    it("seekReplay로 특정 이벤트 위치로 이동한다", () => {
      const events = createReplayEvents();
      useBattleStore.getState().initReplay(events);

      // 세 번째 이벤트(index 2)로 이동
      useBattleStore.getState().seekReplay(2);

      const state = useBattleStore.getState();
      expect(state.events).toHaveLength(3); // 0, 1, 2
      expect(state.pendingEvents).toHaveLength(events.length - 3);
      expect(state.isReplayPaused).toBe(true);
      expect(state.displayPlayer).toBe(events[2].playerSnapshot);
      expect(state.displayEnemy).toBe(events[2].enemySnapshot);
    });

    it("seekReplay는 범위를 벗어난 인덱스를 클램핑한다", () => {
      const events = createReplayEvents();
      useBattleStore.getState().initReplay(events);

      // 범위 초과
      useBattleStore.getState().seekReplay(999);
      expect(useBattleStore.getState().events).toHaveLength(events.length);
      expect(useBattleStore.getState().pendingEvents).toHaveLength(0);

      // 음수
      useBattleStore.getState().seekReplay(-1);
      expect(useBattleStore.getState().events).toHaveLength(1);
      expect(useBattleStore.getState().pendingEvents).toHaveLength(
        events.length - 1,
      );
    });

    it("seekReplay로 마지막 이벤트로 가면 isAnimating이 false가 된다", () => {
      const events = createReplayEvents();
      useBattleStore.getState().initReplay(events);

      useBattleStore.getState().seekReplay(events.length - 1);

      expect(useBattleStore.getState().isAnimating).toBe(false);
      expect(useBattleStore.getState().pendingEvents).toHaveLength(0);
    });

    it("seekReplay로 battle-end 이벤트에 가면 outcome이 설정된다", () => {
      const events = createReplayEvents();
      useBattleStore.getState().initReplay(events);

      // 마지막 이벤트가 battle-end
      useBattleStore.getState().seekReplay(events.length - 1);

      expect(useBattleStore.getState().outcome).toBe("win");
    });

    it("seekReplay로 skill-use 이벤트에 가면 activeActor가 설정된다", () => {
      const events = createReplayEvents();
      useBattleStore.getState().initReplay(events);

      // index 2가 skill-use (actor: "player")
      useBattleStore.getState().seekReplay(2);

      expect(useBattleStore.getState().activeActor).toBe("player");
    });

    it("리플레이 모드에서 advanceEvent는 round-start를 자동 추가하지 않는다", () => {
      // round-start와 speed-compare만 있는 이벤트 (battle-end 없이)
      const events: RoundEvent[] = [
        {
          type: "round-start",
          round: 1,
          playerSnapshot,
          enemySnapshot,
        },
        {
          type: "speed-compare",
          round: 1,
          firstName: "플레이어",
          firstSpd: 15,
          secondName: "적",
          secondSpd: 10,
          playerSnapshot,
          enemySnapshot,
        },
      ];

      useBattleStore.getState().initReplay(events);
      // pending의 speed-compare를 advance
      useBattleStore.getState().advanceEvent();

      const state = useBattleStore.getState();
      // 리플레이 모드에서는 자동으로 round-start를 추가하지 않음
      expect(state.pendingEvents).toHaveLength(0);
      expect(state.isAnimating).toBe(false);
    });

    it("allReplayEvents가 비어있으면 seekReplay를 무시한다", () => {
      // initReplay 전 (allReplayEvents가 빈 상태)
      useBattleStore.getState().seekReplay(0);

      // 에러 없이 아무 변화 없음
      expect(useBattleStore.getState().events).toHaveLength(0);
    });

    it("reset으로 리플레이 상태가 초기화된다", () => {
      useBattleStore.getState().initReplay(createReplayEvents());
      useBattleStore.getState().reset();

      const state = useBattleStore.getState();
      expect(state.isReplaying).toBe(false);
      expect(state.isReplayPaused).toBe(false);
      expect(state.allReplayEvents).toHaveLength(0);
    });
  });
});
