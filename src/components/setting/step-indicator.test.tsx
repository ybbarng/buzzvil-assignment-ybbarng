/** StepIndicator: 스텝 네비게이션 렌더링 및 상호작용 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StepIndicator } from "./step-indicator";

function Wrapper({ children }: { children: ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}

describe("StepIndicator", () => {
  it("3개 스텝(영웅 생성, 스킬 장착, 난이도 선택)을 렌더링한다", () => {
    render(<StepIndicator currentStep={1} />, { wrapper: Wrapper });
    expect(screen.getByText("영웅 생성")).toBeInTheDocument();
    expect(screen.getByText("스킬 장착")).toBeInTheDocument();
    expect(screen.getByText("난이도 선택")).toBeInTheDocument();
  });

  it("현재 스텝에 aria-current='step'이 설정된다", () => {
    render(<StepIndicator currentStep={2} />, { wrapper: Wrapper });
    const currentButton = screen.getByText("스킬 장착").closest("button")!;
    expect(currentButton).toHaveAttribute("aria-current", "step");
  });

  it("현재 스텝과 미래 스텝 버튼은 비활성화된다", () => {
    render(<StepIndicator currentStep={2} />, { wrapper: Wrapper });
    // 현재 스텝 (스킬 장착)
    expect(screen.getByText("스킬 장착").closest("button")).toBeDisabled();
    // 미래 스텝 (난이도 선택)
    expect(screen.getByText("난이도 선택").closest("button")).toBeDisabled();
  });

  it("완료된 스텝 클릭 시 onStepClick이 호출된다", async () => {
    const onStepClick = vi.fn();
    render(<StepIndicator currentStep={2} onStepClick={onStepClick} />, {
      wrapper: Wrapper,
    });

    await userEvent.click(screen.getByText("영웅 생성"));
    expect(onStepClick).toHaveBeenCalledWith(1);
  });

  it("완료된 스텝 버튼은 활성화 상태이다", () => {
    render(<StepIndicator currentStep={3} />, { wrapper: Wrapper });
    expect(screen.getByText("영웅 생성").closest("button")).toBeEnabled();
    expect(screen.getByText("스킬 장착").closest("button")).toBeEnabled();
  });

  it("trailing 요소를 렌더링한다", () => {
    render(
      <StepIndicator
        currentStep={1}
        trailing={<span data-testid="trailing">추가</span>}
      />,
      { wrapper: Wrapper },
    );
    expect(screen.getByTestId("trailing")).toBeInTheDocument();
  });
});
