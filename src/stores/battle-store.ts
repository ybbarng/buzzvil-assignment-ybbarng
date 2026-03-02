import { create } from "zustand";
import { ENEMIES } from "@/constants/enemies";
import { eventsToLegacyLogs } from "@/logic/battle-log";
import { generateRoundEvents } from "@/logic/round-events";
import { toSnapshot } from "@/logic/snapshot";
import { useGameStore } from "@/stores/game-store";
import type {
  BattleCharacter,
  BattleLogEntry,
  CharacterSnapshot,
} from "@/types/battle";
import type { RoundEvent } from "@/types/battle-event";
import type { Stats } from "@/types/character";
import type { BattleOutcome, Difficulty } from "@/types/game";
import type { Skill } from "@/types/skill";

interface BattleState {
  // 로직용 최종 상태
  player: BattleCharacter | null;
  enemy: BattleCharacter | null;
  difficulty: Difficulty;
  round: number;
  outcome: BattleOutcome | null;

  // 레거시 호환
  logs: BattleLogEntry[];

  // 이벤트 시스템
  events: RoundEvent[];
  pendingEvents: RoundEvent[];
  displayPlayer: CharacterSnapshot | null;
  displayEnemy: CharacterSnapshot | null;
  isAnimating: boolean;
  animationEnabled: boolean;
  activeActor: "player" | "enemy" | null;

  initBattle: (
    name: string,
    stats: Stats,
    skills: Skill[],
    difficulty: Difficulty,
  ) => void;
  executePlayerAction: (skillIndex: number) => void;
  advanceEvent: () => void;
  flushEvents: () => void;
  setAnimationEnabled: (enabled: boolean) => void;
  reset: () => void;
}

function createCharacter(
  name: string,
  stats: Stats,
  skills: Skill[],
): BattleCharacter {
  return {
    name,
    baseStats: { ...stats },
    currentHp: stats.hp,
    currentMp: stats.mp,
    skills,
    isDefending: false,
    buffs: [],
  };
}

export const useBattleStore = create<BattleState>((set, get) => ({
  player: null,
  enemy: null,
  difficulty: "normal" as Difficulty,
  round: 1,
  outcome: null,
  logs: [],

  events: [],
  pendingEvents: [],
  displayPlayer: null,
  displayEnemy: null,
  isAnimating: false,
  animationEnabled: true,
  activeActor: null,

  initBattle: (name, stats, skills, difficulty) => {
    const enemyConfig = ENEMIES[difficulty];
    const player = createCharacter(name, stats, skills);
    const enemy = createCharacter(
      enemyConfig.name,
      enemyConfig.stats,
      enemyConfig.skills,
    );
    const playerSnapshot = toSnapshot(player);
    const enemySnapshot = toSnapshot(enemy);
    set({
      player,
      enemy,
      difficulty,
      round: 1,
      outcome: null,
      logs: [],
      events: [
        {
          type: "round-start",
          round: 1,
          playerSnapshot,
          enemySnapshot,
        },
      ],
      pendingEvents: [],
      displayPlayer: playerSnapshot,
      displayEnemy: enemySnapshot,
      isAnimating: false,
      activeActor: null,
    });
  },

  executePlayerAction: (skillIndex) => {
    const state = get();
    if (!state.player || !state.enemy || state.outcome) return;

    const playerSkill = state.player.skills[skillIndex];
    if (!playerSkill) return;
    // 플레이어 MP 부족은 여기서 사전 차단한다.
    // 적의 MP 부족은 generateRoundEvents 내에서 skip-turn 이벤트로 처리된다.
    if (playerSkill.mpCost > state.player.currentMp) return;

    const result = generateRoundEvents(
      state.player,
      state.enemy,
      state.round,
      playerSkill,
      state.difficulty,
    );

    // 레거시 로그 변환
    const newLegacyLogs = eventsToLegacyLogs(result.events);

    set({
      player: result.finalPlayer,
      enemy: result.finalEnemy,
      round: result.nextRound,
      outcome: result.outcome,
      logs: [...state.logs, ...newLegacyLogs],
      pendingEvents: [...result.events],
      isAnimating: true,
    });

    // 애니메이션 비활성화 시 즉시 모든 이벤트 처리
    if (!get().animationEnabled) {
      get().flushEvents();
    }
  },

  advanceEvent: () => {
    const state = get();
    if (state.pendingEvents.length === 0) return;

    const [event, ...remaining] = state.pendingEvents;
    const newEvents = [...state.events, event];

    const updates: Partial<BattleState> = {
      events: newEvents,
      pendingEvents: remaining,
      displayPlayer: event.playerSnapshot,
      displayEnemy: event.enemySnapshot,
      activeActor:
        event.type === "skill-use" || event.type === "skill-effect"
          ? event.actor
          : null,
    };

    if (remaining.length === 0) {
      // 마지막 이벤트 처리 완료 — 다음 round-start 추가 또는 애니메이션 종료
      if (event.type !== "round-start" && !state.outcome) {
        // 전투 계속: 다음 round-start를 pendingEvents에 추가
        updates.pendingEvents = [
          {
            type: "round-start",
            round: state.round,
            playerSnapshot: event.playerSnapshot,
            enemySnapshot: event.enemySnapshot,
          },
        ];
      } else {
        // round-start 표시 완료 또는 전투 종료: 액션 버튼 활성화
        updates.isAnimating = false;
        updates.activeActor = null;
      }
    }

    set(updates);

    // battle-end 이벤트 처리: 결과 화면 전환
    if (event.type === "battle-end") {
      const { outcome, round } = get();
      if (outcome) {
        useGameStore.getState().showResult(outcome, round - 1);
      }
    }
  },

  flushEvents: () => {
    const state = get();
    if (state.pendingEvents.length === 0) return;

    const allEvents = [...state.events, ...state.pendingEvents];
    const lastEvent = state.pendingEvents[state.pendingEvents.length - 1];

    // 전투 종료가 아니면 다음 round-start도 추가
    if (!state.outcome) {
      allEvents.push({
        type: "round-start",
        round: state.round,
        playerSnapshot: lastEvent.playerSnapshot,
        enemySnapshot: lastEvent.enemySnapshot,
      });
    }

    set({
      events: allEvents,
      pendingEvents: [],
      displayPlayer: lastEvent.playerSnapshot,
      displayEnemy: lastEvent.enemySnapshot,
      isAnimating: false,
      activeActor: null,
    });

    // battle-end 이벤트가 포함되어 있으면 결과 화면 전환
    const battleEnd = state.pendingEvents.find((e) => e.type === "battle-end");
    if (battleEnd) {
      const { outcome, round } = get();
      if (outcome) {
        useGameStore.getState().showResult(outcome, round - 1);
      }
    }
  },

  setAnimationEnabled: (enabled) => set({ animationEnabled: enabled }),

  reset: () =>
    set({
      player: null,
      enemy: null,
      difficulty: "normal" as Difficulty,
      round: 1,
      outcome: null,
      logs: [],
      events: [],
      pendingEvents: [],
      displayPlayer: null,
      displayEnemy: null,
      isAnimating: false,
      activeActor: null,
    }),
}));
