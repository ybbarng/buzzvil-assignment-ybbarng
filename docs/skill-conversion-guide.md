# 오버워치 → 게임 스킬 변환 가이드

오버워치 영웅의 스킬을 턴제 RPG 스킬로 변환할 때 적용하는 원칙입니다.

## 변환 원칙

1. **이름만 가져오지 않는다** — 오버워치 스킬의 실제 동작 방식, 역할, 비용을 반영
2. **궁극기는 고비용·고효과** — MP 18~30, 높은 수치
3. **일반 능력은 중비용·중효과** — MP 5~18, 적절한 수치
4. **역할군 특성을 반영** — 탱커는 방어·버프 위주, 딜러는 공격 위주, 서포터는 힐·버프 위주

## 스킬 유형별 변환표

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

## 역할군별 가이드

### 돌격 (Tank)

- **주요 스킬 구성**: 방어 버프 1~2개 + 공격/CC 1~2개 + 궁극기 1개
- 방벽/보호막 능력 → `buff DEF` (value 7~10, duration 2~4)
- 돌진/이동기 → `buff DEF` (value 3~6, duration 1~2) 또는 `attack` (multiplier 1.3~1.8)
- 궁극기 → 역할에 따라 `attack`(고배율) 또는 `debuff`(범위 CC)

### 공격 (Damage)

- **주요 스킬 구성**: 공격 2~3개 + 유틸리티 0~1개 + 궁극기 1개
- 주요 화력 능력 → `attack` (multiplier 1.3~2.0)
- 궁극기 → 대부분 `attack` (multiplier 2.5~3.0)
- CC/유틸리티 → `debuff` (value 3~8, duration 2~4)

### 지원 (Support)

- **주요 스킬 구성**: 힐 1~2개 + 버프/디버프 1~2개 + 궁극기 1개
- 힐링 능력 → `heal` (amount 15~35)
- 버프 능력 → `buff ATK/DEF` (value 3~8, duration 2~4)
- 궁극기 → `heal`(고회복), `buff`(범위 강화), 또는 `debuff`(범위 CC)

## 게임 시스템 제약

변환 시 다음 제약 조건을 준수해야 합니다 (`SKILL_CONSTRAINTS` 참조):

| 필드 | 최솟값 | 최댓값 | 비고 |
|---|---|---|---|
| name | 1자 | 8자 | 한글 기준 |
| mpCost | 1 | 30 | |
| multiplier | 1.0 | 3.0 | 0.1 단위 |
| healAmount | 10 | 50 | |
| value (buff/debuff) | 1 | 10 | |
| duration | 1 | 5 | 턴 단위 |

## 메타데이터 기반 자동 생성

### 설계 의도

오버워치 스킬 데이터를 게임 프리셋으로 직접 하드코딩하지 않고, **원본 메타데이터(이름, 분류, 설명, 수치)를 별도로 저장**한 뒤 변환 함수를 통해 프리셋을 생성한다.

이 구조를 선택한 이유는, 게임 시스템이 변경될 때(예: 스킬 타입 추가, 수치 범위 변경, 밸런스 재조정) **메타데이터만 수정하면 50명 전원의 스킬 프리셋을 일괄 재생성**할 수 있기 때문이다.

### 파일 구조

| 파일 | 역할 |
|---|---|
| `src/types/ow-skill-meta.ts` | 메타데이터 타입 정의 (`OwHeroMeta`, `OwSkillMeta`, `SkillGameValues`, `ConversionRule`) |
| `src/constants/ow-skill-meta.ts` | 변환 규칙(참조용), 50명 영웅 스킬 메타데이터, 프리셋 생성 함수 |
| `src/constants/skill-presets.ts` | `generateAllSkillPresets()`를 호출하여 최종 프리셋 배열 제공 |

### 생성 흐름

```
OW_HERO_META (50명 영웅 × 4 스킬, gameValues 포함)
  + SKILL_NAME_MAP (8자 초과 스킬명 축약)
  → generateSkillPreset()
  → HeroSkillPreset (SkillPresetEntry[])
```

### 이름 축약

스킬 이름은 게임 시스템 제약(최대 8자)을 따라야 한다. 8자를 초과하는 오버워치 원본 이름은 `SKILL_NAME_MAP`에서 축약한다.

| 원본 이름 | 축약 이름 |
|---|---|
| A-36 전술 수류탄 | 전술 수류탄 |
| 사이버 파편 수류탄 | 파편 수류탄 |
| 오버라이드 프로토콜 | 오버라이드 |

### 데이터 검증

`src/constants/ow-skill-meta.test.ts`에서 자동 검증:

- 50명 영웅이 모두 포함, heroId 고유
- 영웅당 정확히 4개 스킬
- 모든 gameValues가 SKILL_CONSTRAINTS 범위 내
- SKILL_NAME_MAP의 원본 이름이 실제로 존재
- 축약 후 이름이 8자 이하
- 대표 영웅(D.Va, 겐지)의 스킬 스냅샷 검증

## 예시: D.Va

| OW 스킬 | 게임 변환 | 근거 |
|---|---|---|
| 부스터 (돌진) | buff DEF +4, 2턴, MP 7 | 이동기/회피 → 낮은 방어 버프 |
| 방어 매트릭스 (탄막 흡수) | buff DEF +8, 3턴, MP 15 | 보호막 → 높은 방어 버프 |
| 마이크로 미사일 | attack ×1.5, MP 10 | 일반 공격 능력 |
| 자폭 (궁극기) | attack ×2.8, MP 25 | 궁극기 고데미지 |
