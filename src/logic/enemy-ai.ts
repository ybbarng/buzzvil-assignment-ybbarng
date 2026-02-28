import type { BattleCharacter } from "@/types/battle";
import type { Difficulty } from "@/types/game";

/**
 * 쉬움: 단순하게 행동. 스킬을 적극적으로 활용하지 않음.
 * 대부분 기본 공격, 가끔 방어.
 */
function decideEasyAction(enemy: BattleCharacter): number {
  // 20% 확률로 방어
  if (Math.random() < 0.2) {
    const defendIndex = enemy.skills.findIndex((s) => s.type === "defend");
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
    const healIndex = enemy.skills.findIndex(
      (s) => s.type === "heal" && s.mpCost <= enemy.currentMp,
    );
    if (healIndex !== -1) return healIndex;

    // 회복 불가능하면 방어
    const defendIndex = enemy.skills.findIndex((s) => s.type === "defend");
    if (defendIndex !== -1) return defendIndex;
  }

  // 50% 확률로 강타 등 공격 스킬 사용
  const attackSpecials = enemy.skills
    .map((s, i) => ({ skill: s, index: i }))
    .filter(
      ({ skill }) =>
        skill.type === "attack" &&
        !skill.isDefault &&
        skill.mpCost <= enemy.currentMp,
    );

  if (attackSpecials.length > 0 && Math.random() < 0.5) {
    const chosen =
      attackSpecials[Math.floor(Math.random() * attackSpecials.length)];
    return chosen.index;
  }

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
    const healIndex = enemy.skills.findIndex(
      (s) => s.type === "heal" && s.mpCost <= enemy.currentMp,
    );
    if (healIndex !== -1) return healIndex;

    const defendIndex = enemy.skills.findIndex((s) => s.type === "defend");
    if (defendIndex !== -1) return defendIndex;
  }

  // HP 50% 미만이면 회복 시도 (60% 확률)
  if (hpRatio < 0.5 && Math.random() < 0.6) {
    const healIndex = enemy.skills.findIndex(
      (s) => s.type === "heal" && s.mpCost <= enemy.currentMp,
    );
    if (healIndex !== -1) return healIndex;
  }

  // 디버프 스킬을 적극적으로 활용 (60% 확률)
  const debuffSkills = enemy.skills
    .map((s, i) => ({ skill: s, index: i }))
    .filter(
      ({ skill }) => skill.type === "debuff" && skill.mpCost <= enemy.currentMp,
    );

  if (debuffSkills.length > 0 && Math.random() < 0.6) {
    const chosen =
      debuffSkills[Math.floor(Math.random() * debuffSkills.length)];
    return chosen.index;
  }

  // 강타 등 강력한 공격 스킬 (70% 확률)
  const attackSpecials = enemy.skills
    .map((s, i) => ({ skill: s, index: i }))
    .filter(
      ({ skill }) =>
        skill.type === "attack" &&
        !skill.isDefault &&
        skill.mpCost <= enemy.currentMp,
    );

  if (attackSpecials.length > 0 && Math.random() < 0.7) {
    const chosen =
      attackSpecials[Math.floor(Math.random() * attackSpecials.length)];
    return chosen.index;
  }

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
