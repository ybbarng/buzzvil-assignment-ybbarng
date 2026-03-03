/** StatAllocator: 스탯 배분 UI 렌더링 및 상호작용 */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { STAT_KEYS } from "@/constants/stats";
import type { Stats } from "@/types/character";
import { StatAllocator } from "./stat-allocator";

const BASE_STATS: Stats = { hp: 50, mp: 50, atk: 15, def: 15, spd: 15 };

describe("StatAllocator", () => {
  it("5개 스탯(HP, MP, ATK, DEF, SPD) 입력을 렌더링한다", () => {
    render(<StatAllocator stats={BASE_STATS} onChange={vi.fn()} />);
    for (const key of STAT_KEYS) {
      expect(screen.getByTestId(`stat-${key}`)).toBeInTheDocument();
    }
  });

  it("remaining-points가 렌더링된다", () => {
    render(<StatAllocator stats={BASE_STATS} onChange={vi.fn()} />);
    expect(screen.getByTestId("remaining-points")).toBeInTheDocument();
  });

  it("스탯 입력값 변경 시 onChange를 호출한다", async () => {
    const onChange = vi.fn();
    render(<StatAllocator stats={BASE_STATS} onChange={onChange} />);

    const atkInput = screen.getByTestId("stat-atk");
    await userEvent.clear(atkInput);
    await userEvent.type(atkInput, "20");

    expect(onChange).toHaveBeenCalled();
  });

  it("포인트를 모두 사용하면 '랜덤 배분하기' 버튼이 비활성화된다", () => {
    const full: Stats = { hp: 80, mp: 80, atk: 15, def: 15, spd: 10 };
    render(<StatAllocator stats={full} onChange={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: /랜덤 배분하기/ }),
    ).toBeDisabled();
  });

  it("포인트 여유가 있으면 '랜덤 배분하기' 버튼이 활성화된다", () => {
    render(<StatAllocator stats={BASE_STATS} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /랜덤 배분하기/ })).toBeEnabled();
  });

  it("각 스탯의 초기화 버튼이 최솟값이면 비활성화된다", () => {
    const minStats: Stats = { hp: 20, mp: 20, atk: 5, def: 5, spd: 5 };
    render(<StatAllocator stats={minStats} onChange={vi.fn()} />);
    // 모든 초기화 버튼이 비활성화
    const resetButtons = screen.getAllByRole("button", { name: /초기화/ });
    for (const btn of resetButtons) {
      expect(btn).toBeDisabled();
    }
  });
});
