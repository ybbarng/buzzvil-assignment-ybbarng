# 프로젝트 규칙

이 문서는 Claude Code가 이 프로젝트에서 따라야 할 규칙을 정의합니다.

## 브랜치 전략

- **main 브랜치에 직접 푸시 금지** — 모든 변경은 PR을 통해 병합
- 브랜치 이름: `<접두사>/<설명>` 형식 사용
  - `feature/` — 새 기능
  - `fix/` — 버그 수정
  - `docs/` — 문서 작업
  - `refactor/` — 리팩터링
  - `chore/` — 설정, 의존성, CI 등

## PR 워크플로우

- 의미 있는 단위로 PR 생성
- PR 본문에 변경 의도와 내용을 상세 기술
- PR 생성 후 셀프 코드 리뷰 수행 — 가독성, 재사용성, 효율성, 보안, 버그 가능성, 안정성 관점에서 검토 댓글 작성
- PR 병합은 **squash merge**를 기본으로 사용
- CI 통과 후 병합 (GitHub Actions: lint, test, build)
- PR 본문은 `.github/PULL_REQUEST_TEMPLATE.md` 템플릿을 따름

## 커밋 컨벤션

- 커밋 메시지는 한국어로 작성
- 작은 의미 단위로 커밋
- 완성 후 레이어별로 기계적 분할하는 방식은 지양

## 기술 스택

| 영역 | 선택 |
|---|---|
| 빌드 | Vite + React + TypeScript (strict) |
| 스타일링 | Tailwind CSS v4 + shadcn-ui |
| 상태 관리 | zustand |
| 폼 | react-hook-form + zod |
| 테스트 | vitest + @testing-library/react |
| 린트/포맷 | biome (space 2칸) |
| 패키지 매니저 | pnpm |
| Git hooks | lefthook (pre-commit lint) |

## CI

- GitHub Actions로 lint, test, build 자동 검증 (`.github/workflows/ci.yml`)
- PR 병합 시 CI 통과 필수 (required status check: `ci`)

## 기타

- `data-testid` 명세는 ASSIGNMENT.md에 정의된 값을 정확히 사용
- 라우팅 없이 zustand 상태 기반으로 화면 전환
