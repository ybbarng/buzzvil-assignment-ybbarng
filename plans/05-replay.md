# 리플레이 기능 구현

## Context

전투 완료 후 게임 데이터를 localStorage에 저장하고, 저장된 게임을 선택하여 전투 재생을 볼 수 있는 기능. 기존 전투 화면을 재활용하여 저장된 이벤트를 자동 재생하고, 재생 완료 후 결과 화면을 표시한다.

## 주요 설계 결정

### 이벤트 재생 방식
기존 BattleStore의 `pendingEvents → advanceEvent()` 타이머 메커니즘을 그대로 활용한다. 저장된 전체 이벤트를 `pendingEvents`에 로드하면, BattleScreen의 기존 `useEffect` 타이머가 자동으로 순차 재생한다.

### 단, advanceEvent/flushEvents의 round-start 자동 생성 로직 차단 필요
- `advanceEvent()` 157-168행: remaining이 비었을 때 다음 round-start를 자동 추가 → 리플레이에서는 이미 모든 이벤트가 포함되어 있으므로 불필요
- `flushEvents()` 194-201행: 동일한 round-start 자동 추가 → 리플레이에서는 불필요
- **해결**: `isReplaying` 플래그로 분기

### GamePhase 확장
`"replay"` phase를 추가하여 App.tsx에서 BattleScreen을 렌더링하되, BattleScreen 내부에서 isReplaying 여부에 따라 동작을 분기한다. 결과 전환도 `"result"`가 아닌 `"replay-result"`로 구분하여, 결과 화면에서 "새 게임" 대신 "목록으로" 등 다른 행동을 제공할 수 있게 한다.

### 최대 저장 수
최근 10개 게임까지 저장. 초과 시 가장 오래된 것 삭제.

## 파일 변경

| 파일 | 작업 | 설명 |
|------|------|------|
| `src/types/game.ts` | 수정 | `GamePhase`에 `"replay"`, `"replay-result"` 추가 |
| `src/types/replay.ts` | 신규 | `ReplayData` 타입 정의 |
| `src/stores/replay-store.ts` | 신규 | localStorage 동기화, 리플레이 목록/활성 리플레이 관리 |
| `src/stores/battle-store.ts` | 수정 | `isReplaying` 플래그, `initReplay()` 메서드, advanceEvent/flushEvents 분기, 전투 종료 시 자동 저장 |
| `src/stores/game-store.ts` | 수정 | `startReplay()`, `showReplayResult()` 액션 추가 |
| `src/App.tsx` | 수정 | `replay` → BattleScreen, `replay-result` → ResultScreen 라우팅 |
| `src/components/battle/battle-screen.tsx` | 수정 | 리플레이 모드: initBattle 건너뛰기, ActionPanel 대신 "리플레이 재생 중" 표시 |
| `src/components/replay/replay-list-dialog.tsx` | 신규 | 저장된 게임 목록 Dialog, 선택 시 리플레이 시작 |
| `src/components/result/result-screen.tsx` | 수정 | "다시보기" 버튼 추가 (3번째), replay-result일 때 다른 버튼 구성 |
| `src/components/setting/step-indicator.tsx` | 수정 | 오른쪽 끝에 리플레이 버튼 (데이터 있을 때만) |
| `src/test/helpers.ts` | 수정 | `resetStores()`에 replay store 리셋 + localStorage 정리 |

## 세부 구현

### 1. 타입 정의

**`src/types/game.ts`**
```ts
export type GamePhase = "setting" | "battle" | "result" | "replay" | "replay-result";
```

**`src/types/replay.ts`** (신규)
```ts
import type { RoundEvent } from "@/types/battle-event";
import type { BattleOutcome, Difficulty } from "@/types/game";

export interface ReplayData {
  id: string;           // crypto.randomUUID()
  timestamp: number;    // Date.now()
  playerName: string;
  enemyName: string;
  difficulty: Difficulty;
  outcome: BattleOutcome;
  totalTurns: number;
  events: RoundEvent[];
}
```

### 2. ReplayStore

**`src/stores/replay-store.ts`** (신규)

```ts
interface ReplayState {
  replays: ReplayData[];
  activeReplay: ReplayData | null;

  load: () => void;           // localStorage → state (앱 시작 시)
  save: (data: ReplayData) => void;   // 저장 + 오래된 것 제거
  remove: (id: string) => void;
  setActive: (replay: ReplayData | null) => void;
  reset: () => void;
}
```

