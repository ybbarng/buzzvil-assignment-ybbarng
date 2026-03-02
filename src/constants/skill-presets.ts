import type { HeroSkillPreset, SkillPresetEntry } from "@/types/skill-preset";
import type { Skill } from "@/types/skill";

/**
 * 오버워치 영웅별 스킬 프리셋 데이터.
 * 스킬 이름은 오버워치 공식 사이트/나무위키의 한국어 공식 이름 기준.
 * 8자 초과 시 축약 표기.
 * 변환 원칙은 docs/skill-conversion-guide.md 참조.
 */
export const SKILL_PRESETS: HeroSkillPreset[] = [
  // ── 돌격 (Tank) ──────────────────────────────

  // D.Va
  {
    heroId: "dva",
    skills: [
      { name: "부스터", type: "buff", target: "def", value: 4, duration: 2, mpCost: 7 },
      { name: "방어 매트릭스", type: "buff", target: "def", value: 8, duration: 3, mpCost: 15 },
      { name: "마이크로 미사일", type: "attack", multiplier: 1.5, mpCost: 10 },
      { name: "자폭", type: "attack", multiplier: 2.8, mpCost: 25 },
    ],
  },

  // 둠피스트
  {
    heroId: "doomfist",
    skills: [
      { name: "로켓 펀치", type: "attack", multiplier: 1.6, mpCost: 10 },
      { name: "지진 강타", type: "debuff", target: "def", value: 4, duration: 2, mpCost: 8 },
      { name: "파워 블락", type: "buff", target: "def", value: 7, duration: 2, mpCost: 12 },
      { name: "파멸의 일격", type: "attack", multiplier: 2.7, mpCost: 24 },
    ],
  },

  // 레킹볼
  {
    heroId: "wrecking-ball",
    skills: [
      { name: "구르기", type: "buff", target: "def", value: 4, duration: 2, mpCost: 6 },
      { name: "갈고리 고정", type: "attack", multiplier: 1.4, mpCost: 8 },
      { name: "파일드라이버", type: "attack", multiplier: 1.6, mpCost: 10 },
      { name: "지뢰밭", type: "debuff", target: "def", value: 8, duration: 4, mpCost: 22 },
    ],
  },

  // 윈스턴
  {
    heroId: "winston",
    skills: [
      { name: "점프 팩", type: "attack", multiplier: 1.4, mpCost: 8 },
      { name: "방벽 생성기", type: "buff", target: "def", value: 8, duration: 3, mpCost: 14 },
      { name: "테슬라 캐논", type: "attack", multiplier: 1.3, mpCost: 8 },
      { name: "원시의 분노", type: "buff", target: "atk", value: 8, duration: 4, mpCost: 22 },
    ],
  },

  // 로드호그
  {
    heroId: "roadhog",
    skills: [
      { name: "갈고리 사슬", type: "debuff", target: "def", value: 5, duration: 2, mpCost: 10 },
      { name: "숨돌리기", type: "heal", healAmount: 30, mpCost: 12 },
      { name: "고철총", type: "attack", multiplier: 1.7, mpCost: 12 },
      { name: "돼재앙", type: "attack", multiplier: 2.8, mpCost: 25 },
    ],
  },

  // 마우가
  {
    heroId: "mauga",
    skills: [
      { name: "돌파", type: "attack", multiplier: 1.5, mpCost: 9 },
      { name: "터질 듯한 심장", type: "heal", healAmount: 20, mpCost: 10 },
      { name: "광전사", type: "buff", target: "atk", value: 5, duration: 3, mpCost: 12 },
      { name: "케이지 혈투", type: "debuff", target: "def", value: 8, duration: 4, mpCost: 22 },
    ],
  },

  // 오리사
  {
    heroId: "orisa",
    skills: [
      { name: "수호의 창", type: "buff", target: "def", value: 6, duration: 2, mpCost: 10 },
      { name: "투창", type: "attack", multiplier: 1.5, mpCost: 10 },
      { name: "방어 강화", type: "buff", target: "def", value: 9, duration: 3, mpCost: 16 },
      { name: "대지의 창", type: "attack", multiplier: 2.7, mpCost: 24 },
    ],
  },

  // 자리야
  {
    heroId: "zarya",
    skills: [
      { name: "입자 방벽", type: "buff", target: "def", value: 8, duration: 2, mpCost: 12 },
      { name: "방벽 씌우기", type: "buff", target: "def", value: 7, duration: 2, mpCost: 10 },
      { name: "입자포", type: "attack", multiplier: 1.6, mpCost: 11 },
      { name: "중력자탄", type: "debuff", target: "def", value: 9, duration: 4, mpCost: 24 },
    ],
  },

  // 도미나
  {
    heroId: "domina",
    skills: [
      { name: "방벽 배열", type: "buff", target: "def", value: 9, duration: 3, mpCost: 15 },
      { name: "수정 발사", type: "attack", multiplier: 1.4, mpCost: 9 },
      { name: "소닉 리펄서", type: "debuff", target: "def", value: 5, duration: 2, mpCost: 10 },
      { name: "판옵티콘", type: "debuff", target: "def", value: 8, duration: 4, mpCost: 22 },
    ],
  },

  // 라마트라
  {
    heroId: "ramattra",
    skills: [
      { name: "공허 방벽", type: "buff", target: "def", value: 8, duration: 3, mpCost: 14 },
      { name: "응징", type: "attack", multiplier: 1.6, mpCost: 11 },
      { name: "탐식의 소용돌이", type: "debuff", target: "def", value: 4, duration: 2, mpCost: 8 },
      { name: "절멸", type: "debuff", target: "def", value: 9, duration: 5, mpCost: 25 },
    ],
  },

  // 라인하르트
  {
    heroId: "reinhardt",
    skills: [
      { name: "방벽 방패", type: "buff", target: "def", value: 10, duration: 3, mpCost: 16 },
      { name: "돌진", type: "attack", multiplier: 1.5, mpCost: 10 },
      { name: "화염 강타", type: "attack", multiplier: 1.7, mpCost: 12 },
      { name: "대지분쇄", type: "debuff", target: "def", value: 8, duration: 4, mpCost: 22 },
    ],
  },

  // 시그마
  {
    heroId: "sigma",
    skills: [
      { name: "실험용 방벽", type: "buff", target: "def", value: 9, duration: 3, mpCost: 15 },
      { name: "강착", type: "attack", multiplier: 1.4, mpCost: 9 },
      { name: "키네틱 손아귀", type: "buff", target: "def", value: 6, duration: 2, mpCost: 10 },
      { name: "중력 붕괴", type: "attack", multiplier: 2.8, mpCost: 26 },
    ],
  },

  // 정커퀸
  {
    heroId: "junker-queen",
    skills: [
      { name: "지휘의 외침", type: "buff", target: "atk", value: 5, duration: 3, mpCost: 10 },
      { name: "도륙", type: "attack", multiplier: 1.5, mpCost: 9 },
      { name: "톱니칼", type: "debuff", target: "def", value: 4, duration: 2, mpCost: 8 },
      { name: "살육", type: "attack", multiplier: 2.7, mpCost: 23 },
    ],
  },

  // 해저드
  {
    heroId: "hazard",
    skills: [
      { name: "벽 넘기", type: "buff", target: "def", value: 4, duration: 2, mpCost: 7 },
      { name: "가시벽", type: "buff", target: "def", value: 8, duration: 3, mpCost: 14 },
      { name: "날카로운 저항", type: "debuff", target: "def", value: 5, duration: 2, mpCost: 9 },
      { name: "가시 소나기", type: "attack", multiplier: 2.6, mpCost: 22 },
    ],
  },

  // ── 공격 (Damage) ──────────────────────────────

  // 메이
  {
    heroId: "mei",
    skills: [
      { name: "냉각총", type: "debuff", target: "def", value: 4, duration: 2, mpCost: 8 },
      { name: "빙벽", type: "buff", target: "def", value: 7, duration: 2, mpCost: 10 },
      { name: "급속 빙결", type: "heal", healAmount: 25, mpCost: 12 },
      { name: "눈보라", type: "debuff", target: "def", value: 8, duration: 4, mpCost: 22 },
    ],
  },

  // 바스티온
  {
    heroId: "bastion",
    skills: [
      { name: "설정: 수색", type: "attack", multiplier: 1.4, mpCost: 8 },
      { name: "전술 수류탄", type: "attack", multiplier: 1.7, mpCost: 12 },
      { name: "설정: 강습", type: "buff", target: "atk", value: 5, duration: 2, mpCost: 10 },
      { name: "설정: 포격", type: "attack", multiplier: 3.0, mpCost: 28 },
    ],
  },

  // 솔저: 76
  {
    heroId: "soldier-76",
    skills: [
      { name: "나선 로켓", type: "attack", multiplier: 1.6, mpCost: 10 },
      { name: "질주", type: "buff", target: "def", value: 3, duration: 1, mpCost: 5 },
      { name: "생체장", type: "heal", healAmount: 25, mpCost: 12 },
      { name: "전술 조준경", type: "attack", multiplier: 2.8, mpCost: 25 },
    ],
  },

  // 시메트라
  {
    heroId: "symmetra",
    skills: [
      { name: "광자 발사기", type: "attack", multiplier: 1.5, mpCost: 9 },
      { name: "감시 포탑", type: "debuff", target: "def", value: 3, duration: 3, mpCost: 8 },
      { name: "순간이동기", type: "buff", target: "def", value: 4, duration: 2, mpCost: 7 },
      { name: "광자 방벽", type: "buff", target: "def", value: 10, duration: 4, mpCost: 22 },
    ],
  },

  // 엠레 (공식명 8자 초과 시 축약: 사이버 파편 수류탄→파편 수류탄, 오버라이드 프로토콜→오버라이드)
  {
    heroId: "emre",
    skills: [
      { name: "파편 수류탄", type: "debuff", target: "def", value: 5, duration: 2, mpCost: 10 },
      { name: "사이펀 블라스터", type: "attack", multiplier: 1.7, mpCost: 12 },
      { name: "합성 점사 소총", type: "attack", multiplier: 1.4, mpCost: 8 },
      { name: "오버라이드", type: "attack", multiplier: 2.8, mpCost: 25 },
    ],
  },

  // 정크랫
  {
    heroId: "junkrat",
    skills: [
      { name: "충격 지뢰", type: "attack", multiplier: 1.5, mpCost: 9 },
      { name: "강철 덫", type: "debuff", target: "def", value: 5, duration: 2, mpCost: 8 },
      { name: "폭탄 발사기", type: "attack", multiplier: 1.7, mpCost: 12 },
      { name: "죽이는 타이어", type: "attack", multiplier: 3.0, mpCost: 28 },
    ],
  },

  // 토르비욘
  {
    heroId: "torbjorn",
    skills: [
      { name: "포탑 설치", type: "attack", multiplier: 1.3, mpCost: 8 },
      { name: "과부하", type: "buff", target: "def", value: 6, duration: 2, mpCost: 10 },
      { name: "대못 발사기", type: "attack", multiplier: 1.5, mpCost: 10 },
      { name: "초고열 용광로", type: "attack", multiplier: 2.7, mpCost: 24 },
    ],
  },

  // 솜브라
  {
    heroId: "sombra",
    skills: [
      { name: "해킹", type: "debuff", target: "def", value: 5, duration: 3, mpCost: 10 },
      { name: "위치변환기", type: "buff", target: "def", value: 4, duration: 1, mpCost: 6 },
      { name: "기관권총", type: "attack", multiplier: 1.4, mpCost: 8 },
      { name: "EMP", type: "debuff", target: "def", value: 9, duration: 4, mpCost: 24 },
    ],
  },

  // 에코
  {
    heroId: "echo",
    skills: [
      { name: "점착 폭탄", type: "attack", multiplier: 1.6, mpCost: 10 },
      { name: "광선 집중", type: "attack", multiplier: 1.8, mpCost: 13 },
      { name: "비행", type: "buff", target: "def", value: 3, duration: 1, mpCost: 5 },
      { name: "복제", type: "buff", target: "atk", value: 9, duration: 4, mpCost: 24 },
    ],
  },

  // 파라
  {
    heroId: "pharah",
    skills: [
      { name: "로켓 런처", type: "attack", multiplier: 1.6, mpCost: 10 },
      { name: "충격탄", type: "debuff", target: "def", value: 3, duration: 2, mpCost: 7 },
      { name: "점프 추진기", type: "buff", target: "def", value: 4, duration: 1, mpCost: 6 },
      { name: "포화", type: "attack", multiplier: 2.8, mpCost: 25 },
    ],
  },

  // 프레야
  {
    heroId: "freja",
    skills: [
      { name: "속사 석궁", type: "attack", multiplier: 1.5, mpCost: 9 },
      { name: "재빠른 돌진", type: "buff", target: "def", value: 4, duration: 1, mpCost: 6 },
      { name: "상승기류", type: "buff", target: "def", value: 3, duration: 1, mpCost: 5 },
      { name: "올가미 사격", type: "debuff", target: "def", value: 8, duration: 4, mpCost: 22 },
    ],
  },

  // 겐지
  {
    heroId: "genji",
    skills: [
      { name: "수리검", type: "attack", multiplier: 1.4, mpCost: 8 },
      { name: "질풍참", type: "attack", multiplier: 1.7, mpCost: 12 },
      { name: "튕겨내기", type: "buff", target: "def", value: 5, duration: 1, mpCost: 7 },
      { name: "용검", type: "attack", multiplier: 2.8, mpCost: 25 },
    ],
  },

  // 리퍼
  {
    heroId: "reaper",
    skills: [
      { name: "헬파이어 샷건", type: "attack", multiplier: 1.7, mpCost: 12 },
      { name: "망령화", type: "buff", target: "def", value: 6, duration: 1, mpCost: 8 },
      { name: "그림자 밟기", type: "buff", target: "def", value: 3, duration: 1, mpCost: 5 },
      { name: "죽음의 꽃", type: "attack", multiplier: 2.8, mpCost: 25 },
    ],
  },

  // 벤데타
  {
    heroId: "vendetta",
    skills: [
      { name: "팔라틴 팽", type: "attack", multiplier: 1.5, mpCost: 9 },
      { name: "소용돌이 질주", type: "attack", multiplier: 1.6, mpCost: 10 },
      { name: "수호 태세", type: "buff", target: "def", value: 4, duration: 1, mpCost: 6 },
      { name: "갈라내는 칼날", type: "attack", multiplier: 2.7, mpCost: 24 },
    ],
  },

  // 벤처
  {
    heroId: "venture",
    skills: [
      { name: "스마트 굴착기", type: "attack", multiplier: 1.5, mpCost: 9 },
      { name: "드릴 돌진", type: "attack", multiplier: 1.7, mpCost: 12 },
      { name: "잠복", type: "buff", target: "def", value: 5, duration: 1, mpCost: 7 },
      { name: "지각 충격", type: "attack", multiplier: 2.7, mpCost: 24 },
    ],
  },

  // 안란
  {
    heroId: "anran",
    skills: [
      { name: "맹염 질주", type: "attack", multiplier: 1.6, mpCost: 10 },
      { name: "춤추는 불꽃", type: "buff", target: "atk", value: 4, duration: 2, mpCost: 8 },
      { name: "점화", type: "attack", multiplier: 1.4, mpCost: 8 },
      { name: "불사조 승천", type: "attack", multiplier: 2.8, mpCost: 25 },
    ],
  },

  // 트레이서
  {
    heroId: "tracer",
    skills: [
      { name: "점멸", type: "buff", target: "def", value: 4, duration: 1, mpCost: 5 },
      { name: "시간 역행", type: "heal", healAmount: 20, mpCost: 10 },
      { name: "펄스 쌍권총", type: "attack", multiplier: 1.5, mpCost: 9 },
      { name: "펄스 폭탄", type: "attack", multiplier: 2.8, mpCost: 24 },
    ],
  },

  // 소전
  {
    heroId: "sojourn",
    skills: [
      { name: "레일건", type: "attack", multiplier: 1.8, mpCost: 13 },
      { name: "파워 슬라이드", type: "buff", target: "def", value: 3, duration: 1, mpCost: 5 },
      { name: "분열 사격", type: "debuff", target: "def", value: 4, duration: 2, mpCost: 8 },
      { name: "오버클럭", type: "attack", multiplier: 2.8, mpCost: 25 },
    ],
  },

  // 애쉬
  {
    heroId: "ashe",
    skills: [
      { name: "바이퍼", type: "attack", multiplier: 1.8, mpCost: 13 },
      { name: "다이너마이트", type: "attack", multiplier: 1.5, mpCost: 10 },
      { name: "충격 샷건", type: "debuff", target: "def", value: 3, duration: 2, mpCost: 7 },
      { name: "B.O.B.", type: "attack", multiplier: 2.7, mpCost: 24 },
    ],
  },

  // 위도우메이커
  {
    heroId: "widowmaker",
    skills: [
      { name: "죽음의 입맞춤", type: "attack", multiplier: 2.0, mpCost: 15 },
      { name: "맹독 지뢰", type: "debuff", target: "def", value: 4, duration: 3, mpCost: 9 },
      { name: "갈고리 발사", type: "buff", target: "def", value: 3, duration: 1, mpCost: 5 },
      { name: "적외선 투시", type: "debuff", target: "def", value: 7, duration: 4, mpCost: 20 },
    ],
  },

  // 캐서디
  {
    heroId: "cassidy",
    skills: [
      { name: "피스키퍼", type: "attack", multiplier: 1.7, mpCost: 12 },
      { name: "섬광탄", type: "debuff", target: "def", value: 5, duration: 2, mpCost: 9 },
      { name: "구르기", type: "buff", target: "def", value: 3, duration: 1, mpCost: 5 },
      { name: "황야의 무법자", type: "attack", multiplier: 2.8, mpCost: 25 },
    ],
  },

  // 한조
  {
    heroId: "hanzo",
    skills: [
      { name: "폭풍 화살", type: "attack", multiplier: 1.7, mpCost: 12 },
      { name: "음파 화살", type: "debuff", target: "def", value: 4, duration: 2, mpCost: 8 },
      { name: "벽 오르기", type: "buff", target: "def", value: 3, duration: 1, mpCost: 5 },
      { name: "용의 일격", type: "attack", multiplier: 2.8, mpCost: 25 },
    ],
  },

  // ── 지원 (Support) ──────────────────────────────

  // 루시우
  {
    heroId: "lucio",
    skills: [
      { name: "분위기 전환!", type: "heal", healAmount: 25, mpCost: 12 },
      { name: "볼륨을 높여라!", type: "buff", target: "def", value: 4, duration: 2, mpCost: 8 },
      { name: "소리 파동", type: "debuff", target: "def", value: 4, duration: 2, mpCost: 8 },
      { name: "소리 방벽", type: "buff", target: "def", value: 10, duration: 4, mpCost: 24 },
    ],
  },

  // 바티스트
  {
    heroId: "baptiste",
    skills: [
      { name: "치유 파동", type: "heal", healAmount: 30, mpCost: 14 },
      { name: "불사 장치", type: "buff", target: "def", value: 10, duration: 2, mpCost: 16 },
      { name: "증폭 매트릭스", type: "buff", target: "atk", value: 8, duration: 3, mpCost: 20 },
      { name: "생체탄 발사기", type: "attack", multiplier: 1.4, mpCost: 8 },
    ],
  },

  // 아나
  {
    heroId: "ana",
    skills: [
      { name: "생체 수류탄", type: "heal", healAmount: 30, mpCost: 14 },
      { name: "수면총", type: "debuff", target: "def", value: 6, duration: 3, mpCost: 12 },
      { name: "생체 소총", type: "heal", healAmount: 20, mpCost: 10 },
      { name: "나노 강화제", type: "buff", target: "atk", value: 9, duration: 4, mpCost: 24 },
    ],
  },

  // 젠야타
  {
    heroId: "zenyatta",
    skills: [
      { name: "조화의 구슬", type: "heal", healAmount: 25, mpCost: 12 },
      { name: "부조화의 구슬", type: "debuff", target: "def", value: 6, duration: 3, mpCost: 12 },
      { name: "파괴의 구슬", type: "attack", multiplier: 1.5, mpCost: 10 },
      { name: "초월", type: "heal", healAmount: 50, mpCost: 28 },
    ],
  },

  // 제트팩 캣
  {
    heroId: "jetpack-cat",
    skills: [
      { name: "정신 없는 비행", type: "buff", target: "def", value: 4, duration: 2, mpCost: 7 },
      { name: "생명줄", type: "heal", healAmount: 20, mpCost: 10 },
      { name: "골골대기", type: "heal", healAmount: 25, mpCost: 12 },
      { name: "납치한다냥", type: "debuff", target: "def", value: 8, duration: 4, mpCost: 22 },
    ],
  },

  // 라이프위버
  {
    heroId: "lifeweaver",
    skills: [
      { name: "치유의 꽃", type: "heal", healAmount: 30, mpCost: 14 },
      { name: "생명의 나무", type: "heal", healAmount: 45, mpCost: 24 },
      { name: "연꽃 단상", type: "buff", target: "def", value: 5, duration: 2, mpCost: 8 },
      { name: "가시 연사", type: "attack", multiplier: 1.3, mpCost: 8 },
    ],
  },

  // 메르시
  {
    heroId: "mercy",
    skills: [
      { name: "부활", type: "heal", healAmount: 30, mpCost: 14 },
      { name: "공격 강화", type: "buff", target: "atk", value: 6, duration: 3, mpCost: 12 },
      { name: "수호천사", type: "buff", target: "def", value: 3, duration: 1, mpCost: 5 },
      { name: "발키리", type: "heal", healAmount: 45, mpCost: 24 },
    ],
  },

  // 모이라
  {
    heroId: "moira",
    skills: [
      { name: "생체 손아귀", type: "attack", multiplier: 1.4, mpCost: 8 },
      { name: "생체 구슬", type: "heal", healAmount: 25, mpCost: 12 },
      { name: "소멸", type: "buff", target: "def", value: 4, duration: 1, mpCost: 6 },
      { name: "융화", type: "heal", healAmount: 45, mpCost: 24 },
    ],
  },

  // 키리코
  {
    heroId: "kiriko",
    skills: [
      { name: "치유의 부적", type: "heal", healAmount: 25, mpCost: 12 },
      { name: "쿠나이", type: "attack", multiplier: 1.6, mpCost: 10 },
      { name: "순보", type: "buff", target: "def", value: 4, duration: 1, mpCost: 6 },
      { name: "여우길", type: "buff", target: "atk", value: 8, duration: 4, mpCost: 22 },
    ],
  },

  // 미즈키
  {
    heroId: "mizuki",
    skills: [
      { name: "영혼 수리검", type: "attack", multiplier: 1.4, mpCost: 8 },
      { name: "속박 사슬", type: "debuff", target: "def", value: 4, duration: 2, mpCost: 8 },
      { name: "치유의 삿갓", type: "heal", healAmount: 25, mpCost: 12 },
      { name: "결계 성역", type: "debuff", target: "def", value: 8, duration: 4, mpCost: 22 },
    ],
  },

  // 브리기테
  {
    heroId: "brigitte",
    skills: [
      { name: "도리깨 투척", type: "attack", multiplier: 1.4, mpCost: 8 },
      { name: "수리 팩", type: "heal", healAmount: 25, mpCost: 12 },
      { name: "방벽 방패", type: "buff", target: "def", value: 7, duration: 2, mpCost: 10 },
      { name: "집결", type: "buff", target: "def", value: 9, duration: 4, mpCost: 22 },
    ],
  },

  // 일리아리
  {
    heroId: "illari",
    skills: [
      { name: "태양 소총", type: "attack", multiplier: 1.6, mpCost: 10 },
      { name: "치유의 태양석", type: "heal", healAmount: 20, mpCost: 10 },
      { name: "분출", type: "attack", multiplier: 1.4, mpCost: 8 },
      { name: "태양 작렬", type: "heal", healAmount: 45, mpCost: 24 },
    ],
  },

  // 우양
  {
    heroId: "wuyang",
    skills: [
      { name: "회복의 물결", type: "heal", healAmount: 25, mpCost: 12 },
      { name: "수호의 파도", type: "buff", target: "def", value: 6, duration: 2, mpCost: 10 },
      { name: "격류", type: "attack", multiplier: 1.3, mpCost: 8 },
      { name: "해일 폭발", type: "heal", healAmount: 45, mpCost: 24 },
    ],
  },

  // 주노
  {
    heroId: "juno",
    skills: [
      { name: "메디블라스터", type: "heal", healAmount: 25, mpCost: 12 },
      { name: "펄사 어뢰", type: "attack", multiplier: 1.5, mpCost: 10 },
      { name: "하이퍼 링", type: "buff", target: "def", value: 4, duration: 2, mpCost: 8 },
      { name: "궤도 광선", type: "heal", healAmount: 45, mpCost: 24 },
    ],
  },
];

/** heroId로 스킬 프리셋을 찾는다 */
export function getSkillPresetByHeroId(
  heroId: string,
): HeroSkillPreset | undefined {
  return SKILL_PRESETS.find((preset) => preset.heroId === heroId);
}

/** SkillPresetEntry를 Skill로 변환한다 (isDefault: false 추가) */
export function presetEntryToSkill(entry: SkillPresetEntry): Skill {
  return { ...entry, isDefault: false } as Skill;
}
