import type { Stats } from "@/types/character";
import type { OwHeroStatMeta, SubRoleBaseStats } from "@/types/ow-hero-meta";
import type { HeroPreset } from "@/types/preset";

/**
 * 서브역할군별 기본 스탯 템플릿 (총합 200)
 *
 * docs/preset-design.md "서브역할군 기본 템플릿" 참조.
 * 게임 규칙이 바뀌면 이 값만 수정하여 전체 프리셋을 재생성할 수 있다.
 */
export const SUB_ROLE_BASE_STATS: SubRoleBaseStats = {
  // ── 돌격 ──
  initiator: { hp: 82, mp: 45, atk: 18, def: 25, spd: 30 },
  brawler: { hp: 90, mp: 42, atk: 20, def: 28, spd: 20 },
  anchor: { hp: 95, mp: 40, atk: 15, def: 30, spd: 20 },
  // ── 공격 ──
  specialist: { hp: 55, mp: 75, atk: 25, def: 18, spd: 27 },
  scout: { hp: 58, mp: 78, atk: 22, def: 12, spd: 30 },
  flanker: { hp: 50, mp: 82, atk: 28, def: 10, spd: 30 },
  marksman: { hp: 50, mp: 80, atk: 30, def: 15, spd: 25 },
  // ── 지원 ──
  tactician: { hp: 50, mp: 90, atk: 12, def: 20, spd: 28 },
  medic: { hp: 50, mp: 95, atk: 10, def: 20, spd: 25 },
  survivor: { hp: 60, mp: 80, atk: 15, def: 22, spd: 23 },
};

/**
 * 50명 영웅의 OW 기반 스탯 메타데이터
 *
 * 각 영웅의 adjustments는 서브역할군 기본 스탯 대비 편차이며, 합계 0을 유지한다.
 * rationale는 OW에서의 캐릭터 특성을 기반으로 한 조정 근거이다.
 *
 * docs/preset-design.md "영웅별 미세 조정 기준" 참조.
 */
