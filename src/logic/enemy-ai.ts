import type { BattleCharacter } from "@/types/battle";
import type { Difficulty } from "@/types/game";
import type { Skill } from "@/types/skill";

export function decideEnemyAction(
  enemy: BattleCharacter,
  player: BattleCharacter,
  difficulty: Difficulty,
): number {
  const availableSkills = enemy.skills
    .map((skill, index) => ({ skill, index }))
    .filter(({ skill }) => skill.mpCost <= enemy.currentMp);

  if (difficulty === "easy") {
    return decideEasy(availableSkills);
  }
  if (difficulty === "normal") {
    return decideNormal(enemy, availableSkills);
  }
  return decideHard(enemy, player, availableSkills);
}

function decideEasy(available: { skill: Skill; index: number }[]): number {
  // 쉬움: 대부분 기본 공격, 가끔 강타
  if (Math.random() < 0.7) return 0;
  const attackSkills = available.filter(({ skill }) => skill.type === "attack");
  const pick = attackSkills[Math.floor(Math.random() * attackSkills.length)];
  return pick.index;
}

function decideNormal(
  enemy: BattleCharacter,
  available: { skill: Skill; index: number }[],
): number {
  const hpRatio = enemy.currentHp / enemy.baseStats.hp;

  // HP 30% 미만이면 회복 우선
  if (hpRatio < 0.3) {
    const healSkill = available.find(({ skill }) => skill.type === "heal");
    if (healSkill) return healSkill.index;
    // 회복 불가 시 방어
    return 1;
  }

  // HP 50% 미만이면 방어 또는 회복
  if (hpRatio < 0.5 && Math.random() < 0.4) {
    const healSkill = available.find(({ skill }) => skill.type === "heal");
    if (healSkill) return healSkill.index;
    return 1;
  }

  // 그 외 공격 스킬 랜덤
  const attackSkills = available.filter(({ skill }) => skill.type === "attack");
  const pick = attackSkills[Math.floor(Math.random() * attackSkills.length)];
  return pick.index;
}

function decideHard(
  enemy: BattleCharacter,
  player: BattleCharacter,
  available: { skill: Skill; index: number }[],
): number {
  const hpRatio = enemy.currentHp / enemy.baseStats.hp;

  // HP 25% 미만이면 방어 또는 회복
  if (hpRatio < 0.25) {
    const healSkill = available.find(({ skill }) => skill.type === "heal");
    if (healSkill) return healSkill.index;
    return 1;
  }

  // 디버프가 아직 없으면 사용
  const hasDebuffOnPlayer = player.buffs.some((b) => b.isDebuff);
  if (!hasDebuffOnPlayer) {
    const debuffSkill = available.find(({ skill }) => skill.type === "debuff");
    if (debuffSkill) return debuffSkill.index;
  }

  // HP 40% 미만이면 회복
  if (hpRatio < 0.4) {
    const healSkill = available.find(({ skill }) => skill.type === "heal");
    if (healSkill) return healSkill.index;
  }

  // 강한 공격 우선
  const attackSkills = available.filter(({ skill }) => skill.type === "attack");
  if (attackSkills.length > 1) {
    // MP가 있으면 강타 우선
    return attackSkills[attackSkills.length - 1].index;
  }

  return attackSkills[0]?.index ?? 0;
}
