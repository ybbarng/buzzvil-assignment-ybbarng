import { josa } from "@/lib/utils";
import type { RoundEvent } from "@/types/battle-event";

export function formatEvent(event: RoundEvent): string {
  switch (event.type) {
    case "round-start":
      return `── ${event.round} 라운드 ──`;

    case "defend":
      return `${event.actorName}${josa(event.actorName, "이", "가")} 방어 태세를 취하여 받는 피해가 50% 감소합니다.`;

    case "speed-compare":
      if (event.firstSpd === event.secondSpd) {
        return `${event.firstName}${josa(event.firstName, "이", "가")} 먼저 행동합니다.`;
      }
      return `${event.firstName}의 속도(${event.firstSpd}) > ${event.secondName}의 속도(${event.secondSpd}), ${event.firstName}${josa(event.firstName, "이", "가")} 먼저 행동합니다.`;

    case "skill-use": {
      const mpSuffix = event.mpCost > 0 ? ` (MP -${event.mpCost})` : "";
      return `${event.actorName}${josa(event.actorName, "이", "가")} ${event.skillName}${josa(event.skillName, "을", "를")} 시전!${mpSuffix}`;
    }

    case "skill-effect":
      switch (event.skillType) {
        case "attack":
          return `${event.actorName}의 ${event.skillName}! ${event.targetName}에게 ${event.value} 데미지!`;
        case "heal":
          return `${event.actorName}의 ${event.skillName}! HP ${event.value} 회복!`;
        case "buff":
          return `${event.actorName}의 ${event.skillName}! 능력치가 강화되었습니다.`;
        case "debuff":
          return `${event.actorName}의 ${event.skillName}! ${event.targetName}의 능력치가 약화되었습니다.`;
        default:
          return `${event.actorName}의 ${event.skillName}!`;
      }

    case "skip-turn":
      if (event.reason === "defeated") {
        return `${event.actorName}${josa(event.actorName, "은", "는")} 쓰러졌습니다.`;
      }
      return `${event.actorName}${josa(event.actorName, "은", "는")} 마나가 부족하여 ${event.skillName}${josa(event.skillName, "을", "를")} 시전하지 못했습니다.`;

    case "buff-expire":
      return `${event.targetName}의 ${event.buffTarget.toUpperCase()} ${event.wasBuff ? "강화" : "약화"} 효과가 만료되었습니다.`;

    case "battle-end":
      switch (event.outcome) {
        case "win":
          return "전투에서 승리했습니다!";
        case "lose":
          return "전투에서 패배했습니다...";
        case "draw":
          return "무승부로 전투가 종료되었습니다.";
      }
  }
}