- localStorage key: `"buzz-arena-replays"`
- `save()`: 앞에 추가, 10개 초과 시 뒤에서 삭제
- `load()`: App 마운트 시 호출

### 3. BattleStore 수정

**추가 상태/액션:**
```ts
isReplaying: boolean;
initReplay: (events: RoundEvent[]) => void;
```

**`initReplay(events)`**: 저장된 이벤트의 첫 번째(round-start)를 display에 설정, 나머지를 pendingEvents에 로드
```ts
initReplay: (events) => {
  const [first, ...rest] = events;
  set({
    isReplaying: true,
    player: null, enemy: null,  // 로직용 상태는 불필요
    events: [first],
    pendingEvents: rest,
    displayPlayer: first.playerSnapshot,
    displayEnemy: first.enemySnapshot,
    isAnimating: true,
    activeActor: null,
    outcome: null,
  });
},
```

**`advanceEvent()` 수정**: remaining이 비었을 때 round-start 자동 생성 조건에 `!state.isReplaying` 추가
```ts
if (remaining.length === 0) {
  if (event.type !== "round-start" && !state.outcome && !state.isReplaying) {
    // 다음 round-start 자동 추가 (일반 전투만)
  } else {
    updates.isAnimating = false;
  }
}
```

**`flushEvents()` 수정**: 동일하게 `!state.isReplaying` 조건 추가

**`battle-end` 처리 분기**: 리플레이 모드에서는 `showReplayResult()` 호출
```ts
if (event.type === "battle-end") {
  const { outcome, isReplaying } = get();
  if (outcome) {
    if (isReplaying) {
      useGameStore.getState().showReplayResult(outcome, round - 1);
    } else {
      useGameStore.getState().showResult(outcome, round - 1);
    }
  }
}
```

**전투 종료 시 자동 저장**: 일반 전투의 `battle-end` 처리에서 ReplayStore.save() 호출
```ts
if (!isReplaying && outcome) {
  const state = get();
  useReplayStore.getState().save({
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    playerName: state.player!.name,
    enemyName: state.enemy!.name,
    difficulty: state.difficulty,
    outcome,
    totalTurns: round - 1,
    events: get().events,  // battle-end 포함된 최종 events
  });
}
```

**`reset()`**: `isReplaying: false` 추가

### 4. GameStore 수정

```ts
startReplay: () => set({ phase: "replay" }),
showReplayResult: (outcome, totalTurns) =>
  set({ phase: "replay-result", outcome, totalTurns }),
```

### 5. App.tsx 라우팅

```tsx
{(phase === "battle" || phase === "replay") && <BattleScreen />}
{(phase === "result" || phase === "replay-result") && <ResultScreen />}
```

App 마운트 시 `useReplayStore.getState().load()` 호출.

### 6. BattleScreen 수정

```tsx
const isReplaying = useBattleStore((s) => s.isReplaying);

useEffect(() => {
  if (initialized.current) return;
  initialized.current = true;
  if (!isReplaying) {
    const { name, stats, skills, difficulty } = useSettingStore.getState();
    initBattle(name, stats, skills, difficulty);
  }
}, [initBattle, isReplaying]);
```

ActionPanel 영역:
```tsx
{(!outcome || isAnimating) && (
  <div className="animate-slide-in-bottom space-y-2" style={{ animationDelay: "1400ms" }}>
    {isReplaying ? (
      <p className="text-sm text-text-muted">리플레이 재생 중...</p>
    ) : (
      <>
        <p className="text-sm text-text-secondary">...</p>
        <ActionPanel ... />
      </>
    )}
  </div>
)}
```

리플레이에서 player/enemy가 null이므로, CharacterPanel에 전달하는 `character` 대신 snapshot 데이터에서 이름을 가져오는 처리 필요. 또는 initReplay에서 events의 첫 round-start snapshot 기반으로 더미 player/enemy를 설정.

→ **결정**: `initReplay`에서 첫 이벤트 snapshot으로부터 이름 정보를 추출하여 최소한의 player/enemy 객체를 설정한다. CharacterPanel은 `character.name`과 `snapshot`의 HP/MP만 사용하므로, name + baseStats + skills(빈 배열)만 있으면 충분하다. ReplayData에 이미 playerName/enemyName이 있으므로 이를 활용.

