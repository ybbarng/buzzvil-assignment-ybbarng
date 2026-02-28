import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("타이틀을 렌더링한다", () => {
    render(<App />);
    expect(screen.getByText("턴제 배틀 게임")).toBeInTheDocument();
  });
});
