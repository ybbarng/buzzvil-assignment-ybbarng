import type { HeroPreset, HeroRole, HeroSubRole } from "@/types/preset";

export const ROLE_LABELS: Record<HeroRole, string> = {
  tank: "돌격",
  damage: "공격",
  support: "지원",
};

export const ROLE_COLORS: Record<HeroRole, string> = {
  tank: "bg-accent-blue",
  damage: "bg-damage",
  support: "bg-heal",
};

export const SUB_ROLE_LABELS: Record<HeroSubRole, string> = {
  initiator: "개시자",
  brawler: "투사",
  anchor: "강건한 자",
  specialist: "전문가",
  scout: "수색가",
  flanker: "측면 공격가",
  marksman: "명사수",
  tactician: "전술가",
  medic: "의무관",
  survivor: "생존왕",
};

/** 각 역할군의 서브역할군 순서 */
export const ROLE_SUB_ROLES: Record<HeroRole, HeroSubRole[]> = {
  tank: ["initiator", "brawler", "anchor"],
  damage: ["specialist", "scout", "flanker", "marksman"],
  support: ["tactician", "medic", "survivor"],
};

export const HERO_PRESETS: HeroPreset[] = [
  // ── 돌격 (14명) ──────────────────────────────
  // HP 80-100, DEF 20-30 특화, MP 20-45

  // 개시자
  {
    id: "dva",
    name: "D.Va",
    role: "tank",
    subRole: "initiator",
    description: "메카 탑승 돌격형 영웅",
    stats: { hp: 90, mp: 30, atk: 20, def: 30, spd: 30 },
  },
  {
    id: "doomfist",
    name: "둠피스트",
    role: "tank",
    subRole: "initiator",
    description: "근접 격투형 영웅",
    stats: { hp: 80, mp: 40, atk: 25, def: 25, spd: 30 },
  },
  {
    id: "wrecking-ball",
    name: "레킹볼",
    role: "tank",
    subRole: "initiator",
    description: "초고기동 구르기 영웅",
    stats: { hp: 95, mp: 30, atk: 15, def: 30, spd: 30 },
  },
  {
    id: "winston",
    name: "윈스턴",
    role: "tank",
    subRole: "initiator",
    description: "점프팩 기동의 과학자 영웅",
    stats: { hp: 85, mp: 45, atk: 15, def: 25, spd: 30 },
  },

  // 투사
  {
    id: "roadhog",
    name: "로드호그",
    role: "tank",
    subRole: "brawler",
    description: "갈고리로 적을 당기는 고체력형",
    stats: { hp: 100, mp: 25, atk: 25, def: 25, spd: 25 },
  },
  {
    id: "mauga",
    name: "마우가",
    role: "tank",
    subRole: "brawler",
    description: "쌍총 난사형 영웅",
    stats: { hp: 95, mp: 25, atk: 25, def: 25, spd: 30 },
  },
  {
    id: "orisa",
    name: "오리사",
    role: "tank",
    subRole: "brawler",
    description: "자벨린과 포티파이의 전선 방어형",
    stats: { hp: 95, mp: 25, atk: 20, def: 30, spd: 30 },
  },
  {
    id: "zarya",
    name: "자리야",
    role: "tank",
    subRole: "brawler",
    description: "보호막으로 에너지를 충전하는 영웅",
    stats: { hp: 80, mp: 35, atk: 25, def: 30, spd: 30 },
  },

  // 강건한 자
  {
    id: "domina",
    name: "도미나",
    role: "tank",
    subRole: "anchor",
    description: "하드라이트 실드 기반 영웅",
    stats: { hp: 85, mp: 45, atk: 10, def: 30, spd: 30 },
  },
  {
    id: "ramattra",
    name: "라마트라",
    role: "tank",
    subRole: "anchor",
    description: "옴닉/네메시스 형태 전환형",
    stats: { hp: 80, mp: 40, atk: 20, def: 30, spd: 30 },
  },
  {
    id: "reinhardt",
    name: "라인하르트",
    role: "tank",
    subRole: "anchor",
    description: "대형 방벽과 해머의 정통파",
    stats: { hp: 100, mp: 20, atk: 20, def: 30, spd: 30 },
  },
  {
    id: "sigma",
    name: "시그마",
    role: "tank",
    subRole: "anchor",
    description: "중력 조작과 유연한 방벽 운용",
    stats: { hp: 85, mp: 40, atk: 15, def: 30, spd: 30 },
  },
  {
    id: "junker-queen",
    name: "정커퀸",
    role: "tank",
    subRole: "anchor",
    description: "출혈 효과와 자가 회복의 근접 전투형",
    stats: { hp: 85, mp: 35, atk: 25, def: 25, spd: 30 },
  },
  {
    id: "hazard",
    name: "해저드",
    role: "tank",
    subRole: "anchor",
    description: "방어력 기반 전선 유지형",
    stats: { hp: 95, mp: 35, atk: 15, def: 30, spd: 25 },
  },

  // ── 공격 (22명) ──────────────────────────────
  // ATK 20-30, SPD 25-30 특화, HP 35-55, DEF 5-20

  // 전문가
  {
    id: "mei",
    name: "메이",
    role: "damage",
    subRole: "specialist",
    description: "빙결과 얼음 벽의 제어형 영웅",
    stats: { hp: 55, mp: 75, atk: 20, def: 20, spd: 30 },
  },
  {
    id: "bastion",
    name: "바스티온",
    role: "damage",
    subRole: "specialist",
    description: "어설트/포격 모드 전환 화력",
    stats: { hp: 55, mp: 85, atk: 30, def: 15, spd: 15 },
  },
  {
    id: "soldier-76",
    name: "솔저: 76",
    role: "damage",
    subRole: "specialist",
    description: "자동 소총과 힐링 필드의 올라운더",
    stats: { hp: 50, mp: 80, atk: 25, def: 15, spd: 30 },
  },
  {
    id: "symmetra",
    name: "시메트라",
    role: "damage",
    subRole: "specialist",
    description: "터렛과 텔레포터의 빌더",
    stats: { hp: 50, mp: 85, atk: 22, def: 13, spd: 30 },
  },
  {
    id: "emre",
    name: "에므레",
    role: "damage",
    subRole: "specialist",
    description: "사이버네틱 강화 런앤건 전투원",
    stats: { hp: 55, mp: 78, atk: 25, def: 12, spd: 30 },
  },
  {
    id: "junkrat",
    name: "정크랫",
    role: "damage",
    subRole: "specialist",
    description: "유탄과 트랩의 범위 폭발 전문",
    stats: { hp: 50, mp: 75, atk: 30, def: 15, spd: 30 },
  },
  {
    id: "torbjorn",
    name: "토르비욘",
    role: "damage",
    subRole: "specialist",
    description: "자동 포탑과 오버로드의 거점 방어",
    stats: { hp: 55, mp: 70, atk: 25, def: 20, spd: 30 },
  },

  // 수색가
  {
    id: "sombra",
    name: "솜브라",
    role: "damage",
    subRole: "scout",
    description: "은신과 해킹의 잠입 교란형",
    stats: { hp: 40, mp: 100, atk: 22, def: 8, spd: 30 },
  },
  {
    id: "echo",
    name: "에코",
    role: "damage",
    subRole: "scout",
    description: "비행하며 높은 순간 화력 발휘",
    stats: { hp: 45, mp: 90, atk: 25, def: 10, spd: 30 },
  },
  {
    id: "pharah",
    name: "파라",
    role: "damage",
    subRole: "scout",
    description: "제트팩 공중 로켓 영웅",
    stats: { hp: 50, mp: 80, atk: 28, def: 12, spd: 30 },
  },
  {
    id: "freja",
    name: "프레야",
    role: "damage",
    subRole: "scout",
    description: "석궁 정밀 사격과 공중 기동",
    stats: { hp: 35, mp: 95, atk: 28, def: 12, spd: 30 },
  },

  // 측면 공격가
  {
    id: "genji",
    name: "겐지",
    role: "damage",
    subRole: "flanker",
    description: "수리검과 질풍참의 플랭커",
    stats: { hp: 40, mp: 95, atk: 25, def: 10, spd: 30 },
  },
  {
    id: "reaper",
    name: "리퍼",
    role: "damage",
    subRole: "flanker",
    description: "쌍 산탄총의 근접 플랭커",
    stats: { hp: 55, mp: 70, atk: 30, def: 15, spd: 30 },
  },
  {
    id: "vendetta",
    name: "벤데타",
    role: "damage",
    subRole: "flanker",
    description: "하드라이트 대검의 근접 전투형",
    stats: { hp: 55, mp: 75, atk: 28, def: 17, spd: 25 },
  },
  {
    id: "venture",
    name: "벤처",
    role: "damage",
    subRole: "flanker",
    description: "지중 이동과 드릴의 플랭커",
    stats: { hp: 48, mp: 80, atk: 25, def: 17, spd: 30 },
  },
  {
    id: "anran",
    name: "안란",
    role: "damage",
    subRole: "flanker",
    description: "높은 기동성의 플랭커",
    stats: { hp: 42, mp: 93, atk: 25, def: 10, spd: 30 },
  },
  {
    id: "tracer",
    name: "트레이서",
    role: "damage",
    subRole: "flanker",
    description: "점멸과 시간 역행의 초고기동 플랭커",
    stats: { hp: 35, mp: 100, atk: 25, def: 10, spd: 30 },
  },

  // 명사수
  {
    id: "sojourn",
    name: "소전",
    role: "damage",
    subRole: "marksman",
    description: "슬라이딩과 레일건의 히트스캔",
    stats: { hp: 48, mp: 82, atk: 28, def: 12, spd: 30 },
  },
  {
    id: "ashe",
    name: "애쉬",
    role: "damage",
    subRole: "marksman",
    description: "바이퍼 라이플의 중거리 히트스캔",
    stats: { hp: 50, mp: 87, atk: 28, def: 10, spd: 25 },
  },
  {
    id: "widowmaker",
    name: "위도우메이커",
    role: "damage",
    subRole: "marksman",
    description: "인프라사이트의 장거리 저격수",
    stats: { hp: 35, mp: 95, atk: 30, def: 10, spd: 30 },
  },
  {
    id: "cassidy",
    name: "캐서디",
    role: "damage",
    subRole: "marksman",
    description: "정밀 사격의 중거리 히트스캔",
    stats: { hp: 48, mp: 88, atk: 27, def: 12, spd: 25 },
  },
  {
    id: "hanzo",
    name: "한조",
    role: "damage",
    subRole: "marksman",
    description: "음파 화살과 용의 일격의 궁수",
    stats: { hp: 45, mp: 85, atk: 28, def: 12, spd: 30 },
  },

  // ── 지원 (14명) ──────────────────────────────
  // MP 85-100 특화, ATK 5-20, HP 45-65

  // 전술가
  {
    id: "lucio",
    name: "루시우",
    role: "support",
    subRole: "tactician",
    description: "음악으로 범위 힐/속도 부스트",
    stats: { hp: 50, mp: 100, atk: 10, def: 10, spd: 30 },
  },
  {
    id: "baptiste",
    name: "바티스트",
    role: "support",
    subRole: "tactician",
    description: "바이오틱 런처와 불사의 장",
    stats: { hp: 55, mp: 95, atk: 15, def: 15, spd: 20 },
  },
  {
    id: "ana",
    name: "아나",
    role: "support",
    subRole: "tactician",
    description: "저격 힐과 수면총의 원거리 힐러",
    stats: { hp: 58, mp: 100, atk: 12, def: 10, spd: 20 },
  },
  {
    id: "zenyatta",
    name: "젠야타",
    role: "support",
    subRole: "tactician",
    description: "조화/부조화 구슬의 딜링 힐러",
    stats: { hp: 55, mp: 85, atk: 20, def: 15, spd: 25 },
  },
  {
    id: "jetpack-cat",
    name: "제트팩 캣",
    role: "support",
    subRole: "tactician",
    description: "제트팩을 탄 고양이 힐러",
    stats: { hp: 45, mp: 100, atk: 10, def: 15, spd: 30 },
  },

  // 의무관
  {
    id: "lifeweaver",
    name: "라이프위버",
    role: "support",
    subRole: "medic",
    description: "꽃잎 힐과 생명의 그립",
    stats: { hp: 65, mp: 90, atk: 8, def: 15, spd: 22 },
  },
  {
    id: "mercy",
    name: "메르시",
    role: "support",
    subRole: "medic",
    description: "단일 대상 지속 힐/딜 증폭",
    stats: { hp: 55, mp: 100, atk: 5, def: 10, spd: 30 },
  },
  {
    id: "moira",
    name: "모이라",
    role: "support",
    subRole: "medic",
    description: "바이오틱 구체의 범위 힐/딜",
    stats: { hp: 50, mp: 95, atk: 15, def: 15, spd: 25 },
  },
  {
    id: "kiriko",
    name: "키리코",
    role: "support",
    subRole: "medic",
    description: "부적 힐과 스즈 정화의 닌자 힐러",
    stats: { hp: 48, mp: 97, atk: 15, def: 10, spd: 30 },
  },

  // 생존왕
  {
    id: "mizuki",
    name: "미즈키",
    role: "support",
    subRole: "survivor",
    description: "바인딩 체인의 속박형 힐러",
    stats: { hp: 55, mp: 92, atk: 12, def: 16, spd: 25 },
  },
  {
    id: "brigitte",
    name: "브리기테",
    role: "support",
    subRole: "survivor",
    description: "방패와 철퇴의 근접 전투 힐러",
    stats: { hp: 60, mp: 85, atk: 12, def: 20, spd: 23 },
  },
  {
    id: "illari",
    name: "일라리",
    role: "support",
    subRole: "survivor",
    description: "태양 에너지 기반 고화력 힐러",
    stats: { hp: 50, mp: 92, atk: 18, def: 15, spd: 25 },
  },
  {
    id: "wuyang",
    name: "우양",
    role: "support",
    subRole: "survivor",
    description: "물 기반 능력의 전장 조작 힐러",
    stats: { hp: 55, mp: 90, atk: 10, def: 15, spd: 30 },
  },
  {
    id: "juno",
    name: "주노",
    role: "support",
    subRole: "survivor",
    description: "실드 기반의 기동형 힐러",
    stats: { hp: 50, mp: 95, atk: 10, def: 15, spd: 30 },
  },
];

export function getPresetsByRole(role: HeroRole): HeroPreset[] {
  return HERO_PRESETS.filter((preset) => preset.role === role);
}

export function getPresetsBySubRole(subRole: HeroSubRole): HeroPreset[] {
  return HERO_PRESETS.filter((preset) => preset.subRole === subRole);
}