### 7. ReplayListDialog

**`src/components/replay/replay-list-dialog.tsx`** (신규)

- `Dialog` + 리플레이 목록 테이블
- 각 항목: 날짜, 플레이어명, vs 적, 난이도, 결과, 턴 수
- 클릭 시: `useReplayStore.setActive(replay)` → `useBattleStore.reset()` → `useBattleStore.initReplay(replay.events)` → `useGameStore.startReplay()`
- 삭제 버튼 (각 항목)
- 빈 상태: "저장된 리플레이가 없습니다"

### 8. ResultScreen 수정

**일반 결과 (phase === "result")**:
1. 새 게임 (기존)
2. 전투 분석 (기존)
3. **다시보기** (신규) — ReplayListDialog 열기

**리플레이 결과 (phase === "replay-result")**:
1. 새 게임 — 세팅 화면으로
2. 전투 분석 — 기존 모달 (battle 데이터 사용)
3. **다시보기** — ReplayListDialog 열기

### 9. StepIndicator 수정

```tsx
interface StepIndicatorProps {
  currentStep: SettingStep;
  onStepClick?: (step: SettingStep) => void;
  trailing?: React.ReactNode;  // 오른쪽 끝 슬롯
}
```

```tsx
<div className="mb-6 flex items-center justify-center gap-1">
  {STEPS.map(...)}
  {trailing && <div className="ml-auto">{trailing}</div>}
</div>
```

세팅 화면에서 trailing에 리플레이 버튼 전달:
```tsx
<StepIndicator
  currentStep={step}
  onStepClick={goToStep}
  trailing={hasReplays && <ReplayButton onClick={() => setReplayOpen(true)} />}
/>
```

리플레이 버튼은 작은 GameButton 또는 아이콘 버튼으로 구현.

### 10. 테스트 헬퍼

```ts
// src/test/helpers.ts
import { useReplayStore } from "@/stores/replay-store";

export function resetStores() {
  useGameStore.getState().restart();
  useSettingStore.getState().reset();
  useBattleStore.getState().reset();
  useBattleStore.getState().setAnimationEnabled(false);
  useReplayStore.getState().reset();
  localStorage.removeItem("buzz-arena-replays");
}
```

## 구현 순서 (커밋 단위)

1. **리플레이 타입 및 스토어 추가** — `types/replay.ts`, `stores/replay-store.ts`
2. **BattleStore/GameStore 리플레이 지원** — `isReplaying`, `initReplay()`, advanceEvent/flushEvents 분기, 자동 저장, GamePhase 확장
3. **BattleScreen 리플레이 모드 대응** — initBattle 건너뛰기, ActionPanel 숨김
4. **ReplayListDialog 구현** — 목록 UI, 선택/삭제 기능
5. **ResultScreen 다시보기 버튼 통합** — 3번째 버튼, replay-result 분기
6. **세팅 화면 리플레이 버튼** — StepIndicator trailing 슬롯

## 자동 채점 호환성

| 체크포인트 | 영향 | 호환 |
|-----------|------|------|
| `result-title`, `result-turns`, `restart-button` | 그대로 유지, phase "result"에서 동일하게 렌더링 | OK |
| `restart-button` 클릭 → 세팅 화면 | handleRestart 로직 동일 | OK |
| initBattle(settingStore 참조) | phase "battle"일 때만 실행, "replay"일 때 건너뜀 | OK |
| `resetStores()` | replay store 리셋 + localStorage 정리 추가 | OK |

채점 테스트는 GamePhase를 `"setting"/"battle"/"result"`만 사용하므로 `"replay"/"replay-result"` 추가는 영향 없음.

## 검증

- `pnpm test` — 기존 테스트 통과 확인
- `pnpm lint` — biome 클린
- `pnpm build` — 빌드 성공
- 브라우저: 전투 완료 → 결과 화면 "다시보기" → 리플레이 목록 → 선택 → 자동 재생 → 리플레이 결과 화면
- 세팅 화면에서 리플레이 버튼 → 리플레이 목록 → 선택 → 자동 재생
- localStorage에 10개 초과 저장 시 오래된 것 자동 삭제 확인
