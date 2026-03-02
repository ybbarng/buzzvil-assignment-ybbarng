/** ActionPanel: MP 부족 비활성화, aria-label, 스킬 버튼 렌더링 검증 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { BattleCharacter } from "@/types/battle";
import type { Skill } from "@/types/skill";
import { ActionPanel } from "./action-panel";

const BASE_SKILLS: Skill[] = [
  { name: "공격", type: "attack", mpCost: 0, multiplier: 1.0, isDefault: true },
  { name: "방어", type: "defend", mpCost: 0, isDefault: true },
  {
    name: "강타",
    type: "attack",
    mpCost: 10,
    multiplier: 1.5,
    isDefault: false,
  },
  { name: "치유", type: "heal", mpCost: 15, healAmount: 30, isDefault: false },
];

function makePlayer(overrides?: Partial<BattleCharacter>): BattleCharacter {
  return {
    name: "테스터",
    baseStats: { hp: 100, mp: 50, atk: 20, def: 10, spd: 10 },
    currentHp: 100,
    currentMp: 50,
    skills: BASE_SKILLS,
    isDefending: false,
    buffs: [],
    ...overrides,
  };
}

describe("ActionPanel", () => {
  it("스킬 수만큼 버튼을 렌더링한다", () => {
    render(<ActionPanel player={makePlayer()} onAction={vi.fn()} />);
    expect(screen.getByTestId("skill-button-0")).toBeInTheDocument();
    expect(screen.getByTestId("skill-button-1")).toBeInTheDocument();
    expect(screen.getByTestId("skill-button-2")).toBeInTheDocument();
    expect(screen.getByTestId("skill-button-3")).toBeInTheDocument();
  });

  it("MP가 충분한 스킬 버튼은 활성화된다", () => {
    render(<ActionPanel player={makePlayer()} onAction={vi.fn()} />);
    expect(screen.getByTestId("skill-button-0")).toBeEnabled();
    expect(screen.getByTestId("skill-button-2")).toBeEnabled(); // 강타 mpCost=10, currentMp=50
  });

  it("MP가 부족한 스킬 버튼은 비활성화된다", () => {
    render(
      <ActionPanel player={makePlayer({ currentMp: 5 })} onAction={vi.fn()} />,
    );
    expect(screen.getByTestId("skill-button-2")).toBeDisabled(); // 강타 mpCost=10
    expect(screen.getByTestId("skill-button-3")).toBeDisabled(); // 치유 mpCost=15
  });

  it("MP 비용 0인 기본 스킬은 MP 부족 시에도 활성화된다", () => {
    render(
      <ActionPanel player={makePlayer({ currentMp: 0 })} onAction={vi.fn()} />,
    );
    expect(screen.getByTestId("skill-button-0")).toBeEnabled(); // 공격 mpCost=0
    expect(screen.getByTestId("skill-button-1")).toBeEnabled(); // 방어 mpCost=0
  });

  it("disabled prop이 true이면 모든 버튼이 비활성화된다", () => {
    render(<ActionPanel player={makePlayer()} onAction={vi.fn()} disabled />);
    for (let i = 0; i < 4; i++) {
      expect(screen.getByTestId(`skill-button-${i}`)).toBeDisabled();
    }
  });

  it("활성화된 버튼 클릭 시 onAction에 스킬 인덱스를 전달한다", async () => {
    const onAction = vi.fn();
    render(<ActionPanel player={makePlayer()} onAction={onAction} />);
    await userEvent.click(screen.getByTestId("skill-button-2"));
    expect(onAction).toHaveBeenCalledWith(2);
  });

  it("MP 부족 시 aria-label에 '마나 부족'이 포함된다", () => {
    render(
      <ActionPanel player={makePlayer({ currentMp: 0 })} onAction={vi.fn()} />,
    );
    expect(screen.getByTestId("skill-button-2")).toHaveAttribute(
      "aria-label",
      "강타 (마나 부족)",
    );
  });

  it("MP 비용이 있는 스킬의 aria-label에 MP 정보가 포함된다", () => {
    render(<ActionPanel player={makePlayer()} onAction={vi.fn()} />);
    expect(screen.getByTestId("skill-button-2")).toHaveAttribute(
      "aria-label",
      "강타 (MP 10)",
    );
  });

  it("MP 비용 0인 스킬의 aria-label은 스킬 이름만 포함한다", () => {
    render(<ActionPanel player={makePlayer()} onAction={vi.fn()} />);
    expect(screen.getByTestId("skill-button-0")).toHaveAttribute(
      "aria-label",
      "공격",
    );
  });
});
