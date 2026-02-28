import { describe, expect, it } from "vitest";
import { josa } from "./utils";

describe("josa", () => {
  it("받침이 있으면 첫 번째 조사를 반환한다", () => {
    expect(josa("훈련 로봇", "이", "가")).toBe("이"); // 봇 → 받침 ㅅ
    expect(josa("타론 요원", "을", "를")).toBe("을"); // 원 → 받침 ㄴ
  });

  it("받침이 없으면 두 번째 조사를 반환한다", () => {
    expect(josa("전투 드로", "이", "가")).toBe("가"); // 로 → 받침 없음
    expect(josa("테스터", "이", "가")).toBe("가"); // 터 → 받침 없음
  });

  it("빈 문자열이면 첫 번째 조사를 반환한다", () => {
    expect(josa("", "이", "가")).toBe("이");
  });

  it("한글이 아닌 문자로 끝나면 받침 없음으로 처리한다", () => {
    expect(josa("Player1", "이", "가")).toBe("가");
  });
});
