import type {
  ConversionRule,
  OwHeroMeta,
  OwSkillCategory,
} from "@/types/ow-skill-meta";

/**
 * 카테고리별 게임 스킬 변환 규칙.
 * docs/skill-conversion-guide.md의 변환표를 코드로 구조화.
 * 규칙을 추가/수정하면 프리셋을 재생성할 수 있다.
 */
export const CONVERSION_RULES: Record<OwSkillCategory, ConversionRule> = {
  ultimate_damage: {
    gameType: "attack",
    mpCost: { min: 20, max: 30 },
    multiplier: { min: 2.5, max: 3.0 },
  },
  ultimate_cc: {
    gameType: "debuff",
    target: "def",
    mpCost: { min: 18, max: 25 },
    value: { min: 7, max: 10 },
    duration: { min: 3, max: 5 },
  },
  ultimate_heal: {
    gameType: "heal",
    mpCost: { min: 22, max: 28 },
    healAmount: { min: 40, max: 50 },
  },
  ultimate_buff: {
    gameType: "buff",
    target: "atk",
    mpCost: { min: 18, max: 25 },
    value: { min: 8, max: 10 },
    duration: { min: 3, max: 5 },
  },
  attack: {
    gameType: "attack",
    mpCost: { min: 8, max: 15 },
    multiplier: { min: 1.3, max: 2.0 },
  },
  movement: {
    gameType: "buff",
    target: "def",
    mpCost: { min: 5, max: 10 },
    value: { min: 3, max: 6 },
    duration: { min: 1, max: 2 },
  },
  barrier: {
    gameType: "buff",
    target: "def",
    mpCost: { min: 10, max: 18 },
    value: { min: 7, max: 10 },
    duration: { min: 2, max: 4 },
  },
  healing: {
    gameType: "heal",
    mpCost: { min: 8, max: 18 },
    healAmount: { min: 15, max: 35 },
  },
  self_heal: {
    gameType: "heal",
    mpCost: { min: 8, max: 18 },
    healAmount: { min: 15, max: 35 },
  },
  attack_buff: {
    gameType: "buff",
    target: "atk",
    mpCost: { min: 8, max: 15 },
    value: { min: 3, max: 8 },
    duration: { min: 2, max: 4 },
  },
  cc: {
    gameType: "debuff",
    target: "def",
    mpCost: { min: 8, max: 15 },
    value: { min: 3, max: 8 },
    duration: { min: 2, max: 4 },
  },
};

/**
 * 오버워치 영웅별 스킬 메타데이터.
 * 각 스킬의 공식 이름(축약 전), 분류, 동작 설명을 저장.
 * skill-presets.ts의 게임 스킬은 이 메타데이터 + CONVERSION_RULES로 도출.
 */
