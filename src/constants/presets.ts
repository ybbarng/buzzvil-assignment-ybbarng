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

  // 개시자
  {
    id: "dva",
    name: "D.Va",
    role: "tank",
    subRole: "initiator",
    description:
      "프로게이머 출신인 D.Va는 이제 뛰어난 실력으로 최첨단 메카를 조종하며 조국을 수호합니다.",
    stats: { hp: 90, mp: 30, atk: 20, def: 30, spd: 30 },
  },
  {
    id: "doomfist",
    name: "둠피스트",
    role: "tank",
    subRole: "initiator",
    description:
      "탈론의 지도자 중 하나인 둠피스트는 세계를 새로운 갈등으로 몰아넣고, 이를 통해 인류를 더욱 강하게 만들려는 계획을 갖고 있다.",
    stats: { hp: 80, mp: 40, atk: 25, def: 25, spd: 30 },
  },
  {
    id: "wrecking-ball",
    name: "레킹볼",
    role: "tank",
    subRole: "initiator",
    description:
      "재주 많고 고도의 지능까지 갖춘 기계공 겸 투사 레킹볼은 호라이즌 달 기지의 실험실에서 깨어나 정커퀸의 용사가 되었습니다.",
    stats: { hp: 95, mp: 30, atk: 15, def: 30, spd: 30 },
  },
  {
    id: "winston",
    name: "윈스턴",
    role: "tank",
    subRole: "initiator",
    description:
      "윈스턴은 극도로 지적인 유전자 조작 고릴라입니다. 훌륭한 과학자이자 인류가 지닌 잠재력의 강력한 옹호자이기도 합니다.",
    stats: { hp: 85, mp: 45, atk: 15, def: 25, spd: 30 },
  },

  // 투사
  {
    id: "roadhog",
    name: "로드호그",
    role: "tank",
    subRole: "brawler",
    description:
      "로드호그는 무분별하고 악의적인 파괴 행위로 악명을 떨치는 강력한 싸움꾼입니다.",
    stats: { hp: 100, mp: 25, atk: 25, def: 25, spd: 25 },
  },
  {
    id: "mauga",
    name: "마우가",
    role: "tank",
    subRole: "brawler",
    description:
      "카리스마 넘치는 교활한 사모아 전사 마우가는 전장의 혼돈 속에서 하루하루를 삶의 마지막 순간인 것처럼 살아간다.",
    stats: { hp: 95, mp: 25, atk: 25, def: 25, spd: 30 },
  },
  {
    id: "orisa",
    name: "오리사",
    role: "tank",
    subRole: "brawler",
    description:
      "눔바니의 방어 로봇 OR15의 부품으로 만들어진 오리사는 아직 배울 점이 많지만, 새롭게 탄생한 도시의 수호자이다.",
    stats: { hp: 95, mp: 25, atk: 20, def: 30, spd: 30 },
  },
  {
    id: "zarya",
    name: "자리야",
    role: "tank",
    subRole: "brawler",
    description:
      "세계에서 가장 강인한 여성 중 하나인 자리야는 한때 장래가 촉망되던 운동선수였으나, 가족과 조국을 보호하기 위해 나섰습니다.",
    stats: { hp: 80, mp: 35, atk: 25, def: 30, spd: 30 },
  },

  // 강건한 자
  {
    id: "domina",
    name: "도미나",
    role: "tank",
    subRole: "anchor",
    description:
      "비슈카르 코퍼레이션에서 가장 귀중한 협상가인 도미나는 경화광을 능숙하게 다루는 기술로 어떤 상황에서도 주도권을 장악한다.",
    stats: { hp: 85, mp: 45, atk: 10, def: 30, spd: 30 },
  },
  {
    id: "ramattra",
    name: "라마트라",
    role: "tank",
    subRole: "anchor",
    description:
      "병사, 수도승, 혁명가. 널 섹터의 수장이 된 라마트라는 수단과 방법을 가리지 않고 모든 옴닉을 위해 싸운다.",
    stats: { hp: 80, mp: 40, atk: 20, def: 30, spd: 30 },
  },
  {
    id: "reinhardt",
    name: "라인하르트",
    role: "tank",
    subRole: "anchor",
    description:
      "라인하르트 빌헬름은 용맹, 정의, 용기라는 기사도의 미덕을 따르는 흘러간 시대의 옛 용사입니다.",
    stats: { hp: 100, mp: 20, atk: 20, def: 30, spd: 30 },
  },
  {
    id: "sigma",
    name: "시그마",
    role: "tank",
    subRole: "anchor",
    description:
      "뛰어난 천체물리학자인 시그마는 실험 중에 일어난 불의의 사고로 중력의 힘을 통제할 수 있게 되었다.",
    stats: { hp: 85, mp: 40, atk: 15, def: 30, spd: 30 },
  },
  {
    id: "junker-queen",
    name: "정커퀸",
    role: "tank",
    subRole: "anchor",
    description:
      "어렸을 적에 척박한 황무지로 쫓겨난 오데사 '데즈' 스톤은 날카로운 웃음과 압도적인 힘으로 쓰레기촌을 통치한다.",
    stats: { hp: 85, mp: 35, atk: 25, def: 25, spd: 30 },
  },
  {
    id: "hazard",
    name: "해저드",
    role: "tank",
    subRole: "anchor",
    description:
      "급진적인 파괴자이자 막을 수 없는 무기 그 자체인 해저드는 체제를 붕괴시키기 위해 싸우던 중 지하 범죄 세계에서 일약 스타가 되었다.",
    stats: { hp: 95, mp: 35, atk: 15, def: 30, spd: 25 },
  },

  // ── 공격 (22명) ──────────────────────────────

  // 전문가
  {
    id: "mei",
    name: "메이",
    role: "damage",
    subRole: "specialist",
    description:
      "메이는 환경을 보존하기 위해 자기 손으로 직접 싸우는 과학자입니다.",
    stats: { hp: 55, mp: 75, atk: 20, def: 20, spd: 30 },
  },
  {
    id: "bastion",
    name: "바스티온",
    role: "damage",
    subRole: "specialist",
    description:
      "옴닉 사태의 최전선에 있던 이 호기심 많은 바스티온은 아름다운 자연에 매료되어 세계를 탐험합니다.",
    stats: { hp: 55, mp: 85, atk: 30, def: 15, spd: 15 },
  },
  {
    id: "soldier-76",
    name: "솔저: 76",
    role: "damage",
    subRole: "specialist",
    description:
      "전 세계의 수배를 받고 있는 무법자, 솔저: 76는 오버워치 몰락의 배후에 숨겨진 진실을 밝혀내기 위해 혼자만의 전쟁을 선포했다.",
    stats: { hp: 50, mp: 80, atk: 25, def: 15, spd: 30 },
  },
  {
    id: "symmetra",
    name: "시메트라",
    role: "damage",
    subRole: "specialist",
    description:
      "시메트라는 말 그대로 현실을 뒤튼다. 경화광으로 이루어진 구조물을 창조해 자신이 바라는 세계를 형성한다.",
    stats: { hp: 50, mp: 85, atk: 22, def: 13, spd: 30 },
  },
  {
    id: "emre",
    name: "엠레",
    role: "damage",
    subRole: "specialist",
    description:
      "오버워치 타격팀에서 눈부신 활약을 펼쳤던 엠레는 자취를 감췄다가 수년 후 미지의 존재에게 조종당한 상태로 다시 나타났습니다.",
    stats: { hp: 55, mp: 78, atk: 25, def: 12, spd: 30 },
  },
  {
    id: "junkrat",
    name: "정크랫",
    role: "damage",
    subRole: "specialist",
    description:
      "폭발물에 광적으로 집착하는 정크랫은 세상에 혼돈과 파괴를 불러오기 위해 살아가는 미치광이다.",
    stats: { hp: 50, mp: 75, atk: 30, def: 15, spd: 30 },
  },
  {
    id: "torbjorn",
    name: "토르비욘",
    role: "damage",
    subRole: "specialist",
    description:
      "전성기 시절 오버워치는 가장 진보된 최첨단 무기를 보유했으며, 그 출처는 바로 토르비욘이라는 전무후무한 기술자의 작업장이었습니다.",
    stats: { hp: 55, mp: 70, atk: 25, def: 20, spd: 30 },
  },

  // 수색가
  {
    id: "sombra",
    name: "솜브라",
    role: "damage",
    subRole: "scout",
    description:
      "세계에서 가장 악명 높은 해커로 손꼽히는 솜브라는 정보를 이용해 권력자들을 조종합니다.",
    stats: { hp: 40, mp: 100, atk: 22, def: 8, spd: 30 },
  },
  {
    id: "echo",
    name: "에코",
    role: "damage",
    subRole: "scout",
    description:
      "에코는 세계에서 가장 복잡한 인공 지능을 갖추고 전장에서 다양한 역할을 수행하는 적응형 로봇입니다.",
    stats: { hp: 45, mp: 90, atk: 25, def: 10, spd: 30 },
  },
  {
    id: "pharah",
    name: "파라",
    role: "damage",
    subRole: "scout",
    description:
      "파라의 충직성은 핏줄에 흐르고 있다. 유서 깊은 군인 가문 출신으로, 명예롭게 복무하고자 하는 열망으로 불탄다.",
    stats: { hp: 50, mp: 80, atk: 28, def: 12, spd: 30 },
  },
  {
    id: "freja",
    name: "프레야",
    role: "damage",
    subRole: "scout",
    description:
      "전직 수색 구조 요원에서 현상금 사냥꾼으로 전직한 프레야는 대가만 제대로 지불한다면 누구든 찾아냅니다.",
    stats: { hp: 35, mp: 95, atk: 28, def: 12, spd: 30 },
  },

  // 측면 공격가
  {
    id: "genji",
    name: "겐지",
    role: "damage",
    subRole: "flanker",
    description:
      "사이보그 시마다 겐지는 한때 거부했던 자신의 로봇 육체를 받아들였으며, 그 과정에서 한 차원 더 높은 인간성을 갖게 되었습니다.",
    stats: { hp: 40, mp: 95, atk: 25, def: 10, spd: 30 },
  },
  {
    id: "reaper",
    name: "리퍼",
    role: "damage",
    subRole: "flanker",
    description:
      "검은 망토를 입은 테러리스트 리퍼. 그가 나타나는 곳에는 언제나 죽음의 그림자가 드리운다.",
    stats: { hp: 55, mp: 70, atk: 30, def: 15, spd: 30 },
  },
  {
    id: "vendetta",
    name: "벤데타",
    role: "damage",
    subRole: "flanker",
    description:
      "콜로세오의 챔피언이자 이탈리아의 엘리트 계층인 벤데타는 자신의 가문이 이끌던 범죄 제국의 왕좌를 되찾기 위해서라면 무슨 일이든 할 것입니다.",
    stats: { hp: 55, mp: 75, atk: 28, def: 17, spd: 25 },
  },
  {
    id: "venture",
    name: "벤처",
    role: "damage",
    subRole: "flanker",
    description:
      "역사의 수수께끼에 대한 열정으로 똘똘 뭉친 고고학자 벤처는 굴착 도구를 사용해 과거를 밝혀내고, 그 유산을 위협하는 자들을 막아낸다.",
    stats: { hp: 48, mp: 80, atk: 25, def: 17, spd: 30 },
  },
  {
    id: "anran",
    name: "안란",
    role: "damage",
    subRole: "flanker",
    description:
      "오행 대학 불 학부의 우수 졸업생 안란은 언제나 자신의 한계를 뛰어넘으려고 불타오릅니다.",
    stats: { hp: 42, mp: 93, atk: 25, def: 10, spd: 30 },
  },
  {
    id: "tracer",
    name: "트레이서",
    role: "damage",
    subRole: "flanker",
    description:
      "전직 오버워치 요원인 트레이서는 시간을 넘나드는 활기찬 모험가입니다.",
    stats: { hp: 35, mp: 100, atk: 25, def: 10, spd: 30 },
  },

  // 명사수
  {
    id: "sojourn",
    name: "소전",
    role: "damage",
    subRole: "marksman",
    description:
      "다양한 사이버네틱 강화를 거친 소전은 빼어난 전략가이다. 자신의 신념을 절대 굽히지 않는 그녀는 귀중한 아군이 될 수도, 두려운 적이 될 수도 있다.",
    stats: { hp: 48, mp: 82, atk: 28, def: 12, spd: 30 },
  },
  {
    id: "ashe",
    name: "애쉬",
    role: "damage",
    subRole: "marksman",
    description:
      "애쉬는 미국 남서부를 뒤흔들고 있는 강도와 범죄자 집단인 데드락 갱단의 두목이다.",
    stats: { hp: 50, mp: 87, atk: 28, def: 10, spd: 25 },
  },
  {
    id: "widowmaker",
    name: "위도우메이커",
    role: "damage",
    subRole: "marksman",
    description:
      "위도우메이커는 더할 나위 없는 암살자다. 참을성 있게 한 순간의 빈틈을 노리고, 아무런 자비 없이 효과적인 살상을 한다.",
    stats: { hp: 35, mp: 95, atk: 30, def: 10, spd: 30 },
  },
  {
    id: "cassidy",
    name: "캐서디",
    role: "damage",
    subRole: "marksman",
    description:
      "피스키퍼 리볼버로 무장한 무법자 콜 캐서디는 자신만의 방식으로 정의를 실현한다.",
    stats: { hp: 48, mp: 88, atk: 27, def: 12, spd: 25 },
  },
  {
    id: "hanzo",
    name: "한조",
    role: "damage",
    subRole: "marksman",
    description:
      "궁수이자 암살자로서 실력을 연마한 시마다 한조는 자신이 타의 추종을 불허하는 전사임을 증명하려고 애씁니다.",
    stats: { hp: 45, mp: 85, atk: 28, def: 12, spd: 30 },
  },

  // ── 지원 (14명) ──────────────────────────────

  // 전술가
  {
    id: "lucio",
    name: "루시우",
    role: "support",
    subRole: "tactician",
    description:
      "루시우는 음악과 행동으로 사회 변화를 주도하는 세계적인 유명인사이자 뮤지션이다.",
    stats: { hp: 50, mp: 100, atk: 10, def: 10, spd: 30 },
  },
  {
    id: "baptiste",
    name: "바티스트",
    role: "support",
    subRole: "tactician",
    description:
      "최정예 전투 의무병이자 전 탈론 요원이었던 바티스트는 이제 자신의 능력으로 전쟁의 피해를 받은 자들을 돕기로 결심했다.",
    stats: { hp: 55, mp: 95, atk: 15, def: 15, spd: 20 },
  },
  {
    id: "ana",
    name: "아나",
    role: "support",
    subRole: "tactician",
    description:
      "오버워치 창립자 중 한 명인 아나는 탁월한 전투 능력과 노련함으로 고향과 자신에게 가장 소중한 이들을 지킵니다.",
    stats: { hp: 58, mp: 100, atk: 12, def: 10, spd: 20 },
  },
  {
    id: "zenyatta",
    name: "젠야타",
    role: "support",
    subRole: "tactician",
    description:
      "젠야타는 정신적 깨달음을 위해 온 세계를 방랑하는 옴닉의 수도사입니다.",
    stats: { hp: 55, mp: 85, atk: 20, def: 15, spd: 25 },
  },
  {
    id: "jetpack-cat",
    name: "제트팩 캣",
    role: "support",
    subRole: "tactician",
    description:
      "브리기테의 최신 제트 추진 발명품을 등에 업은 겁 없는 고양이 파일럿, 제트팩 캣은 깜찍하게 공중 지원에 나선다.",
    stats: { hp: 45, mp: 100, atk: 10, def: 15, spd: 30 },
  },

  // 의무관
  {
    id: "lifeweaver",
    name: "라이프위버",
    role: "support",
    subRole: "medic",
    description:
      "과학자, 예술가, 그리고 활동가인 라이프위버는 자연의 아름다움과 과학의 실용성을 엮어 세상을 치유하려 한다.",
    stats: { hp: 65, mp: 90, atk: 8, def: 15, spd: 22 },
  },
  {
    id: "mercy",
    name: "메르시",
    role: "support",
    subRole: "medic",
    description:
      "수호천사와도 같이 사람을 보살피는 메르시는 발군의 치유사이자 뛰어난 과학자, 열성적인 평화주의자입니다.",
    stats: { hp: 55, mp: 100, atk: 5, def: 10, spd: 30 },
  },
  {
    id: "moira",
    name: "모이라",
    role: "support",
    subRole: "medic",
    description:
      "탁월하지만 논란도 끊이지 않는 과학자 모이라는 유전 공학의 최첨단을 달리며 생명체의 기본 구성 요소를 고쳐 쓸 방법을 찾고 있습니다.",
    stats: { hp: 50, mp: 95, atk: 15, def: 15, spd: 25 },
  },
  {
    id: "kiriko",
    name: "키리코",
    role: "support",
    subRole: "medic",
    description:
      "카네자카 신사의 미코이자 시마다 전 검성의 딸인 키리코는 영적 능력 및 인술을 활용하여 분열된 고향을 치유합니다.",
    stats: { hp: 48, mp: 97, atk: 15, def: 10, spd: 30 },
  },

  // 생존왕
  {
    id: "mizuki",
    name: "미즈키",
    role: "support",
    subRole: "survivor",
    description:
      "불운의 그림자에서 태어난 미즈키는 저주에서 벗어나 스스로 운명을 정하기 위해서라면 무엇이든 할 것이다.",
    stats: { hp: 55, mp: 92, atk: 12, def: 16, spd: 25 },
  },
  {
    id: "brigitte",
    name: "브리기테",
    role: "support",
    subRole: "survivor",
    description:
      "라인하르트의 종자인 브리기테 린드홀름은 도움이 필요한 자들을 돕기 위해 무기를 들고 전장에서 싸우는 전직 기계공학 기술자이다.",
    stats: { hp: 60, mp: 85, atk: 12, def: 20, spd: 23 },
  },
  {
    id: "illari",
    name: "일리아리",
    role: "support",
    subRole: "survivor",
    description:
      "최후의 인티 전사인 일리아리는 태양의 힘을 담는 그릇입니다. 과거를 속죄하기 위해서라면 무엇이든 할 겁니다.",
    stats: { hp: 50, mp: 92, atk: 18, def: 15, spd: 25 },
  },
  {
    id: "wuyang",
    name: "우양",
    role: "support",
    subRole: "survivor",
    description:
      "오행 대학 물 학부의 치유 능력을 다루는 우양은 언제나 전투의 흐름을 바꿀 준비가 되어 있습니다.",
    stats: { hp: 55, mp: 90, atk: 10, def: 15, spd: 30 },
  },
  {
    id: "juno",
    name: "주노",
    role: "support",
    subRole: "survivor",
    description:
      "화성에서 태어난 최초의 인류, 주노는 우주 시대의 기술을 사용하여 자신의 궤도를 침범하는 문제를 해결합니다.",
    stats: { hp: 50, mp: 95, atk: 10, def: 15, spd: 30 },
  },
];

export function getPresetsByRole(role: HeroRole): HeroPreset[] {
  return HERO_PRESETS.filter((preset) => preset.role === role);
}

export function getPresetsBySubRole(subRole: HeroSubRole): HeroPreset[] {
  return HERO_PRESETS.filter((preset) => preset.subRole === subRole);
}
