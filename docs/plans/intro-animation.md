# 인트로 애니메이션 구현 계획

## Context

세팅 첫 화면의 게임 몰입감을 높이기 위해 인트로 애니메이션을 추가한다.
페이지 로드 시 로고가 화면 중앙에 등장 → 상단으로 이동 → 나머지 UI가 기존 slide-in-right로 입장하는 시퀀스.

## 동작 요구사항

| 시나리오 | 인트로 재생 여부 |
|---|---|
| 최초 페이지 로드 | O |
| step 2 → step 1 복귀 | X (SettingScreen 유지) |
| 페이지 새로고침 | O (ref 초기화) |
| 전투 후 재시작 | O (SettingScreen 리마운트) |

## 변경 파일 및 내용

### 1. `src/index.css` — 인트로 keyframe 2개 추가

기존 `@keyframes` + `@utility animate-*` 패턴을 따른다.

- `intro-fade-in`: opacity 0→1 + `translateY(calc(50vh - 50%))` 위치에서 페이드인 (0.8s)
- `intro-settle`: `translateY(calc(50vh - 50%))` → `translateY(0)` 중앙에서 상단으로 이동 (0.7s)

`prefers-reduced-motion` 대응은 기존 전역 rule(179~190행)에서 모든 animation-duration을 0.01ms로 강제하므로 별도 처리 불필요.

### 2. `src/components/setting/setting-screen.tsx` — 핵심 로직

**상태 관리:**
- `IntroPhase` 타입: `"center" | "moving" | "done"`
- `introCompleted` ref: 인트로 완료 여부 (step 전환 시 유지, 리마운트 시 리셋)
- `introPhase` state: 현재 인트로 단계

**시퀀스 (useEffect):**
1. 마운트 시 `introCompleted.current === true`면 즉시 `"done"` (step 복귀 케이스)
2. `prefers-reduced-motion`이면 즉시 `"done"`
3. 1500ms 대기 후 `"moving"`으로 전환
4. `onAnimationEnd` 또는 800ms fallback으로 `"done"` 전환

**JSX 변경:**
- 로고 블록: `introPhase`에 따라 `animate-intro-fade-in` / `animate-intro-settle` / 클래스 없음
- StepIndicator + 폼: `introPhase === "done"` 일 때만 렌더링 → 기존 `animate-slide-in-right` 자연 재생

### 3. `src/test/setup.ts` — matchMedia 기본값 변경

```ts
matches: query === "(prefers-reduced-motion: reduce)"
```

이렇게 하면 테스트 환경에서 인트로가 즉시 `"done"`으로 전환되어 기존 테스트 전부 통과.
`setting-screen.test.tsx`는 자체 matchMedia mock으로 override하므로 영향 없음.

### 4. `src/components/setting/setting-screen.test.tsx` — 인트로 테스트 추가

matchMedia를 `matches: false`로 override + `vi.useFakeTimers()`로 인트로 시퀀스 검증:
- 인트로 중 `name-input` 미렌더링 확인
- 타이머 진행 후 `name-input` 렌더링 확인

## 타임라인

```
t=0       마운트, 로고 opacity 0
t=0~800ms fade-in (로고가 화면 중앙에서 나타남)
t=1500ms  setTimeout → "moving" (로고가 상단으로 이동)
t=2200ms  animationEnd → "done" (StepIndicator + 폼 slide-in)
```

## 검증

1. `pnpm test` — 전체 테스트 통과 확인
2. `pnpm build` — 빌드 성공 확인
3. `pnpm lint` — 린트 클린 확인
4. 브라우저에서 확인:
   - 첫 로드: 인트로 재생
   - step 2 → step 1 복귀: 인트로 없음
   - 새로고침: 인트로 재생
   - `prefers-reduced-motion` 활성화: 인트로 즉시 건너뜀
