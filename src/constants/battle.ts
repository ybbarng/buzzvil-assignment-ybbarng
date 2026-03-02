export const MAX_ROUNDS = 20;
export const MIN_DAMAGE = 1;
export const DEFEND_MULTIPLIER = 0.5;
export const DEF_REDUCTION_RATE = 0.5;

/** 이벤트 타입별 표시 지연시간 (ms) */
export const EVENT_DELAYS: Record<string, number> = {
  "round-start": 1000,
  defend: 1200,
  "speed-compare": 1200,
  "skill-use": 1200,
  "skill-effect": 1400,
  "skip-turn": 1000,
  "buff-expire": 1000,
  "battle-end": 800,
};