export const OW_HERO_META: OwHeroMeta[] = [
  // ── 돌격 (Tank) ──────────────────────────────

  {
    heroId: "dva",
    name: "D.Va",
    role: "tank",
    skills: [
      {
        name: "부스터",
        category: "movement",
        description: "메카로 전방 돌진, 접촉한 적을 밀침",
      },
      {
        name: "방어 매트릭스",
        category: "barrier",
        description: "전방 투사체를 흡수하는 방어막 전개",
      },
      {
        name: "마이크로 미사일",
        category: "attack",
        description: "소형 미사일을 부채꼴로 일제 발사",
      },
      {
        name: "자폭",
        category: "ultimate_damage",
        description: "메카를 자폭시켜 광범위 폭발 피해",
      },
    ],
  },

  {
    heroId: "doomfist",
    name: "둠피스트",
    role: "tank",
    skills: [
      {
        name: "로켓 펀치",
        category: "attack",
        description: "충전 후 전방으로 강력한 돌진 펀치",
      },
      {
        name: "지진 강타",
        category: "cc",
        description: "공중에서 지면을 내려찍어 주변 적을 띄움",
      },
      {
        name: "파워 블락",
        category: "barrier",
        description: "전방 피해를 흡수하는 방어 자세",
      },
      {
        name: "파멸의 일격",
        category: "ultimate_damage",
        description: "공중에서 낙하하며 지면 광역 강타",
      },
    ],
  },

  {
    heroId: "wrecking-ball",
    name: "레킹볼",
    role: "tank",
    skills: [
      {
        name: "구르기",
        category: "movement",
        description: "공 형태로 변환해 고속 이동",
      },
      {
        name: "갈고리 고정",
        category: "attack",
        description: "갈고리를 고정해 원형으로 돌며 충돌 피해",
      },
      {
        name: "파일드라이버",
        category: "attack",
        description: "공중에서 지면으로 낙하 충격",
      },
      {
        name: "지뢰밭",
        category: "ultimate_cc",
        description: "주변에 대량의 근접 지뢰를 살포",
      },
    ],
  },

  {
    heroId: "winston",
    name: "윈스턴",
    role: "tank",
    skills: [
      {
        name: "점프 팩",
        category: "attack",
        description: "멀리 도약해 착지 시 범위 피해",
      },
      {
        name: "방벽 생성기",
        category: "barrier",
        description: "구형 방벽을 설치하여 팀 보호",
      },
      {
        name: "테슬라 캐논",
        category: "attack",
        description: "전방 다수 적에게 전기 방사",
      },
      {
        name: "원시의 분노",
        category: "ultimate_buff",
        description: "분노 상태로 체력 급증 및 근접 강화",
      },
    ],
  },

  {
    heroId: "roadhog",
    name: "로드호그",
    role: "tank",
    skills: [
      {
        name: "갈고리 사슬",
        category: "cc",
        description: "갈고리를 던져 적을 끌어당김",
      },
      {
        name: "숨돌리기",
        category: "self_heal",
        description: "짧은 시간 체력을 대량 회복 (자가 치유)",
      },
      {
        name: "고철총",
        category: "attack",
        description: "근거리 고위력 산탄 발사",
      },
      {
        name: "돼재앙",
        category: "ultimate_damage",
        description: "연사 모드로 적을 밀치며 대량 피해",
      },
    ],
  },

  {
    heroId: "mauga",
    name: "마우가",
    role: "tank",
    skills: [
      {
        name: "돌파",
        category: "attack",
        description: "전방으로 돌진하며 경로의 적에게 피해",
      },
      {
        name: "터질 듯한 심장",
        category: "self_heal",
        description: "과열 상태에서 체력 회복 (자가 치유)",
      },
      {
        name: "광전사",
        category: "attack_buff",
        description: "과열 시 공격력 증가",
      },
      {
        name: "케이지 혈투",
        category: "ultimate_cc",
        description: "원형 격투장을 생성해 적을 가둠",
      },
    ],
  },

  {
    heroId: "orisa",
    name: "오리사",
    role: "tank",
    skills: [
      {
        name: "수호의 창",
        category: "barrier",
        description: "창을 회전시켜 투사체를 파괴하며 전진",
      },
      {
        name: "투창",
        category: "attack",
        description: "에너지 투창을 던져 적에게 피해와 밀침",
      },
      {
        name: "방어 강화",
        category: "barrier",
        description: "일정 시간 받는 피해를 대폭 감소",
      },
      {
        name: "대지의 창",
        category: "ultimate_damage",
        description: "주변 적을 끌어당긴 뒤 강력한 대지 강타",
      },
    ],
  },

  {
    heroId: "zarya",
    name: "자리야",
    role: "tank",
    skills: [
      {
        name: "입자 방벽",
        category: "barrier",
        description: "자신에게 피해 흡수 방벽 생성",
      },
      {
        name: "방벽 씌우기",
        category: "barrier",
        description: "아군에게 피해 흡수 방벽 생성",
      },
      {
        name: "입자포",
        category: "attack",
        description: "입자 빔 또는 에너지탄 발사",
      },
      {
        name: "중력자탄",
        category: "ultimate_cc",
        description: "블랙홀을 생성해 주변 적을 끌어모음",
      },
    ],
  },

  {
    heroId: "domina",
    name: "도미나",
    role: "tank",
    skills: [
      {
        name: "방벽 배열",
        category: "barrier",
        description: "광역 방벽 배열을 전개하여 팀 보호",
      },
      {
        name: "수정 발사",
        category: "attack",
        description: "수정 에너지를 발사하여 적에게 피해",
      },
      {
        name: "소닉 리펄서",
        category: "cc",
        description: "음파로 적을 밀쳐내고 둔화",
      },
      {
        name: "판옵티콘",
        category: "ultimate_cc",
        description: "광역 감시 시스템으로 적을 제압",
      },
    ],
  },

  {
    heroId: "ramattra",
    name: "라마트라",
    role: "tank",
    skills: [
      {
        name: "공허 방벽",
        category: "barrier",
        description: "전방에 방벽을 설치해 투사체 차단",
      },
      {
        name: "응징",
        category: "attack",
        description: "네메시스 형태에서 강력한 근접 공격",
      },
      {
        name: "탐식의 소용돌이",
        category: "cc",
        description: "나노 소용돌이로 적을 둔화",
      },
      {
        name: "절멸",
        category: "ultimate_cc",
        description: "네메시스 강화 상태로 주변 적에게 지속 피해",
      },
    ],
  },

  {
    heroId: "reinhardt",
    name: "라인하르트",
    role: "tank",
    skills: [
      {
        name: "방벽 방패",
        category: "barrier",
        description: "거대한 방패를 들어 팀을 보호",
      },
      {
        name: "돌진",
        category: "attack",
        description: "전방으로 돌진해 적을 벽에 박음",
      },
      {
        name: "화염 강타",
        category: "attack",
        description: "해머를 휘둘러 화염 투사체 발사",
      },
      {
        name: "대지분쇄",
        category: "ultimate_cc",
        description: "해머로 지면을 강타해 전방 적을 기절",
      },
    ],
  },

  {
    heroId: "sigma",
    name: "시그마",
    role: "tank",
    skills: [
      {
        name: "실험용 방벽",
        category: "barrier",
        description: "원하는 위치에 방벽을 설치",
      },
      {
        name: "강착",
        category: "attack",
        description: "바위를 투사해 적에게 피해와 넉백",
      },
      {
        name: "키네틱 손아귀",
        category: "barrier",
        description: "적 투사체를 흡수해 보호막으로 전환",
      },
      {
        name: "중력 붕괴",
        category: "ultimate_damage",
        description: "적을 공중으로 들어올린 뒤 낙하 피해",
      },
    ],
  },

  {
    heroId: "junker-queen",
    name: "정커퀸",
    role: "tank",
    skills: [
      {
        name: "지휘의 외침",
        category: "attack_buff",
        description: "아군의 이동/공격 속도 일시 증가",
      },
      {
        name: "도륙",
        category: "attack",
        description: "도끼를 던져 적에게 피해와 출혈",
      },
      {
        name: "톱니칼",
        category: "cc",
        description: "칼로 적을 베어 출혈과 둔화",
      },
      {
        name: "살육",
        category: "ultimate_damage",
        description: "돌진하며 경로의 적에게 대량 출혈 피해",
      },
    ],
  },

  {
    heroId: "hazard",
    name: "해저드",
    role: "tank",
    skills: [
      {
        name: "벽 넘기",
        category: "movement",
        description: "벽을 넘어 빠르게 이동",
      },
      {
        name: "가시벽",
        category: "barrier",
        description: "가시로 된 벽을 생성해 경로 차단",
      },
      {
        name: "날카로운 저항",
        category: "cc",
        description: "가시로 적에게 피해와 둔화",
      },
      {
        name: "가시 소나기",
        category: "ultimate_damage",
        description: "대량의 가시를 쏟아내 광범위 피해",
      },
    ],
  },

  // ── 공격 (Damage) ──────────────────────────────

  {
    heroId: "mei",
    name: "메이",
    role: "damage",
    skills: [
      {
        name: "냉각총",
        category: "cc",
        description: "적을 서서히 둔화시키고 빙결",
      },
      {
        name: "빙벽",
        category: "barrier",
        description: "얼음 벽을 생성해 경로 차단",
      },
      {
        name: "급속 빙결",
        category: "self_heal",
        description: "자신을 얼려 무적 상태에서 체력 회복",
      },
      {
        name: "눈보라",
        category: "ultimate_cc",
        description: "광범위 눈보라로 적을 둔화/빙결",
      },
    ],
  },

  {
    heroId: "bastion",
    name: "바스티온",
    role: "damage",
    skills: [
      {
        name: "설정: 수색",
        category: "attack",
        description: "정찰 모드로 이동하며 사격",
      },
      {
        name: "A-36 전술 수류탄",
        category: "attack",
        description: "수류탄을 발사해 범위 피해",
      },
      {
        name: "설정: 강습",
        category: "attack_buff",
        description: "포탑 모드로 변환해 화력 증가",
      },
      {
        name: "설정: 포격",
        category: "ultimate_damage",
        description: "포격 모드로 변환해 원거리 포탄 3발 발사",
      },
    ],
  },

  {
    heroId: "soldier-76",
    name: "솔저: 76",
    role: "damage",
    skills: [
      {
        name: "나선 로켓",
        category: "attack",
        description: "소형 로켓을 발사해 범위 피해",
      },
      {
        name: "질주",
        category: "movement",
        description: "빠른 속도로 전방 질주",
      },
      {
        name: "생체장",
        category: "healing",
        description: "장치를 설치해 범위 내 아군 지속 회복",
      },
      {
        name: "전술 조준경",
        category: "ultimate_damage",
        description: "조준경 활성화로 자동 조준 사격",
      },
    ],
  },

  {
    heroId: "symmetra",
    name: "시메트라",
    role: "damage",
    skills: [
      {
        name: "광자 발사기",
        category: "attack",
        description: "빔 또는 광자 구체를 발사",
      },
      {
        name: "감시 포탑",
        category: "cc",
        description: "소형 포탑을 설치해 적을 둔화/피해",
      },
      {
        name: "순간이동기",
        category: "movement",
        description: "텔레포터를 설치해 팀 이동",
      },
      {
        name: "광자 방벽",
        category: "ultimate_buff",
        description: "맵을 가로지르는 거대 방벽 생성",
      },
    ],
  },

  {
    heroId: "emre",
    name: "엠레",
    role: "damage",
    skills: [
      {
        name: "사이버 파편 수류탄",
        category: "cc",
        description: "수류탄으로 적에게 피해와 상태이상",
      },
      {
        name: "사이펀 블라스터",
        category: "attack",
        description: "에너지를 흡수하며 발사하는 주무기",
      },
      {
        name: "합성 점사 소총",
        category: "attack",
        description: "점사 모드의 소총 사격",
      },
      {
        name: "오버라이드 프로토콜",
        category: "ultimate_damage",
        description: "강화 프로토콜로 대폭 화력 증가",
      },
    ],
  },

  {
    heroId: "junkrat",
    name: "정크랫",
    role: "damage",
    skills: [
      {
        name: "충격 지뢰",
        category: "attack",
        description: "원격 폭파 가능한 지뢰를 투척",
      },
      {
        name: "강철 덫",
        category: "cc",
        description: "바닥에 덫을 설치해 밟은 적을 속박",
      },
      {
        name: "폭탄 발사기",
        category: "attack",
        description: "포물선 궤도의 폭탄 연사",
      },
      {
        name: "죽이는 타이어",
        category: "ultimate_damage",
        description: "원격 조종 타이어 폭탄으로 광역 피해",
      },
    ],
  },

  {
    heroId: "torbjorn",
    name: "토르비욘",
    role: "damage",
    skills: [
      {
        name: "포탑 설치",
        category: "attack",
        description: "자동 조준 포탑을 설치",
      },
      {
        name: "과부하",
        category: "barrier",
        description: "임시 보호막과 이동/공격 속도 증가",
      },
      {
        name: "대못 발사기",
        category: "attack",
        description: "산탄 또는 단발 대못 발사",
      },
      {
        name: "초고열 용광로",
        category: "ultimate_damage",
        description: "용암을 뿌려 광범위 지역 피해",
      },
    ],
  },

  {
    heroId: "sombra",
    name: "솜브라",
    role: "damage",
    skills: [
      {
        name: "해킹",
        category: "cc",
        description: "적의 능력을 일정 시간 사용 불가",
      },
      {
        name: "위치변환기",
        category: "movement",
        description: "설치 지점으로 즉시 귀환",
      },
      {
        name: "기관권총",
        category: "attack",
        description: "고속 연사 기관권총 사격",
      },
      {
        name: "EMP",
        category: "ultimate_cc",
        description: "광역 해킹으로 적 능력 차단",
      },
    ],
  },

  {
    heroId: "echo",
    name: "에코",
    role: "damage",
    skills: [
      {
        name: "점착 폭탄",
        category: "attack",
        description: "다수의 점착 폭탄을 부채꼴 발사",
      },
      {
        name: "광선 집중",
        category: "attack",
        description: "집중 광선으로 체력 낮은 적에게 추가 피해",
      },
      {
        name: "비행",
        category: "movement",
        description: "짧은 시간 자유 비행",
      },
      {
        name: "복제",
        category: "ultimate_buff",
        description: "적 영웅을 복제해 능력 사용",
      },
    ],
  },

  {
    heroId: "pharah",
    name: "파라",
    role: "damage",
    skills: [
      {
        name: "로켓 런처",
        category: "attack",
        description: "로켓을 발사해 범위 피해",
      },
      {
        name: "충격탄",
        category: "cc",
        description: "적을 밀쳐내는 충격탄 발사",
      },
      {
        name: "점프 추진기",
        category: "movement",
        description: "제트팩으로 공중 도약",
      },
      {
        name: "포화",
        category: "ultimate_damage",
        description: "다수의 미니 로켓을 연속 발사",
      },
    ],
  },

  {
    heroId: "freja",
    name: "프레야",
    role: "damage",
    skills: [
      {
        name: "속사 석궁",
        category: "attack",
        description: "석궁으로 빠른 연사",
      },
      {
        name: "재빠른 돌진",
        category: "movement",
        description: "빠르게 전방으로 돌진",
      },
      {
        name: "상승기류",
        category: "movement",
        description: "공중으로 높이 점프",
      },
      {
        name: "올가미 사격",
        category: "ultimate_cc",
        description: "올가미로 적을 포박하여 행동 제한",
      },
    ],
  },

  {
    heroId: "genji",
    name: "겐지",
    role: "damage",
    skills: [
      {
        name: "수리검",
        category: "attack",
        description: "수리검 3개를 연사 또는 부채꼴 투척",
      },
      {
        name: "질풍참",
        category: "attack",
        description: "전방으로 빠르게 돌진하며 베기",
      },
      {
        name: "튕겨내기",
        category: "barrier",
        description: "짧은 시간 적 투사체를 반사",
      },
      {
        name: "용검",
        category: "ultimate_damage",
        description: "검을 뽑아 강력한 근접 난도질",
      },
    ],
  },

  {
    heroId: "reaper",
    name: "리퍼",
    role: "damage",
    skills: [
      {
        name: "헬파이어 샷건",
        category: "attack",
        description: "근거리 산탄 이중 사격",
      },
      {
        name: "망령화",
        category: "movement",
        description: "무적 상태로 빠르게 이동",
      },
      {
        name: "그림자 밟기",
        category: "movement",
        description: "지정 위치로 텔레포트",
      },
      {
        name: "죽음의 꽃",
        category: "ultimate_damage",
        description: "주변 적에게 회전하며 산탄 난사",
      },
    ],
  },

  {
    heroId: "vendetta",
    name: "벤데타",
    role: "damage",
    skills: [
      {
        name: "팔라틴 팽",
        category: "attack",
        description: "칼로 적을 베어 피해",
      },
      {
        name: "소용돌이 질주",
        category: "attack",
        description: "회전하며 돌진해 경로의 적에게 피해",
      },
      {
        name: "수호 태세",
        category: "movement",
        description: "방어 태세로 피해를 줄이며 회피",
      },
      {
        name: "갈라내는 칼날",
        category: "ultimate_damage",
        description: "강화된 칼 공격으로 대량 피해",
      },
    ],
  },

  {
    heroId: "venture",
    name: "벤처",
    role: "damage",
    skills: [
      {
        name: "스마트 굴착기",
        category: "attack",
        description: "굴착기로 적에게 범위 피해",
      },
      {
        name: "드릴 돌진",
        category: "attack",
        description: "드릴로 전방 돌진하며 피해",
      },
      {
        name: "잠복",
        category: "movement",
        description: "지하로 잠입해 은신 이동",
      },
      {
        name: "지각 충격",
        category: "ultimate_damage",
        description: "지면 폭발로 광범위 피해",
      },
    ],
  },

  {
    heroId: "anran",
    name: "안란",
    role: "damage",
    skills: [
      {
        name: "맹염 질주",
        category: "attack",
        description: "불꽃을 두르며 돌진하여 적에게 피해",
      },
      {
        name: "춤추는 불꽃",
        category: "attack_buff",
        description: "불꽃으로 공격력 일시 강화",
      },
      {
        name: "점화",
        category: "attack",
        description: "대상에게 화염 피해",
      },
      {
        name: "불사조 승천",
        category: "ultimate_damage",
        description: "불사조 형상으로 변해 강력한 화염 공격",
      },
    ],
  },

  {
    heroId: "tracer",
    name: "트레이서",
    role: "damage",
    skills: [
      {
        name: "점멸",
        category: "movement",
        description: "순간적으로 전방 이동",
      },
      {
        name: "시간 역행",
        category: "self_heal",
        description: "3초 전 위치와 체력으로 되돌림",
      },
      {
        name: "펄스 쌍권총",
        category: "attack",
        description: "고속 연사 쌍권총 사격",
      },
      {
        name: "펄스 폭탄",
        category: "ultimate_damage",
        description: "적에게 부착되는 소형 폭탄 투척",
      },
    ],
  },

  {
    heroId: "sojourn",
    name: "소전",
    role: "damage",
    skills: [
      {
        name: "레일건",
        category: "attack",
        description: "충전된 레일건으로 고위력 정밀 사격",
      },
      {
        name: "파워 슬라이드",
        category: "movement",
        description: "바닥을 미끄러지며 빠르게 이동",
      },
      {
        name: "분열 사격",
        category: "cc",
        description: "착탄 시 범위 내 적을 둔화",
      },
      {
        name: "오버클럭",
        category: "ultimate_damage",
        description: "레일건 완충으로 관통 고위력 사격",
      },
    ],
  },

  {
    heroId: "ashe",
    name: "애쉬",
    role: "damage",
    skills: [
      {
        name: "바이퍼",
        category: "attack",
        description: "레버액션 소총으로 정밀 사격",
      },
      {
        name: "다이너마이트",
        category: "attack",
        description: "폭발물을 투척해 범위 화상 피해",
      },
      {
        name: "충격 샷건",
        category: "cc",
        description: "산탄총으로 적을 밀침",
      },
      {
        name: "B.O.B.",
        category: "ultimate_damage",
        description: "로봇 BOB을 소환해 돌진 후 자동 사격",
      },
    ],
  },

  {
    heroId: "widowmaker",
    name: "위도우메이커",
    role: "damage",
    skills: [
      {
        name: "죽음의 입맞춤",
        category: "attack",
        description: "충전 스코프로 고위력 저격",
      },
      {
        name: "맹독 지뢰",
        category: "cc",
        description: "독 가스를 뿌리는 지뢰 설치",
      },
      {
        name: "갈고리 발사",
        category: "movement",
        description: "갈고리로 높은 곳에 이동",
      },
      {
        name: "적외선 투시",
        category: "ultimate_cc",
        description: "적 전원의 위치를 아군에게 공개",
      },
    ],
  },

  {
    heroId: "cassidy",
    name: "캐서디",
    role: "damage",
    skills: [
      {
        name: "피스키퍼",
        category: "attack",
        description: "리볼버로 정밀 사격",
      },
      {
        name: "섬광탄",
        category: "cc",
        description: "적을 잠시 기절시키는 섬광탄",
      },
      {
        name: "구르기",
        category: "movement",
        description: "빠르게 구르며 탄약 재장전",
      },
      {
        name: "황야의 무법자",
        category: "ultimate_damage",
        description: "시야 내 적에 자동 조준 연사",
      },
    ],
  },

  {
    heroId: "hanzo",
    name: "한조",
    role: "damage",
    skills: [
      {
        name: "폭풍 화살",
        category: "attack",
        description: "여러 발의 화살을 빠르게 연사",
      },
      {
        name: "음파 화살",
        category: "cc",
        description: "적 위치를 탐지하는 음파 화살",
      },
      {
        name: "벽 오르기",
        category: "movement",
        description: "벽을 타고 올라감",
      },
      {
        name: "용의 일격",
        category: "ultimate_damage",
        description: "거대한 용을 소환해 관통 피해",
      },
    ],
  },

  // ── 지원 (Support) ──────────────────────────────

  {
    heroId: "lucio",
    name: "루시우",
    role: "support",
    skills: [
      {
        name: "분위기 전환!",
        category: "healing",
        description: "치유의 노래로 주변 아군 체력 지속 회복",
      },
      {
        name: "볼륨을 높여라!",
        category: "healing",
        description: "현재 노래 효과 증폭 (치유 또는 이동속도)",
      },
      {
        name: "소리 파동",
        category: "cc",
        description: "음파로 적을 밀쳐냄",
      },
      {
        name: "소리 방벽",
        category: "ultimate_buff",
        description: "주변 아군에게 대량의 임시 보호막 부여",
      },
    ],
  },

  {
    heroId: "baptiste",
    name: "바티스트",
    role: "support",
    skills: [
      {
        name: "치유 파동",
        category: "healing",
        description: "범위 내 아군에게 치유 수류탄 발사",
      },
      {
        name: "불사 장치",
        category: "barrier",
        description: "범위 내 아군의 체력이 0 이하로 떨어지지 않음",
      },
      {
        name: "증폭 매트릭스",
        category: "ultimate_buff",
        description: "필드를 통과하는 공격과 치유 효과 2배",
      },
      {
        name: "생체탄 발사기",
        category: "attack",
        description: "3점사 생체탄 발사",
      },
    ],
  },

  {
    heroId: "ana",
    name: "아나",
    role: "support",
    skills: [
      {
        name: "생체 수류탄",
        category: "healing",
        description: "범위 치유 + 적에게 치유 차단 효과",
      },
      {
        name: "수면총",
        category: "cc",
        description: "맞은 적을 일정 시간 수면 상태로",
      },
      {
        name: "생체 소총",
        category: "healing",
        description: "아군에게 사격하여 체력 회복",
      },
      {
        name: "나노 강화제",
        category: "ultimate_buff",
        description: "아군 1명의 공격력 증가, 피해 감소",
      },
    ],
  },

  {
    heroId: "zenyatta",
    name: "젠야타",
    role: "support",
    skills: [
      {
        name: "조화의 구슬",
        category: "healing",
        description: "아군에게 구슬을 붙여 지속 회복",
      },
      {
        name: "부조화의 구슬",
        category: "cc",
        description: "적에게 구슬을 붙여 받는 피해 증가",
      },
      {
        name: "파괴의 구슬",
        category: "attack",
        description: "에너지 구슬을 차지하여 연속 발사",
      },
      {
        name: "초월",
        category: "ultimate_heal",
        description: "무적 상태로 주변 아군을 대량 치유",
      },
    ],
  },

  {
    heroId: "jetpack-cat",
    name: "제트팩 캣",
    role: "support",
    skills: [
      {
        name: "정신 없는 비행",
        category: "movement",
        description: "제트팩으로 불규칙하게 비행",
      },
      {
        name: "생명줄",
        category: "healing",
        description: "아군에게 치유 광선 연결",
      },
      {
        name: "골골대기",
        category: "healing",
        description: "주변 아군에게 지속 치유 효과",
      },
      {
        name: "납치한다냥",
        category: "ultimate_cc",
        description: "적을 낚아채 행동 불능 상태로",
      },
    ],
  },

  {
    heroId: "lifeweaver",
    name: "라이프위버",
    role: "support",
    skills: [
      {
        name: "치유의 꽃",
        category: "healing",
        description: "꽃잎으로 아군 체력 회복",
      },
      {
        name: "생명의 나무",
        category: "ultimate_heal",
        description: "거대한 나무를 소환해 광역 지속 치유",
      },
      {
        name: "연꽃 단상",
        category: "barrier",
        description: "연꽃 플랫폼을 띄워 아군을 올림",
      },
      {
        name: "가시 연사",
        category: "attack",
        description: "가시 모양 투사체를 연속 발사",
      },
    ],
  },

  {
    heroId: "mercy",
    name: "메르시",
    role: "support",
    skills: [
      {
        name: "부활",
        category: "healing",
        description: "쓰러진 아군 1명을 부활",
      },
      {
        name: "공격 강화",
        category: "attack_buff",
        description: "아군의 공격력을 증가시키는 광선 연결",
      },
      {
        name: "수호천사",
        category: "movement",
        description: "아군에게 빠르게 날아감",
      },
      {
        name: "발키리",
        category: "ultimate_heal",
        description: "비행하며 치유/강화 광선이 연쇄 적용",
      },
    ],
  },

  {
    heroId: "moira",
    name: "모이라",
    role: "support",
    skills: [
      {
        name: "생체 손아귀",
        category: "attack",
        description: "적에게 생체 에너지를 흡수하며 피해",
      },
      {
        name: "생체 구슬",
        category: "healing",
        description: "치유 또는 피해 구슬을 투척",
      },
      {
        name: "소멸",
        category: "movement",
        description: "투명 상태로 빠르게 이동",
      },
      {
        name: "융화",
        category: "ultimate_heal",
        description: "거대한 광선으로 관통 치유/피해",
      },
    ],
  },

  {
    heroId: "kiriko",
    name: "키리코",
    role: "support",
    skills: [
      {
        name: "치유의 부적",
        category: "healing",
        description: "부적을 던져 아군 체력 회복",
      },
      {
        name: "쿠나이",
        category: "attack",
        description: "쿠나이를 투척해 적에게 피해",
      },
      {
        name: "순보",
        category: "movement",
        description: "아군에게 순간이동",
      },
      {
        name: "여우길",
        category: "ultimate_buff",
        description: "여우 영혼이 경로의 아군 공/이속 증가",
      },
    ],
  },

  {
    heroId: "mizuki",
    name: "미즈키",
    role: "support",
    skills: [
      {
        name: "영혼 수리검",
        category: "attack",
        description: "영혼이 깃든 수리검을 투척",
      },
      {
        name: "속박 사슬",
        category: "cc",
        description: "사슬로 적을 잡아 이동을 제한",
      },
      {
        name: "치유의 삿갓",
        category: "healing",
        description: "삿갓에서 치유 에너지를 방출",
      },
      {
        name: "결계 성역",
        category: "ultimate_cc",
        description: "결계를 생성해 범위 내 적을 속박",
      },
    ],
  },

  {
    heroId: "brigitte",
    name: "브리기테",
    role: "support",
    skills: [
      {
        name: "도리깨 투척",
        category: "attack",
        description: "도리깨를 던져 원거리 피해",
      },
      {
        name: "수리 팩",
        category: "healing",
        description: "아군에게 수리 팩을 투척해 체력 회복",
      },
      {
        name: "방벽 방패",
        category: "barrier",
        description: "전방에 소형 방패를 들어 방어",
      },
      {
        name: "집결",
        category: "ultimate_buff",
        description: "주변 아군에게 지속적으로 보호막 부여",
      },
    ],
  },

  {
    heroId: "illari",
    name: "일리아리",
    role: "support",
    skills: [
      {
        name: "태양 소총",
        category: "attack",
        description: "태양 에너지로 충전 사격",
      },
      {
        name: "치유의 태양석",
        category: "healing",
        description: "태양석을 설치해 아군에게 지속 치유",
      },
      {
        name: "분출",
        category: "attack",
        description: "태양 에너지를 분출해 적을 밀침",
      },
      {
        name: "태양 작렬",
        category: "ultimate_heal",
        description: "광범위 태양 에너지로 아군 대량 치유",
      },
    ],
  },

  {
    heroId: "wuyang",
    name: "우양",
    role: "support",
    skills: [
      {
        name: "회복의 물결",
        category: "healing",
        description: "물 에너지로 아군 체력 회복",
      },
      {
        name: "수호의 파도",
        category: "barrier",
        description: "물의 파도로 아군을 보호",
      },
      {
        name: "격류",
        category: "attack",
        description: "물 에너지를 발사해 적에게 피해",
      },
      {
        name: "해일 폭발",
        category: "ultimate_heal",
        description: "거대한 해일로 광역 치유",
      },
    ],
  },

  {
    heroId: "juno",
    name: "주노",
    role: "support",
    skills: [
      {
        name: "메디블라스터",
        category: "healing",
        description: "치유 에너지를 발사해 아군 회복",
      },
      {
        name: "펄사 어뢰",
        category: "attack",
        description: "에너지 어뢰를 발사해 적에게 피해",
      },
      {
        name: "하이퍼 링",
        category: "movement",
        description: "링을 설치해 팀의 이동속도 증가",
      },
      {
        name: "궤도 광선",
        category: "ultimate_heal",
        description: "궤도에서 광선을 쏴 광역 치유",
      },
    ],
  },
];

/** heroId로 영웅 메타데이터를 찾는다 */
export function getOwHeroMetaByHeroId(
  heroId: string,
): OwHeroMeta | undefined {
  return OW_HERO_META.find((hero) => hero.heroId === heroId);
}
