# 오버워치 영웅 스킬 프리셋 기능 구현 계획

## Context

현재 프리셋으로 영웅을 선택하면 이름과 스탯만 적용됩니다. 이 기능은 Step 2 "스킬 장착"에서 해당 영웅의 실제 오버워치 스킬을 기반으로 한 커스텀 스킬 프리셋을 선택할 수 있게 합니다.

- 프리셋 영웅 → 해당 영웅의 스킬만 선택 가능
- 직접 입력 영웅 → 모든 영웅의 스킬 선택 가능

## 스킬 변환 원칙

이름만 가져오는 것이 아니라, 오버워치 스킬의 **실제 동작 방식, 역할, 비용**을 반영하여 변환합니다.

| OW 스킬 유형 | 게임 타입 | 수치 범위 | MP 범위 |
|---|---|---|---|
| 궁극기 (고데미지) | attack | 배율 2.5~3.0 | 20~30 |
| 궁극기 (CC/범위) | debuff | value 7~10, dur 3~5 | 18~25 |
| 궁극기 (힐/부활) | heal | amount 40~50 | 22~28 |
| 궁극기 (강화) | buff | value 8~10, dur 3~5 | 18~25 |
| 일반 공격 능력 | attack | 배율 1.3~2.0 | 8~15 |
| 이동기/회피기 | buff DEF | value 3~6, dur 1~2 | 5~10 |
| 방벽/보호막 | buff DEF | value 7~10, dur 2~4 | 10~18 |
| 힐링 능력 | heal | amount 15~35 | 8~18 |
| 공격 강화 | buff ATK | value 3~8, dur 2~4 | 8~15 |
| CC (해킹/수면 등) | debuff | value 3~8, dur 2~4 | 8~15 |

## 변경 대상 파일

### 신규 생성
| 파일 | 용도 |
|------|------|
| `docs/skill-conversion-guide.md` | 스킬 변환 원칙 문서 (OW→게임 변환 규칙, 역할군별 가이드) |
| `src/types/skill-preset.ts` | `SkillPresetEntry`, `HeroSkillPreset` 타입 |
| `src/constants/skill-presets.ts` | 42명 영웅별 스킬 프리셋 데이터 + 헬퍼 함수 |
| `src/constants/skill-presets.test.ts` | 프리셋 데이터 유효성 검증 테스트 |
| `src/components/setting/skill-preset-dialog.tsx` | 프리셋 스킬 선택 다이얼로그 |

### 기존 수정
| 파일 | 변경 내용 |
|------|-----------|
| `src/stores/setting-store.ts` | `presetId: string \| null` 상태 + `setPresetId` 액션 추가 |
| `src/components/setting/name-stat-form.tsx` | presetId 로컬 상태 추적, onSubmit 시그니처 확장 |
| `src/components/setting/setting-screen.tsx` | presetId를 store에 저장, SkillForm에 전달 |
| `src/components/setting/skill-form.tsx` | "프리셋에서 선택" / "직접 만들기" 버튼 2개 분기 |

## 데이터 구조

```typescript
// src/types/skill-preset.ts
export type SkillPresetEntry = Omit<Skill, "isDefault">;

export interface HeroSkillPreset {
  heroId: string;              // HERO_PRESETS의 id와 매칭
  skills: SkillPresetEntry[];  // 3~5개 스킬 옵션
}
```

장착 시 `{ ...entry, isDefault: false }` 로 변환하여 기존 Skill 타입과 호환.

## UI 흐름

스킬 추가 버튼을 2개로 분리 (모달 중첩 방지):

```
┌ 보유 스킬 ─────────────────────────────────────┐
│  공격      기본공격                          │
│  방어      기본방어                          │
│                                             │
│  [+ 프리셋 스킬]        [+ 직접 만들기]       │
│  ┌───────────────────────────┐              │
│  │         빈 슬롯            │              │
│  └───────────────────────────┘              │
└─────────────────────────────────────────────┘
```

### 프리셋 스킬 선택 다이얼로그
- **프리셋 영웅인 경우**: 해당 영웅의 스킬 3~5개를 리스트로 표시, 클릭으로 즉시 장착
- **직접 입력인 경우**: 역할군별 영웅 목록 → 영웅 선택 → 스킬 리스트 (2단계)
- 이미 장착된 스킬은 비활성화 처리 (중복 방지)

## presetId 추적 정책

- 프리셋 버튼으로 영웅 선택 → presetId 설정
- 이름을 수동으로 수정해도 presetId 유지 (스킬 프리셋은 "영웅"에 연동, "이름"과 무관)
- 처음부터 직접 입력만 한 경우 → presetId는 null

## 커밋 단위

1. **스킬 변환 원칙 문서 작성** — `docs/skill-conversion-guide.md`
2. **스킬 프리셋 타입 및 42명 스킬 데이터 정의** — 타입, 데이터, 유효성 테스트
3. **setting-store에 presetId 추적 추가** — store 수정 + 테스트
4. **이름/스탯 폼에서 presetId 전달 흐름** — name-stat-form, setting-screen 수정
5. **스킬 프리셋 선택 다이얼로그 UI** — skill-preset-dialog 신규 생성
6. **스킬 폼에 프리셋 선택 통합** — skill-form 수정, 버튼 2개 분기, 테스트

## 검증 방법

1. `pnpm test` — 프리셋 데이터 유효성, store 테스트, 컴포넌트 테스트
2. `pnpm lint` — biome lint 통과
3. `pnpm build` — TypeScript 빌드 에러 없음
4. 수동 테스트:
   - 프리셋 영웅(예: D.Va) 선택 → Step 2에서 "프리셋 스킬" 클릭 → D.Va 스킬만 표시 → 스킬 선택하여 장착
   - 직접 입력 → Step 2에서 "프리셋 스킬" 클릭 → 전체 영웅 스킬 탐색 가능
   - 프리셋 1개 + 직접 만들기 1개 조합
   - 동일 스킬 중복 장착 방지 확인
