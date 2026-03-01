# 턴제 배틀 게임

프론트엔드 과제: 캐릭터를 세팅하고 적과 1:1 턴제 전투를 벌이는 웹 게임입니다.

**데모**: https://gh.byb.kr/buzzvil-assignment-ybbarng/

## 실행 방법

```bash
pnpm install
pnpm dev        # http://localhost:5173
```

```bash
pnpm test       # 테스트 실행
pnpm lint       # 린트 검사
pnpm build      # 프로덕션 빌드
```

## 기술 스택

| 영역 | 선택 | 선택 이유 |
|---|---|---|
| 빌드 | Vite + React + TypeScript | SSR 불필요한 클라이언트 게임, Vite의 빠른 DX |
| 스타일링 | Tailwind CSS v4 + shadcn-ui | 유틸리티 기반 빠른 UI 구성, 일관된 디자인 시스템 |
| 상태 관리 | zustand | 라우팅 없이 상태 기반 화면 전환에 적합한 경량 라이브러리 |
| 폼 | react-hook-form + zod | 3단계 스텝 폼의 값 보존과 유효성 검증 |
| 테스트 | vitest + Testing Library | data-testid 기반 자동 채점 대비 |
| 린트/포맷 | Biome | ESLint + Prettier를 단일 도구로 대체 |
| Git hooks | Lefthook | pre-commit 시 staged files 린트 |
| CI | GitHub Actions | PR마다 lint, test, build 자동 검증 |

## 설계 판단

### 게임 프레임워크를 사용하지 않은 이유

이 게임의 본질은 UI 상태 관리입니다. 실시간 렌더링이나 물리 엔진이 필요 없고, `data-testid` 명세가 DOM 기반 UI를 전제하므로 React만으로 충분합니다.

### Next.js 대신 Vite를 선택한 이유

순수 클라이언트 앱에서 SSR, API Routes, 이미지 최적화 등 Next.js의 핵심 기능을 활용할 곳이 없습니다. Vite가 더 가볍고 빠른 개발 경험을 제공합니다.

### 오버워치 영웅 프리셋 스탯 설계

50명 영웅의 스탯을 일관성과 개성을 동시에 확보하기 위해 **계층적 템플릿** 방식을 사용했습니다. 서브역할군별 기본 템플릿(총합 200)을 정의하고, 각 영웅의 능력·설명에 맞게 ±3~8 미세 조정합니다. 같은 서브역할군 내에서는 공통 경향이 뚜렷하면서도, 개별 영웅 간 차이가 느껴지도록 설계했습니다. 상세 내용: [docs/preset-design.md](docs/preset-design.md)

### 라우팅 없이 상태 기반 화면 전환

세팅 → 전투 → 결과의 단방향 흐름이 명확하고 URL 기반 내비게이션이 필요 없어, zustand 상태로 화면을 전환합니다.

## 프로젝트 구조

```
src/
├── types/              # 도메인 타입 (Stats, Skill, BattleCharacter 등)
├── constants/          # 게임 상수 (스탯 범위, 기본 스킬, 난이도별 적 정의)
├── logic/              # 순수 함수 (데미지 계산, 버프, 적 AI, 턴 진행 등)
├── schemas/            # zod 폼 검증 스키마
├── stores/             # zustand 스토어 (game, setting, battle)
├── components/
│   ├── ui/             # shadcn-ui 기본 컴포넌트
│   ├── layout/         # 게임 컨테이너
│   ├── setting/        # 세팅 화면 (이름/스탯, 스킬, 난이도)
│   ├── battle/         # 전투 화면 (캐릭터 패널, 액션, 로그)
│   └── result/         # 결과 화면
├── lib/                # 유틸리티 (cn, josa)
├── test/               # 테스트 환경 설정
├── App.tsx             # 앱 루트 (phase 기반 화면 전환)
└── main.tsx            # 엔트리포인트
```

## 워크플로우

- main 직접 푸시 금지, 모든 변경은 PR을 통해 squash merge
- PR마다 셀프 코드 리뷰 수행
- CI(lint, test, build) 통과 필수
- 상세 내용: [docs/workflow.md](docs/workflow.md)

## 타임라인

| 시각 (KST) | 내용 |
|---|---|
| 2026-02-28 15:10 | 첫 커밋 생성 |
| 2026-02-28 19:28 | 1차 구현 완료 (모든 명시된 과제 스펙 구현 완료) |
| 2026-02-28 19:34 | 1차 채점 |

## AI 활용

이 프로젝트는 Claude Code를 활용하여 개발했습니다. 주요 의사결정 과정은 [docs/prompt-log.md](docs/prompt-log.md)에 기록되어 있습니다.