export const OW_HERO_STAT_META: OwHeroStatMeta[] = [
  // ── 돌격 / 개시자 ──────────────────────────────
  {
    heroId: "dva",
    name: "D.Va",
    role: "tank",
    subRole: "initiator",
    adjustments: { hp: 3, mp: -3, atk: -2, def: 2, spd: 0 },
    rationale:
      "메카 장갑으로 생존력 강화(+HP, +DEF), 파일럿 포의 낮은 화력(-ATK), 조종사 모드로 자원 제한(-MP)",
    description:
      "프로게이머 출신인 D.Va는 이제 뛰어난 실력으로 최첨단 메카를 조종하며 조국을 수호합니다.",
  },
  {
    heroId: "doomfist",
    name: "둠피스트",
    role: "tank",
    subRole: "initiator",
    adjustments: { hp: 3, mp: -5, atk: 4, def: -2, spd: 0 },
    rationale:
      "근접 강타로 고화력(+ATK), 쉴드 획득으로 체력 보강(+HP), 근접 특성상 방어 취약(-DEF), 기술 의존도 낮음(-MP)",
    description:
      "탈론의 지도자 중 하나인 둠피스트는 세계를 새로운 갈등으로 몰아넣고, 이를 통해 인류를 더욱 강하게 만들려는 계획을 갖고 있다.",
  },
  {
    heroId: "wrecking-ball",
    name: "레킹볼",
    role: "tank",
    subRole: "initiator",
    adjustments: { hp: -2, mp: 2, atk: 3, def: -3, spd: 0 },
    rationale:
      "볼 모드로 자원 활용 다양(+MP), 파일드라이버 충격파(+ATK), 장갑 없는 구조(-HP, -DEF)",
    description:
      "재주 많고 고도의 지능까지 갖춘 기계공 겸 투사 레킹볼은 호라이즌 달 기지의 실험실에서 깨어나 정커퀸의 용사가 되었습니다.",
  },
  {
    heroId: "winston",
    name: "윈스턴",
    role: "tank",
    subRole: "initiator",
    adjustments: { hp: 0, mp: 5, atk: -2, def: -3, spd: 0 },
    rationale:
      "고도의 지능과 과학 장비(+MP), 테슬라 캐논의 낮은 화력(-ATK), 경량 갑옷(-DEF)",
    description:
      "윈스턴은 극도로 지적인 유전자 조작 고릴라입니다. 훌륭한 과학자이자 인류가 지닌 잠재력의 강력한 옹호자이기도 합니다.",
  },

  // ── 돌격 / 투사 ──────────────────────────────
  {
    heroId: "roadhog",
    name: "로드호그",
    role: "tank",
    subRole: "brawler",
    adjustments: { hp: 5, mp: 0, atk: 2, def: -2, spd: -5 },
    rationale:
      "자가 회복으로 최고 체력(+HP), 스크랩 건 근접 화력(+ATK), 장갑 없이 맨몸(-DEF), 둔중한 체격(-SPD)",
    description:
      "로드호그는 무분별하고 악의적인 파괴 행위로 악명을 떨치는 강력한 싸움꾼입니다.",
  },
  {
    heroId: "mauga",
    name: "마우가",
    role: "tank",
    subRole: "brawler",
    adjustments: { hp: 2, mp: 0, atk: 5, def: -5, spd: -2 },
    rationale:
      "이중 체인건으로 최고 화력(+ATK), 돌진형이라 방어 약함(-DEF), 체격이 크고 체력 보강(+HP), 약간 느림(-SPD)",
    description:
      "카리스마 넘치는 교활한 사모아 전사 마우가는 전장의 혼돈 속에서 하루하루를 삶의 마지막 순간인 것처럼 살아간다.",
  },
  {
    heroId: "orisa",
    name: "오리사",
    role: "tank",
    subRole: "brawler",
    adjustments: { hp: 2, mp: 0, atk: -2, def: 2, spd: -2 },
    rationale:
      "강화 방어 장치(+DEF), 방어 로봇 구조(+HP), 느린 연사(-ATK), 둔중(-SPD)",
    description:
      "눔바니의 방어 로봇 OR15의 부품으로 만들어진 오리사는 아직 배울 점이 많지만, 새롭게 탄생한 도시의 수호자이다.",
  },
  {
    heroId: "zarya",
    name: "자리야",
    role: "tank",
    subRole: "brawler",
    adjustments: { hp: -5, mp: 5, atk: 3, def: -3, spd: 0 },
    rationale:
      "에너지 기반 방벽(+MP), 충전 시 고화력(+ATK), 가벼운 체격(-HP), 방벽 외 방어 약함(-DEF)",
    description:
      "세계에서 가장 강인한 여성 중 하나인 자리야는 한때 장래가 촉망되던 운동선수였으나, 가족과 조국을 보호하기 위해 나섰습니다.",
  },

  // ── 돌격 / 강건한 자 ──────────────────────────────
  {
    heroId: "domina",
    name: "도미나",
    role: "tank",
    subRole: "anchor",
    adjustments: { hp: -2, mp: 0, atk: 2, def: 0, spd: 0 },
    rationale:
      "경화광 조작으로 다재다능(+ATK), 에너지 기반이라 체력 약간 낮음(-HP)",
    description:
      "비슈카르 코퍼레이션에서 가장 귀중한 협상가인 도미나는 경화광을 능숙하게 다루는 기술로 어떤 상황에서도 주도권을 장악한다.",
  },
  {
    heroId: "ramattra",
    name: "라마트라",
    role: "tank",
    subRole: "anchor",
    adjustments: { hp: -3, mp: 0, atk: 5, def: -2, spd: 0 },
    rationale:
      "네메시스 형태로 근접 고화력(+ATK), 형태 전환으로 방어 분산(-DEF), 옴닉 구조(-HP)",
    description:
      "병사, 수도승, 혁명가. 널 섹터의 수장이 된 라마트라는 수단과 방법을 가리지 않고 모든 옴닉을 위해 싸운다.",
  },
  {
    heroId: "reinhardt",
    name: "라인하르트",
    role: "tank",
    subRole: "anchor",
    adjustments: { hp: 3, mp: -3, atk: 2, def: 0, spd: -2 },
    rationale:
      "중장갑 갑옷으로 최고 체력(+HP), 대형 해머 근접전(+ATK), 기술 의존도 낮음(-MP), 둔중한 장갑(-SPD)",
    description:
      "라인하르트 빌헬름은 용맹, 정의, 용기라는 기사도의 미덕을 따르는 흘러간 시대의 옛 용사입니다.",
  },
  {
    heroId: "sigma",
    name: "시그마",
    role: "tank",
    subRole: "anchor",
    adjustments: { hp: -5, mp: 8, atk: -3, def: 0, spd: 0 },
    rationale:
      "중력 조작의 높은 에너지(+MP), 순수 과학자로 물리적 체력 약함(-HP), 간접 공격이라 화력 낮음(-ATK)",
    description:
      "뛰어난 천체물리학자인 시그마는 실험 중에 일어난 불의의 사고로 중력의 힘을 통제할 수 있게 되었다.",
  },
  {
    heroId: "junker-queen",
    name: "정커퀸",
    role: "tank",
    subRole: "anchor",
    adjustments: { hp: -5, mp: 0, atk: 5, def: -3, spd: 3 },
    rationale:
      "근접 격투 스타일로 고화력(+ATK), 기민한 통치자(+SPD), 정크타운 장비로 방어 약함(-DEF), 날렵한 체격(-HP)",
    description:
      "어렸을 적에 척박한 황무지로 쫓겨난 오데사 '데즈' 스톤은 날카로운 웃음과 압도적인 힘으로 쓰레기촌을 통치한다.",
  },
  {
    heroId: "hazard",
    name: "해저드",
    role: "tank",
    subRole: "anchor",
    adjustments: { hp: -5, mp: 5, atk: 2, def: -2, spd: 0 },
    rationale:
      "폭발물 기반 에너지(+MP), 파괴적 전투 스타일(+ATK), 가벼운 장비(-HP, -DEF)",
    description:
      "급진적인 파괴자이자 막을 수 없는 무기 그 자체인 해저드는 체제를 붕괴시키기 위해 싸우던 중 지하 범죄 세계에서 일약 스타가 되었다.",
  },

  // ── 공격 / 전문가 ──────────────────────────────
  {
    heroId: "mei",
    name: "메이",
    role: "damage",
    subRole: "specialist",
    adjustments: { hp: 5, mp: 0, atk: -3, def: 5, spd: -7 },
    rationale:
      "빙결 자가 치유(+HP), 얼음벽 방어(+DEF), 느린 동결 무기(-ATK), 둔중한 동결 메커니즘(-SPD)",
    description:
      "메이는 환경을 보존하기 위해 자기 손으로 직접 싸우는 과학자입니다.",
  },
  {
    heroId: "bastion",
    name: "바스티온",
    role: "damage",
    subRole: "specialist",
    adjustments: { hp: 0, mp: 0, atk: 5, def: 2, spd: -7 },
    rationale:
      "포탑 모드 최고 화력(+ATK), 로봇 장갑(+DEF), 고정 배치로 기동력 없음(-SPD)",
    description:
      "옴닉 사태의 최전선에 있던 이 호기심 많은 바스티온은 아름다운 자연에 매료되어 세계를 탐험합니다.",
  },
  {
    heroId: "soldier-76",
    name: "솔저: 76",
    role: "damage",
    subRole: "specialist",
    adjustments: { hp: 5, mp: -3, atk: 0, def: -2, spd: 0 },
    rationale:
      "강화 병사로 체력 보강(+HP), 자가 치유(+HP), 중화기 특성상 자원 덜 사용(-MP), 경장갑(-DEF)",
    description:
      "전 세계의 수배를 받고 있는 무법자, 솔저: 76는 오버워치 몰락의 배후에 숨겨진 진실을 밝혀내기 위해 혼자만의 전쟁을 선포했다.",
  },
  {
    heroId: "symmetra",
    name: "시메트라",
    role: "damage",
    subRole: "specialist",
    adjustments: { hp: 0, mp: 5, atk: -3, def: 2, spd: -4 },
    rationale:
      "경화광 건축가로 에너지 풍부(+MP), 포탑 방어(+DEF), 간접 공격이라 화력 약함(-ATK), 정적인 플레이(-SPD)",
    description:
      "시메트라는 말 그대로 현실을 뒤튼다. 경화광으로 이루어진 구조물을 창조해 자신이 바라는 세계를 형성한다.",
  },
  {
    heroId: "emre",
    name: "엠레",
    role: "damage",
    subRole: "specialist",
    adjustments: { hp: -3, mp: 0, atk: 3, def: -3, spd: 3 },
    rationale:
      "미지의 힘으로 강화된 공격력(+ATK), 기민한 전투원(+SPD), 조종당한 상태로 불안정(-HP, -DEF)",
    description:
      "오버워치 타격팀에서 눈부신 활약을 펼쳤던 엠레는 자취를 감췄다가 수년 후 미지의 존재에게 조종당한 상태로 다시 나타났습니다.",
  },
  {
    heroId: "junkrat",
    name: "정크랫",
    role: "damage",
    subRole: "specialist",
    adjustments: { hp: 3, mp: 0, atk: 5, def: -3, spd: -5 },
    rationale:
      "폭발물 고화력(+ATK), 광기로 인한 내구성(+HP), 폭발에 자신도 취약(-DEF), 의족이라 느림(-SPD)",
    description:
      "폭발물에 광적으로 집착하는 정크랫은 세상에 혼돈과 파괴를 불러오기 위해 살아가는 미치광이다.",
  },
  {
    heroId: "torbjorn",
    name: "토르비욘",
    role: "damage",
    subRole: "specialist",
    adjustments: { hp: 5, mp: 0, atk: 0, def: 7, spd: -12 },
    rationale:
      "강화 갑옷(+HP, +DEF), 포탑과 함께 진지 방어(+DEF), 키가 작고 둔중(-SPD)",
    description:
      "전성기 시절 오버워치는 가장 진보된 최첨단 무기를 보유했으며, 그 출처는 바로 토르비욘이라는 전무후무한 기술자의 작업장이었습니다.",
  },

  // ── 공격 / 수색가 ──────────────────────────────
  {
    heroId: "sombra",
    name: "솜브라",
    role: "damage",
    subRole: "scout",
    adjustments: { hp: 0, mp: 5, atk: -3, def: -2, spd: 0 },
    rationale:
      "해킹 능력으로 높은 자원(+MP), 은밀한 침투 특성상 화력 낮음(-ATK), 경장비(-DEF)",
    description:
      "세계에서 가장 악명 높은 해커로 손꼽히는 솜브라는 정보를 이용해 권력자들을 조종합니다.",
  },
  {
    heroId: "echo",
    name: "에코",
    role: "damage",
    subRole: "scout",
    adjustments: { hp: -5, mp: 2, atk: 3, def: 0, spd: 0 },
    rationale:
      "적응형 AI로 다재다능(+MP), 복제 능력으로 높은 화력(+ATK), 가벼운 로봇 구조(-HP)",
    description:
      "에코는 세계에서 가장 복잡한 인공 지능을 갖추고 전장에서 다양한 역할을 수행하는 적응형 로봇입니다.",
  },
  {
    heroId: "pharah",
    name: "파라",
    role: "damage",
    subRole: "scout",
    adjustments: { hp: -2, mp: -3, atk: 5, def: 0, spd: 0 },
    rationale:
      "로켓 발사기 고화력(+ATK), 전투복의 연료 소모로 자원 제한(-MP), 공중에서 피격 취약(-HP)",
    description:
      "파라의 충직성은 핏줄에 흐르고 있다. 유서 깊은 군인 가문 출신으로, 명예롭게 복무하고자 하는 열망으로 불탄다.",
  },
  {
    heroId: "freja",
    name: "프레야",
    role: "damage",
    subRole: "scout",
    adjustments: { hp: 2, mp: -3, atk: -2, def: 3, spd: 0 },
    rationale:
      "수색 구조 경험으로 생존력 보강(+HP, +DEF), 현상금 사냥꾼의 실용적 장비(-MP), 추적 특화로 화력 보통(-ATK)",
    description:
      "전직 수색 구조 요원에서 현상금 사냥꾼으로 전직한 프레야는 대가만 제대로 지불한다면 누구든 찾아냅니다.",
  },

  // ── 공격 / 측면 공격가 ──────────────────────────────
  {
    heroId: "genji",
    name: "겐지",
    role: "damage",
    subRole: "flanker",
    adjustments: { hp: -4, mp: 0, atk: 2, def: 2, spd: 0 },
    rationale:
      "사이보그 강화 검술(+ATK), 기계 몸체 방어(+DEF), 유기체 부분 약함(-HP)",
    description:
      "사이보그 시마다 겐지는 한때 거부했던 자신의 로봇 육체를 받아들였으며, 그 과정에서 한 차원 더 높은 인간성을 갖게 되었습니다.",
  },
  {
    heroId: "reaper",
    name: "리퍼",
    role: "damage",
    subRole: "flanker",
    adjustments: { hp: 5, mp: -2, atk: 2, def: 0, spd: -5 },
    rationale:
      "영혼 흡수로 자가 회복(+HP), 산탄총 근접 고화력(+ATK), 그림자 걸음으로 자원 소모(-MP), 근접 특성상 느림(-SPD)",
    description:
      "검은 망토를 입은 테러리스트 리퍼. 그가 나타나는 곳에는 언제나 죽음의 그림자가 드리운다.",
  },
  {
    heroId: "vendetta",
    name: "벤데타",
    role: "damage",
    subRole: "flanker",
    adjustments: { hp: 0, mp: 0, atk: 0, def: 0, spd: 0 },
    rationale: "균형 잡힌 측면 공격가, 서브역할군 기본 템플릿과 일치",
    description:
      "콜로세오의 챔피언이자 이탈리아의 엘리트 계층인 벤데타는 자신의 가문이 이끌던 범죄 제국의 왕좌를 되찾기 위해서라면 무슨 일이든 할 것입니다.",
  },
  {
    heroId: "venture",
    name: "벤처",
    role: "damage",
    subRole: "flanker",
    adjustments: { hp: 3, mp: -2, atk: -4, def: 3, spd: 0 },
    rationale:
      "굴착 도구로 방어 보강(+DEF), 지중 이동으로 생존력(+HP), 고고학자라 전투력 약함(-ATK), 실용적 장비(-MP)",
    description:
      "역사의 수수께끼에 대한 열정으로 똘똘 뭉친 고고학자 벤처는 굴착 도구를 사용해 과거를 밝혀내고, 그 유산을 위협하는 자들을 막아낸다.",
  },
  {
    heroId: "anran",
    name: "안란",
    role: "damage",
    subRole: "flanker",
    adjustments: { hp: -2, mp: 0, atk: 2, def: 0, spd: 0 },
    rationale:
      "불 학부 졸업생으로 화력 강화(+ATK), 에너지 소모가 심한 체질(-HP)",
    description:
      "오행 대학 불 학부의 우수 졸업생 안란은 언제나 자신의 한계를 뛰어넘으려고 불타오릅니다.",
  },
  {
    heroId: "tracer",
    name: "트레이서",
    role: "damage",
    subRole: "flanker",
    adjustments: { hp: -5, mp: 5, atk: 0, def: 0, spd: 0 },
    rationale: "시간 도약 장치로 자원 풍부(+MP), 최저 체력의 유리체(-HP)",
    description:
      "전직 오버워치 요원인 트레이서는 시간을 넘나드는 활기찬 모험가입니다.",
  },

  // ── 공격 / 명사수 ──────────────────────────────
  {
    heroId: "sojourn",
    name: "소전",
    role: "damage",
    subRole: "marksman",
    adjustments: { hp: 2, mp: 0, atk: 0, def: 2, spd: -4 },
    rationale:
      "사이버네틱 강화로 생존력 보강(+HP, +DEF), 레일건 충전으로 정적 플레이(-SPD)",
    description:
      "다양한 사이버네틱 강화를 거친 소전은 빼어난 전략가이다. 자신의 신념을 절대 굽히지 않는 그녀는 귀중한 아군이 될 수도, 두려운 적이 될 수도 있다.",
  },
  {
    heroId: "ashe",
    name: "애쉬",
    role: "damage",
    subRole: "marksman",
    adjustments: { hp: 5, mp: 0, atk: 0, def: -2, spd: -3 },
    rationale:
      "갱단 두목의 터프함(+HP), 경장비(-DEF), 레버액션 소총의 느린 연사(-SPD)",
    description:
      "애쉬는 미국 남서부를 뒤흔들고 있는 강도와 범죄자 집단인 데드락 갱단의 두목이다.",
  },
  {
    heroId: "widowmaker",
    name: "위도우메이커",
    role: "damage",
    subRole: "marksman",
    adjustments: { hp: -5, mp: 5, atk: 0, def: 0, spd: 0 },
    rationale: "저격 전문가로 정밀 조준 자원(+MP), 생체 개조로 감각 둔화(-HP)",
    description:
      "위도우메이커는 더할 나위 없는 암살자다. 참을성 있게 한 순간의 빈틈을 노리고, 아무런 자비 없이 효과적인 살상을 한다.",
  },
  {
    heroId: "cassidy",
    name: "캐서디",
    role: "damage",
    subRole: "marksman",
    adjustments: { hp: 5, mp: -5, atk: 0, def: 3, spd: -3 },
    rationale:
      "노련한 무법자의 강인함(+HP, +DEF), 리볼버라 자원 소모 적음(-MP), 권총 사거리 한계(-SPD)",
    description:
      "피스키퍼 리볼버로 무장한 무법자 콜 캐서디는 자신만의 방식으로 정의를 실현한다.",
  },
  {
    heroId: "hanzo",
    name: "한조",
    role: "damage",
    subRole: "marksman",
    adjustments: { hp: -3, mp: 2, atk: 0, def: -2, spd: 3 },
    rationale:
      "용의 정신으로 에너지 보강(+MP), 닌자 기동력(+SPD), 경장갑(-DEF), 날렵한 체격(-HP)",
    description:
      "궁수이자 암살자로서 실력을 연마한 시마다 한조는 자신이 타의 추종을 불허하는 전사임을 증명하려고 애씁니다.",
  },

  // ── 지원 / 전술가 ──────────────────────────────
  {
    heroId: "lucio",
    name: "루시우",
    role: "support",
    subRole: "tactician",
    adjustments: { hp: 2, mp: -2, atk: -2, def: 0, spd: 2 },
    rationale:
      "속도 부스트 뮤지션(+SPD), 음파 장치로 체력 보강(+HP), 음악 기반이라 자원 소모(-MP), 사운드건 저화력(-ATK)",
    description:
      "루시우는 음악과 행동으로 사회 변화를 주도하는 세계적인 유명인사이자 뮤지션이다.",
  },
  {
    heroId: "baptiste",
    name: "바티스트",
    role: "support",
    subRole: "tactician",
    adjustments: { hp: 5, mp: -5, atk: 3, def: 0, spd: -3 },
    rationale:
      "전투 의무병으로 체력 강함(+HP), 전투 훈련으로 화력 보강(+ATK), 실전 중심이라 자원 적음(-MP), 장비 무게(-SPD)",
    description:
      "최정예 전투 의무병이자 전 탈론 요원이었던 바티스트는 이제 자신의 능력으로 전쟁의 피해를 받은 자들을 돕기로 결심했다.",
  },
  {
    heroId: "ana",
    name: "아나",
    role: "support",
    subRole: "tactician",
    adjustments: { hp: 0, mp: 0, atk: 5, def: 0, spd: -5 },
    rationale:
      "저격 치유/공격 겸용으로 화력 높음(+ATK), 노련하지만 나이 들어 느림(-SPD)",
    description:
      "오버워치 창립자 중 한 명인 아나는 탁월한 전투 능력과 노련함으로 고향과 자신에게 가장 소중한 이들을 지킵니다.",
  },
  {
    heroId: "zenyatta",
    name: "젠야타",
    role: "support",
    subRole: "tactician",
    adjustments: { hp: -5, mp: 5, atk: 3, def: -3, spd: 0 },
    rationale:
      "정신 에너지 풍부(+MP), 부조화 구슬로 공격력(+ATK), 방랑 수도사라 방어 약함(-DEF), 기계 몸체지만 가벼움(-HP)",
    description:
      "젠야타는 정신적 깨달음을 위해 온 세계를 방랑하는 옴닉의 수도사입니다.",
  },
  {
    heroId: "jetpack-cat",
    name: "제트팩 캣",
    role: "support",
    subRole: "tactician",
    adjustments: { hp: 3, mp: 0, atk: -3, def: 2, spd: -2 },
    rationale:
      "제트팩 방어(+DEF), 고양이 9개의 목숨(+HP), 작은 체구로 화력 약함(-ATK), 제트팩 무게(-SPD)",
    description:
      "브리기테의 최신 제트 추진 발명품을 등에 업은 겁 없는 고양이 파일럿, 제트팩 캣은 깜찍하게 공중 지원에 나선다.",
  },

  // ── 지원 / 의무관 ──────────────────────────────
  {
    heroId: "lifeweaver",
    name: "라이프위버",
    role: "support",
    subRole: "medic",
    adjustments: { hp: 0, mp: 3, atk: -3, def: 2, spd: -2 },
    rationale:
      "생명의 줄기 에너지(+MP), 꽃잎 플랫폼 방어(+DEF), 평화적 성향(-ATK), 정적인 치유 스타일(-SPD)",
    description:
      "과학자, 예술가, 그리고 활동가인 라이프위버는 자연의 아름다움과 과학의 실용성을 엮어 세상을 치유하려 한다.",
  },
  {
    heroId: "mercy",
    name: "메르시",
    role: "support",
    subRole: "medic",
    adjustments: { hp: 3, mp: 2, atk: -5, def: -2, spd: 2 },
    rationale:
      "발키리 슈트로 생존력(+HP), 자가 재생(+MP), 평화주의자로 최저 화력(-ATK), 경장비(-DEF), 비행 능력(+SPD)",
    description:
      "수호천사와도 같이 사람을 보살피는 메르시는 발군의 치유사이자 뛰어난 과학자, 열성적인 평화주의자입니다.",
  },
  {
    heroId: "moira",
    name: "모이라",
    role: "support",
    subRole: "medic",
    adjustments: { hp: 5, mp: -8, atk: 5, def: -2, spd: 0 },
    rationale:
      "생명력 흡수로 체력 보강(+HP), 유전 공학 공격력(+ATK), 흡수/방출 이원 구조로 자원 소모 큼(-MP), 경장비(-DEF)",
    description:
      "탁월하지만 논란도 끊이지 않는 과학자 모이라는 유전 공학의 최첨단을 달리며 생명체의 기본 구성 요소를 고쳐 쓸 방법을 찾고 있습니다.",
  },
  {
    heroId: "kiriko",
    name: "키리코",
    role: "support",
    subRole: "medic",
    adjustments: { hp: -5, mp: -5, atk: 5, def: 0, spd: 5 },
    rationale:
      "쿠나이 높은 화력(+ATK), 인술 고기동(+SPD), 가벼운 체격(-HP), 영적 능력에 의존하여 자원 소모(-MP)",
    description:
      "카네자카 신사의 미코이자 시마다 전 검성의 딸인 키리코는 영적 능력 및 인술을 활용하여 분열된 고향을 치유합니다.",
  },

  // ── 지원 / 생존왕 ──────────────────────────────
  {
    heroId: "mizuki",
    name: "미즈키",
    role: "support",
    subRole: "survivor",
    adjustments: { hp: 0, mp: 3, atk: -3, def: 0, spd: 0 },
    rationale: "저주의 힘으로 자원 보강(+MP), 비전투적 성향(-ATK)",
    description:
      "불운의 그림자에서 태어난 미즈키는 저주에서 벗어나 스스로 운명을 정하기 위해서라면 무엇이든 할 것이다.",
  },
  {
    heroId: "brigitte",
    name: "브리기테",
    role: "support",
    subRole: "survivor",
    adjustments: { hp: 8, mp: -10, atk: 3, def: 5, spd: -6 },
    rationale:
      "갑옷과 방패(+HP, +DEF), 근접 철퇴(+ATK), 기계공이라 자원 적음(-MP), 중장갑으로 둔중(-SPD)",
    description:
      "라인하르트의 종자인 브리기테 린드홀름은 도움이 필요한 자들을 돕기 위해 무기를 들고 전장에서 싸우는 전직 기계공학 기술자이다.",
  },
  {
    heroId: "illari",
    name: "일리아리",
    role: "support",
    subRole: "survivor",
    adjustments: { hp: -3, mp: 2, atk: 3, def: 0, spd: -2 },
    rationale:
      "태양 에너지 기반(+MP), 태양광 공격력(+ATK), 에너지 방출로 체력 소모(-HP), 에너지 충전 필요(-SPD)",
    description:
      "최후의 인티 전사인 일리아리는 태양의 힘을 담는 그릇입니다. 과거를 속죄하기 위해서라면 무엇이든 할 겁니다.",
  },
  {
    heroId: "wuyang",
    name: "우양",
    role: "support",
    subRole: "survivor",
    adjustments: { hp: 2, mp: 0, atk: -3, def: 3, spd: -2 },
    rationale:
      "물의 치유력으로 생존력(+HP), 물의 방어막(+DEF), 치유 특화로 화력 약함(-ATK), 물의 무게(-SPD)",
    description:
      "오행 대학 물 학부의 치유 능력을 다루는 우양은 언제나 전투의 흐름을 바꿀 준비가 되어 있습니다.",
  },
  {
    heroId: "juno",
    name: "주노",
    role: "support",
    subRole: "survivor",
    adjustments: { hp: -5, mp: 2, atk: 0, def: -2, spd: 5 },
    rationale:
      "우주 기술로 자원 보강(+MP), 화성 저중력 적응 고기동(+SPD), 우주에서 자란 약한 체격(-HP), 경량 장비(-DEF)",
    description:
      "화성에서 태어난 최초의 인류, 주노는 우주 시대의 기술을 사용하여 자신의 궤도를 침범하는 문제를 해결합니다.",
  },
];

/** 메타데이터 + 변환 규칙으로 HeroPreset을 생성한다 */
export function generateHeroPreset(
  meta: OwHeroStatMeta,
  baseStats: SubRoleBaseStats,
): HeroPreset {
  const base = baseStats[meta.subRole];
  const stats: Stats = {
    hp: base.hp + meta.adjustments.hp,
    mp: base.mp + meta.adjustments.mp,
    atk: base.atk + meta.adjustments.atk,
    def: base.def + meta.adjustments.def,
    spd: base.spd + meta.adjustments.spd,
  };

  return {
    id: meta.heroId,
    name: meta.name,
    role: meta.role,
    subRole: meta.subRole,
    description: meta.description,
    stats,
  };
}

/** 전체 메타데이터로 HeroPreset 배열을 생성한다 */
export function generateAllHeroPresets(
  heroes: OwHeroStatMeta[] = OW_HERO_STAT_META,
  baseStats: SubRoleBaseStats = SUB_ROLE_BASE_STATS,
): HeroPreset[] {
  return heroes.map((meta) => generateHeroPreset(meta, baseStats));
}
