export const MAX_ROUNDS = 20;
export const MIN_DAMAGE = 1;
export const DEFEND_MULTIPLIER = 0.5;
export const DEF_REDUCTION_RATE = 0.5;

/** 이벤트 타입별 표시 지연시간 (ms) */
export const EVENT_DELAYS: Record<string, number> = {
  "round-start": 600,
  defend: 800,
  "speed-compare": 800,
  "skill-use": 600,
  "skill-effect": 700,
  "skip-turn": 600,
  "buff-expire": 600,
  "battle-end": 400,
};
