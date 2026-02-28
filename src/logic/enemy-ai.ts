import type { BattleCharacter } from "@/types/battle";
import type { Difficulty } from "@/types/game";
import type { Skill } from "@/types/skill";

/** 주어진 타입의 사용 가능한(MP 충분한) 첫 스킬의 인덱스를 반환. 없으면 -1. */
function findUsableSkillIndex(
  enemy: BattleCharacter,
  type: Skill["type"],
): number {
  return enemy.skills.findIndex(
    (s) => s.type === type && s.mpCost <= enemy.currentMp,
  );
}

/** 조건에 맞는 사용 가능한 스킬 중 하나를 랜덤으로 선택. 없으면 -1. */
function pickRandomUsableIndex(
  enemy: BattleCharacter,
  predicate: (skill: Skill) => boolean,
): number {
  const candidates = enemy.skills
    .map((s, i) => ({ skill: s, index: i }))
    .filter(({ skill }) => skill.mpCost <= enemy.currentMp && predicate(skill));
  if (candidates.length === 0) return -1;
  return candidates[Math.floor(Math.random() * candidates.length)].index;
}

/**
 * 쉬움: 단순하게 행동. 스킬을 적극적으로 활용하지 않음.
 * 대부분 기본 공격, 가끔 방어.
 */
function decideEasyAction(enemy: BattleCharacter): number {
  // 20% 확률로 방어
  if (Math.random() < 0.2) {
    const defendIndex = findUsableSkillIndex(enemy, "defend");
    if (defendIndex !== -1) return defendIndex;
  }

  // 나머지는 기본 공격
  return 0;
}

/**
 * 보통: 공격과 회복을 적절히 사용. HP가 낮을 때 방어적으로 행동.
 */
function decideNormalAction(enemy: BattleCharacter): number {
  const hpRatio = enemy.currentHp / enemy.baseStats.hp;

  // HP가 40% 미만이면 회복 우선 시도
  if (hpRatio < 0.4) {
    const healIndex = findUsableSkillIndex(enemy, "heal");
    if (healIndex !== -1) return healIndex;

    // 회복 불가능하면 방어
    const defendIndex = findUsableSkillIndex(enemy, "defend");
    if (defendIndex !== -1) return defendIndex;
  }

  // 50% 확률로 강타 등 공격 스킬 사용
  const attackIndex = pickRandomUsableIndex(
    enemy,
    (s) => s.type === "attack" && !s.isDefault,
  );
  if (attackIndex !== -1 && Math.random() < 0.5) return attackIndex;

  // 기본 공격
  return 0;
}

/**
 * 어려움: 전략적으로 행동. 디버프를 활용하고, 위기 시 방어적으로 플레이.
 */
function decideHardAction(enemy: BattleCharacter): number {
  const hpRatio = enemy.currentHp / enemy.baseStats.hp;

  // 위기 시 (HP 30% 미만) 회복 우선, 불가능하면 방어
  if (hpRatio < 0.3) {
    const healIndex = findUsableSkillIndex(enemy, "heal");
    if (healIndex !== -1) return healIndex;

    const defendIndex = findUsableSkillIndex(enemy, "defend");
    if (defendIndex !== -1) return defendIndex;
  }

  // HP 50% 미만이면 회복 시도 (60% 확률)
  if (hpRatio < 0.5 && Math.random() < 0.6) {
    const healIndex = findUsableSkillIndex(enemy, "heal");
    if (healIndex !== -1) return healIndex;
  }

  // 디버프 스킬을 적극적으로 활용 (60% 확률)
  const debuffIndex = pickRandomUsableIndex(enemy, (s) => s.type === "debuff");
  if (debuffIndex !== -1 && Math.random() < 0.6) return debuffIndex;

  // 강타 등 강력한 공격 스킬 (70% 확률)
  const attackIndex = pickRandomUsableIndex(
    enemy,
    (s) => s.type === "attack" && !s.isDefault,
  );
  if (attackIndex !== -1 && Math.random() < 0.7) return attackIndex;

  // 기본 공격
  return 0;
}

export function decideEnemyAction(
  enemy: BattleCharacter,
  difficulty: Difficulty,
): number {
  switch (difficulty) {
    case "easy":
      return decideEasyAction(enemy);
    case "normal":
      return decideNormalAction(enemy);
    case "hard":
      return decideHardAction(enemy);
  }
}
