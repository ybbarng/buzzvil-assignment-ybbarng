# 테스트 보강

## Context
입사 지원 과제 제출을 위해 main 이후 변경된 로직의 테스트 커버리지를 보수적으로 보강한다.
현재 155개 테스트 통과 중이며, skip-turn 로직, 적 턴 value 계산, eventsToLegacyLogs 단독 테스트, toSnapshot 깊은 복사 테스트가 누락되어 있다.

## 변경 파일

### 1. `src/logic/round-events.test.ts` — 4개 테스트 추가

기존 5개 + 4개 = 9개

| 테스트명 | 검증 내용 |
|---------|---------|
| HP가 0 이하인 캐릭터는 skip-turn(defeated) 이벤트를 생성한다 | player HP=0으로 설정, `skip-turn` + `reason: "defeated"` 확인 |
| MP 부족 시 skip-turn(no-mp) 이벤트를 생성하고 스킬명을 포함한다 | player MP=0 + mpCost>0 스킬, `skip-turn` + `reason: "no-mp"` + `skillName` 확인 |
| skill-use 이벤트에서 MP만 차감되고 skill-effect에서 효과가 적용된다 | mpCost>0 스킬 사용, skill-use 스냅샷의 MP 감소 확인, skill-effect 스냅샷의 HP 변화 확인 |
| 적 턴에서 skill-effect의 value가 양수이다 | 적이 선공하도록 spd 설정, enemy의 skill-effect value > 0 확인 |

패턴: 기존 `makeCharacter()` + `ENEMY_SKILLS` + `vi.spyOn(Math, "random")` 재사용

### 2. `src/logic/event-formatter.test.ts` — 2개 테스트 추가

기존 18개 + 2개 = 20개

| 테스트명 | 검증 내용 |
|---------|---------|
| skip-turn(defeated) 이벤트를 포맷한다 | `"~은/는 쓰러졌습니다."` |
| skip-turn(no-mp) 이벤트를 포맷한다 | `"~은/는 마나가 부족하여 ~을/를 시전하지 못했습니다."` |

패턴: 기존 `snap` 상수 + `RoundEvent` 타입 인라인 생성

### 3. `src/logic/battle-log.test.ts` — 4개 테스트 추가 (새 describe 블록)

기존 4개(createLogEntry) + 4개(eventsToLegacyLogs) = 8개

| 테스트명 | 검증 내용 |
|---------|---------|
| skill-effect 이벤트를 변환한다 | skill-effect 2개 입력 → 2개 로그 출력, 필드 매핑 확인 |
| defend 이벤트를 변환한다 | defend 입력 → skillName="방어", skillType="defend", value=0 |
| skill-effect와 defend만 변환하고 나머지는 무시한다 | mixed 이벤트 → skill-effect+defend만 결과에 포함 |
| 빈 배열이면 빈 배열을 반환한다 | `[]` → `[]` |

패턴: `RoundEvent[]` 직접 구성, `CharacterSnapshot` 상수 추가

### 4. `src/logic/snapshot.test.ts` — 새 파일, 3개 테스트

| 테스트명 | 검증 내용 |
|---------|---------|
| BattleCharacter의 모든 필드를 포함한 스냅샷을 생성한다 | 각 필드 값 일치 확인 |
| baseStats를 깊은 복사한다 | 스냅샷 수정 후 원본 불변 확인 |
| buffs를 깊은 복사한다 | 스냅샷 buffs 수정 후 원본 불변 확인 |

패턴: `makeCharacter()` 헬퍼, `toSnapshot` import

## 검증
```bash
pnpm run test -- --run
pnpm run lint
```
