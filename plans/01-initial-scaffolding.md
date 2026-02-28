# 프로젝트 초기 설정 계획

이 문서는 프로젝트 초기 스캐폴딩의 구현 계획을 기록합니다.

---

## 개요

턴제 배틀 게임 프로젝트의 개발 환경을 구성합니다. 각 단계는 독립적인 커밋으로 진행합니다.

## 단계별 계획

### 1. Vite React TypeScript 프로젝트 초기화

- `pnpm create vite . --template react-ts`
- Vite + React + TypeScript 기본 구조 생성

### 2. ESLint를 Biome로 교체

- eslint.config.js 삭제
- biome.json 생성 (space 2칸, 권장 설정)

### 3. Tailwind CSS v4 설정

- tailwindcss, @tailwindcss/vite 설치
- path alias 설정 (`@/` -> `src/`)

### 4. shadcn-ui 초기화

- components.json 생성
- `src/lib/utils.ts` — cn() 유틸 (clsx + tailwind-merge)

### 5. Vite 보일러플레이트 정리 및 앱 셸 구성

- 데모 파일 삭제 (App.css, logo 등)
- index.html 한국어 설정 (`lang="ko"`)
- 기본 앱 셸 구성

### 6. 테스트 인프라 설정

- vitest, @testing-library/react, jsdom 설치
- vitest.config.ts 설정
- 샘플 테스트 추가

### 7. Lefthook으로 pre-commit lint 설정

- lefthook 설치 및 설정
- staged files에 대해 biome check 실행

### 8. 핵심 런타임 의존성 설치

- zustand (상태 관리)
- react-hook-form + @hookform/resolvers (폼)
- zod (검증)

### 9. CI 워크플로우 및 PR 템플릿

- `.github/workflows/ci.yml` — lint, test, build 자동 검증
- `.github/PULL_REQUEST_TEMPLATE.md` — PR 본문 템플릿

### 10. README 작성

- 실행 방법 (`pnpm install` -> `pnpm dev`)
- 기술 스택 요약
- 프로젝트 구조 설명

---

## 참고

- 이 계획은 `chore/initial-scaffolding` 브랜치에서 하나의 PR로 구현 예정
- 각 단계는 독립적인 커밋으로, 작업 순서대로 진행
