import { create } from "zustand";
import { ENEMIES } from "@/constants/enemies";
import { generateRoundEvents } from "@/logic/round-events";
import { toSnapshot } from "@/logic/snapshot";
import { useGameStore } from "@/stores/game-store";
import { useReplayStore } from "@/stores/replay-store";
import type { BattleCharacter, CharacterSnapshot } from "@/types/battle";
import type { RoundEvent } from "@/types/battle-event";
import type { Stats } from "@/types/character";
import type { BattleOutcome, Difficulty } from "@/types/game";
import { REPLAY_VERSION } from "@/types/replay";
import type { Skill } from "@/types/skill";

interface BattleState {
  // 로직용 최종 상태
  player: BattleCharacter | null;
  enemy: BattleCharacter | null;
  difficulty: Difficulty;
  round: number;
  outcome: BattleOutcome | null;

  // 리플레이
  isReplaying: boolean;
  isReplayPaused: boolean;
  allReplayEvents: RoundEvent[]; // initReplay 시 전체 이벤트 보관 (seek용)

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
  initReplay: (events: RoundEvent[]) => void;
  toggleReplayPause: () => void;
  seekReplay: (eventIndex: number) => void;
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

/** battle-end 이벤트에서 outcome을 추출하여 state에 설정하고 결과 화면 전환 */
function processBattleEnd(
  get: () => BattleState,
  set: (partial: Partial<BattleState>) => void,
  event: RoundEvent,
) {
  if (event.type !== "battle-end") return;
  // zustand의 set은 동기적이므로 get()은 최신 상태를 반환
  if (!get().outcome) {
    set({ outcome: event.outcome });
  }
  handleBattleEnd(get);
}

/** battle-end 후 리플레이 저장 + 결과 화면 전환 */
function handleBattleEnd(get: () => BattleState) {
  const { outcome, round, isReplaying, player, enemy, difficulty, events } =
    get();
  if (!outcome) return;
  // 이미 결과 화면으로 전환된 경우 중복 호출 방지 (seek 후 재생 재개 시)
  const currentPhase = useGameStore.getState().phase;
  if (currentPhase === "result" || currentPhase === "replay-result") return;
  if (isReplaying) {
    useGameStore.getState().showReplayResult(outcome, round - 1);
  } else {
    if (player && enemy) {
      useReplayStore.getState().save({
        version: REPLAY_VERSION,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        playerName: player.name,
        enemyName: enemy.name,
        difficulty,
        outcome,
        totalTurns: round - 1,
        events,
      });
    }
    useGameStore.getState().showResult(outcome, round - 1);
  }
}

export const useBattleStore = create<BattleState>((set, get) => ({
  player: null,
  enemy: null,
  difficulty: "normal",
  round: 1,
  outcome: null,
  isReplaying: false,
  isReplayPaused: false,
  allReplayEvents: [],

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

  initReplay: (replayEvents) => {
    if (replayEvents.length === 0) return;
    const [first, ...rest] = replayEvents;
    const snap = first.playerSnapshot;
    const enemySnap = first.enemySnapshot;
    // CharacterPanel 표시용 더미 캐릭터 (로직에는 사용하지 않음)
    const dummyPlayer = createCharacter(snap.name, snap.baseStats, []);
    const dummyEnemy = createCharacter(enemySnap.name, enemySnap.baseStats, []);
    set({
      isReplaying: true,
      isReplayPaused: false,
      allReplayEvents: replayEvents,
      player: dummyPlayer,
      enemy: dummyEnemy,
      events: [first],
      pendingEvents: rest,
      displayPlayer: first.playerSnapshot,
      displayEnemy: first.enemySnapshot,
      isAnimating: true,
      activeActor: null,
      outcome: null,
    });
  },

  toggleReplayPause: () => {
    set((s) => ({ isReplayPaused: !s.isReplayPaused }));
  },

  seekReplay: (eventIndex) => {
    const { allReplayEvents } = get();
    if (allReplayEvents.length === 0) return;
    const clamped = Math.max(
      0,
      Math.min(eventIndex, allReplayEvents.length - 1),
    );
    const displayed = allReplayEvents.slice(0, clamped + 1);
    const remaining = allReplayEvents.slice(clamped + 1);
    const current = allReplayEvents[clamped];
    set({
      events: displayed,
      pendingEvents: remaining,
      displayPlayer: current.playerSnapshot,
      displayEnemy: current.enemySnapshot,
      isAnimating: remaining.length > 0,
      isReplayPaused: true,
      activeActor:
        current.type === "skill-use" || current.type === "skill-effect"
          ? current.actor
          : null,
      outcome: current.type === "battle-end" ? current.outcome : null,
    });
  },

  executePlayerAction: (skillIndex) => {
    const state = get();
    if (!state.player || !state.enemy || state.outcome || state.isAnimating)
      return;

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

    set({
      player: result.finalPlayer,
      enemy: result.finalEnemy,
      round: result.nextRound,
      outcome: result.outcome,
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
      if (
        event.type !== "round-start" &&
        !state.outcome &&
        !state.isReplaying
      ) {
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
    processBattleEnd(get, set, event);
  },

  flushEvents: () => {
    const state = get();
    if (state.pendingEvents.length === 0) return;

    const allEvents = [...state.events, ...state.pendingEvents];
    const lastEvent = state.pendingEvents[state.pendingEvents.length - 1];

    // 전투 종료가 아니면 다음 round-start도 추가 (리플레이에서는 불필요)
    if (!state.outcome && !state.isReplaying) {
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

    const battleEndEvent = state.pendingEvents.find(
      (e) => e.type === "battle-end",
    );
    if (battleEndEvent) {
      processBattleEnd(get, set, battleEndEvent);
    }
  },

  setAnimationEnabled: (enabled) => set({ animationEnabled: enabled }),

  reset: () =>
    set({
      player: null,
      enemy: null,
      difficulty: "normal",
      round: 1,
      outcome: null,
      isReplaying: false,
      isReplayPaused: false,
      allReplayEvents: [],
      events: [],
      pendingEvents: [],
      displayPlayer: null,
      displayEnemy: null,
      isAnimating: false,
      activeActor: null,
    }),
}));
