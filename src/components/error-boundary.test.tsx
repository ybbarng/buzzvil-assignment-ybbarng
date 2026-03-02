import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./error-boundary";

function ThrowingComponent(): never {
  throw new Error("테스트 에러");
}

describe("ErrorBoundary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("자식 컴포넌트가 정상이면 그대로 렌더링한다", () => {
    render(
      <ErrorBoundary>
        <p>정상 콘텐츠</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("정상 콘텐츠")).toBeInTheDocument();
  });

  it("자식 컴포넌트에서 에러 발생 시 폴백 UI를 렌더링한다", () => {
    // console.error 출력 억제
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText("오류 발생")).toBeInTheDocument();
    expect(
      screen.getByText("예기치 않은 오류가 발생했습니다."),
    ).toBeInTheDocument();
    expect(screen.getByText("새로고침")).toBeInTheDocument();
  });
});
