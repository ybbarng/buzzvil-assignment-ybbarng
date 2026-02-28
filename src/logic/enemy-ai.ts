import type { BattleCharacter } from "@/types/battle";

export function decideEnemyAction(enemy: BattleCharacter): number {
  const hpRatio = enemy.currentHp / enemy.baseStats.hp;

  // HP가 30% 미만이면 회복 스킬 시도
  if (hpRatio < 0.3) {
    const healIndex = enemy.skills.findIndex(
      (s) => s.type === "heal" && s.mpCost <= enemy.currentMp,
    );
    if (healIndex !== -1) return healIndex;
  }

  // 비기본 스킬 중 MP가 충분한 것을 50% 확률로 사용
  const specials = enemy.skills
    .map((s, i) => ({ skill: s, index: i }))
    .filter(({ skill }) => !skill.isDefault && skill.mpCost <= enemy.currentMp);

  if (specials.length > 0 && Math.random() < 0.5) {
    const chosen = specials[Math.floor(Math.random() * specials.length)];
    return chosen.index;
  }

  // 기본: 공격 (index 0)
  return 0;
}
