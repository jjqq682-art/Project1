import { BookQuest, CoverTheme, ReadingStamina } from '../types/quest';
import heroTabletopImg from '../assets/images/tabletop_hero_atlas_1795398029030.jpg';
import coverDreamImg from '../assets/images/quest_cover_dream_1795398029205.jpg';
import coverSolitudeImg from '../assets/images/quest_cover_solitude_1795398030776.jpg';
import coverLabyrinthImg from '../assets/images/quest_cover_labyrinth_1795398029689.jpg';

export const HERO_TABLETOP_IMAGE = heroTabletopImg;

export const COVER_IMAGES: Record<CoverTheme, string> = {
  dream: coverDreamImg,
  solitude: coverSolitudeImg,
  labyrinth: coverLabyrinthImg,
};

export interface MoodPreset {
  id: string;
  label: string;
  subtitle: string;
  energy: number;
  warmth: number;
  stamina: ReadingStamina;
}

export const MOOD_PRESETS: MoodPreset[] = [
  {
    id: 'weary-warmth',
    label: '지친 밤, 조용한 위로',
    subtitle: '복잡한 생각은 내려놓고 마음을 데우고 싶을 때',
    energy: 25,
    warmth: 85,
    stamina: 'light',
  },
  {
    id: 'rainy-reflection',
    label: '비 오는 날의 깊은 사색',
    subtitle: '서늘한 공기 속에서 삶의 결을 천천히 짚어보고 싶을 때',
    energy: 32,
    warmth: 35,
    stamina: 'balanced',
  },
  {
    id: 'lucid-spark',
    label: '머리가 맑아지는 지적 자극',
    subtitle: '익숙한 세계관을 뒤흔드는 정교한 미궁으로 들어가고 싶을 때',
    energy: 72,
    warmth: 25,
    stamina: 'epic',
  },
  {
    id: 'wandering-soul',
    label: '어딘가로 훌쩍 떠나고 싶은 날',
    subtitle: '반복되는 일상을 벗어나 낯선 시간과 공간을 여행하고 싶을 때',
    energy: 65,
    warmth: 68,
    stamina: 'balanced',
  },
  {
    id: 'quiet-resolve',
    label: '흔들리는 마음을 다잡는 결의',
    subtitle: '작은 파도 앞에서도 묵묵히 나아가는 인간의 힘을 느끼고 싶을 때',
    energy: 55,
    warmth: 48,
    stamina: 'balanced',
  },
  {
    id: 'light-smile',
    label: '부담 없이 피식 웃고 싶은 오후',
    subtitle: '사람 냄새 나는 작은 공간에서 가벼운 온기를 얻고 싶을 때',
    energy: 48,
    warmth: 92,
    stamina: 'light',
  },
];

export interface ReaderRankTier {
  level: number;
  title: string;
  minXp: number;
  nextXp: number;
}

export const READER_RANKS: ReaderRankTier[] = [
  { level: 1, title: '견습 탐독가', minXp: 0, nextXp: 150 },
  { level: 2, title: '밤의 이야기꾼', minXp: 150, nextXp: 350 },
  { level: 3, title: '미궁의 항해사', minXp: 350, nextXp: 650 },
  { level: 4, title: '시간의 기록자', minXp: 650, nextXp: 1050 },
  { level: 5, title: '만권의 현자', minXp: 1050, nextXp: 1600 },
];

export function getReaderRank(xp: number): ReaderRankTier {
  for (let i = READER_RANKS.length - 1; i >= 0; i--) {
    if (xp >= READER_RANKS[i].minXp) {
      return READER_RANKS[i];
    }
  }
  return READER_RANKS[0];
}

export const ACHIEVEMENTS = [
  {
    id: 'first-mood-oracle',
    title: '감정의 조율사',
    description: '기분 맞춤 퀘스트 카드 3장을 1회 이상 뽑았습니다.',
    xpReward: 40,
  },
  {
    id: 'fate-roller',
    title: '운명의 다이스',
    description: 'd20 운명 주사위를 굴려 우연한 책과 만났습니다.',
    xpReward: 30,
  },
  {
    id: 'story-witness',
    title: '이야기의 목격자',
    description: '분기형 줄거리 퀘스트를 끝까지 체험했습니다.',
    xpReward: 50,
  },
  {
    id: 'first-contract',
    title: '첫 번째 서재 계약',
    description: '내 모험 덱에 첫 번째 책을 등록했습니다.',
    xpReward: 40,
  },
  {
    id: 'boss-striker',
    title: '보스 토벌자',
    description: '독서 진행이나 집중 타이머로 던전 보스에게 타격을 입혔습니다.',
    xpReward: 60,
  },
  {
    id: 'babel-conqueror',
    title: '심연의 완독가',
    description: '모험 덱에서 책 1권을 완독하여 아티팩트를 해금했습니다.',
    xpReward: 120,
  },
];

export const CURATED_QUESTS: BookQuest[] = [
  {
    id: 'curated-earth-greenhouse',
    title: '지구 끝의 온실',
    author: '김초엽',
    genre: '서정 SF',
    dungeonName: '푸른 먼지가 잠든 유리 온실',
    dungeonRank: 'Lv.2 안개 숲',
    difficultyScore: 38,
    estimatedHours: 6,
    pages: 392,
    moodTags: ['위로', '잔잔한 호기심', '희망'],
    moodMatchReason:
      '세상이 잠시 잿빛처럼 느껴지는 날에도, 폐허 한가운데서 다시 피어나는 연대의 온기를 다정하게 건네주는 이야기입니다.',
    stats: {
      immersion: 86,
      depth: 74,
      lexicon: 42,
      resonance: 92,
    },
    bossChallenge: {
      name: '더스트 시대의 망각',
      description: '과거와 현재를 오가는 미스터리 단서들을 차분히 이어 붙이며 멸망 이후의 진실에 다가서야 합니다.',
    },
    recommendedBuff: '허브티 한 잔 + 창밖의 빗소리 (감정 공명 +18%)',
    coverTheme: 'dream',
    relicReward: {
      name: '모스바나의 마른 잎 책갈피',
      iconType: 'lantern',
      quote: '우리가 파괴한 세계 위에서도, 누군가는 끝내 다음 계절의 씨앗을 품는다.',
    },
    plotQuest: {
      prologue:
        '더스트라 불린 잿빛 먼지가 인류를 휩쓸고 지나간 뒤, 덩굴 식물 연구자 아영은 멸종된 줄 알았던 푸른 덩굴의 흔적을 쫓아 외딴 숲 폐허에 도착합니다.',
      stages: [
        {
          prompt: '무너진 온실 문 앞에 오래된 일지와 낯선 정체불명의 식물 표본이 놓여 있습니다. 무엇을 먼저 확인하겠습니까?',
          choiceA: {
            label: '이끼가 낀 낡은 연구 노트의 첫 장을 조심스레 펼친다',
            outcome:
              '종이 사이에서 50년 전 두 소녀의 이름이 적힌 낡은 메모가 떨어집니다. 차가운 폐허 속에 사람의 온기가 스며듭니다.',
            resonanceDelta: 22,
          },
          choiceB: {
            label: '유리 벽 너머로 희미하게 빛나는 푸른 덩굴의 뿌리를 따라간다',
            outcome:
              '금속 프레임을 감고 자란 덩굴이 기묘한 온기를 내뿜고 있습니다. 이 식물은 단순한 돌연변이가 아닙니다.',
            resonanceDelta: 20,
          },
        },
        {
          prompt: '그때 숲에서 만난 노인은 "그 온실은 아무도 찾지 말아야 할 기억"이라며 발길을 돌리라 말합니다. 어떻게 답하시겠습니까?',
          choiceA: {
            label: '왜 그곳을 기억하는 사람 모두가 침묵하는지 조용히 묻는다',
            outcome:
              '노인의 눈빛이 흔들리며, 과거 돔 도시 바깥에서 살아남으려 했던 사람들의 숨겨진 약속이 서서히 열립니다.',
            resonanceDelta: 26,
          },
          choiceB: {
            label: '이미 시작된 조사이기에 끝까지 진실을 기록하겠다고 답한다',
            outcome:
              '단호한 결심 앞에서 노인은 결국 열쇠 꾸러미 하나를 건네며 멸망 직전 마지막 여름의 이야기로 당신을 이끕니다.',
            resonanceDelta: 24,
          },
        },
      ],
      climaxHook:
        '잿빛 먼지가 하늘을 뒤덮던 날, 온실 안에서 일어난 기적과 두 사람의 선택은 아직 첫 장에 머물러 있습니다. 이제 실제 책의 페이지를 열어 그 비밀을 확인하세요.',
    },
  },
  {
    id: 'curated-convenience-store',
    title: '불편한 편의점',
    author: '김호연',
    genre: '일상 힐링 소설',
    dungeonName: '청파동 골목의 야간 불빛',
    dungeonRank: 'Lv.1 산책로',
    difficultyScore: 22,
    estimatedHours: 4,
    pages: 268,
    moodTags: ['가벼운 웃음', '위로', '따뜻함'],
    moodMatchReason:
      '머리가 무겁고 긴 글이 버거운 날, 부담 없이 펼쳤다가 사람 사는 냄새와 유쾌한 다정함에 마음이 금세 풀리는 작품입니다.',
    stats: {
      immersion: 91,
      depth: 54,
      lexicon: 26,
      resonance: 85,
    },
    bossChallenge: {
      name: '어색한 첫인상의 벽',
      description: '각자의 고민을 안고 편의점 문을 여는 손님들의 까칠한 마음을 삼각김밥 한 줄의 온기로 녹여야 합니다.',
    },
    recommendedBuff: '따뜻한 옥수수수염차 + 밤 11시의 스탠드 조명 (피로 회복 +20%)',
    coverTheme: 'dream',
    relicReward: {
      name: '야간 교대자의 명찰',
      iconType: 'key',
      quote: '결국 살아간다는 건, 누군가와 따뜻한 국물 한 모금을 나누는 일인지도 모른다.',
    },
    plotQuest: {
      prologue:
        '서울역 노숙자 생활을 하며 기억의 상당 부분을 잃은 남자 ‘독고’는 우연히 70대 여사장의 잃어버린 파우치를 찾아준 인연으로 작은 골목 편의점의 야간 알바를 제안받습니다.',
      stages: [
        {
          prompt: '첫 야간 근무 날, 늘 퉁명스럽게 들어와 소주와 안주만 사 가는 중년 손님이 진열대 앞에서 한숨을 쉽니다. 어떻게 응대할까요?',
          choiceA: {
            label: '말없이 뜨거운 컵라면 물 온도를 맞춰주고 덤으로 작은 말을 건넨다',
            outcome:
              '서툴지만 어눌하고 진심 어린 말투에 손님은 어이없다는 듯 웃음을 터뜨리며 닫혀 있던 말문을 엽니다.',
            resonanceDelta: 21,
          },
          choiceB: {
            label: '손님이 고른 도시락 옆에 가장 잘 어울리는 음료를 슬쩍 추천한다',
            outcome:
              '뜻밖의 세심한 추천에 깐깐하던 손님의 표정이 누그러지며, 편의점은 조금씩 동네의 아지트로 변해갑니다.',
            resonanceDelta: 19,
          },
        },
        {
          prompt: '단골들이 늘어나던 어느 밤, 독고의 잃어버린 과거와 맞닿은 결정적인 단서가 계산대 앞에 나타납니다.',
          choiceA: {
            label: '두려움을 무릅쓰고 사라졌던 기억의 문을 두드린다',
            outcome:
              '어눌했던 말투 뒤에 숨겨져 있던 놀라운 과거의 한 조각이 떠오르며 이야기에 따뜻한 긴장감이 감돕니다.',
            resonanceDelta: 25,
          },
          choiceB: {
            label: '지금 이곳에서 만난 사람들의 오늘을 먼저 지켜낸다',
            outcome:
              '편의점 안의 작은 연대가 단단해지며, 독고 역시 자신이 누구였는지보다 누구로 살아갈지를 깨닫기 시작합니다.',
            resonanceDelta: 23,
          },
        },
      ],
      climaxHook:
        '새벽 2시 형광등 아래 오가는 소박한 고백들, 그리고 독고가 되찾게 될 진짜 이름은 무엇일까요? 가볍고 따뜻한 산책길이 지금 열립니다.',
    },
  },
  {
    id: 'curated-outside-is-summer',
    title: '바깥은 여름',
    author: '김애란',
    genre: '현대 단편 소설집',
    dungeonName: '계절이 멈춘 일곱 개의 방',
    dungeonRank: 'Lv.2 안개 숲',
    difficultyScore: 52,
    estimatedHours: 5,
    pages: 272,
    moodTags: ['비 오는 밤', '쓸쓸함', '정교한 문장'],
    moodMatchReason:
      '말로 다 꺼내기 어려운 상실감이나 서늘한 감정이 마음을 스칠 때, 정교하고 단단한 문장이 그 감정을 조용히 대변해 줍니다.',
    stats: {
      immersion: 78,
      depth: 86,
      lexicon: 62,
      resonance: 95,
    },
    bossChallenge: {
      name: '말줄임표 속의 침묵',
      description: '과장 없는 담담한 문장 아래에 고여 있는 인물들의 깊은 슬픔을 마주하고 호흡을 고르는 힘이 필요합니다.',
    },
    recommendedBuff: '재즈 피아노 선율 + 빗방울 맺힌 창가 자리 (문장 감수성 +22%)',
    coverTheme: 'solitude',
    relicReward: {
      name: '여름 창가의 젖은 우표',
      iconType: 'feather',
      quote: '우리가 함께 겪은 계절은 끝났지만, 문장은 아직 그 바깥의 여름에 서 있다.',
    },
    plotQuest: {
      prologue:
        '어린 아이를 떠나보낸 부부, 늙은 반려견의 마지막 시간을 지키는 남자, 낯선 타국에서 엇갈린 사랑의 흔적을 밟는 연인까지—일곱 편의 단편이 고요한 방 안으로 들어섭니다.',
      stages: [
        {
          prompt: '오래된 아파트 베란다 너머로 여름비가 쏟아집니다. 당신은 오늘 어떤 시선으로 창밖을 바라보겠습니까?',
          choiceA: {
            label: '사라진 사람의 빈자리가 남긴 사소한 생활의 흔적을 응시한다',
            outcome:
              '냉장고 메모와 낡은 신발 한 짝 같은 일상의 사물들이 거대한 감정의 파도로 다가옵니다.',
            resonanceDelta: 25,
          },
          choiceB: {
            label: '창밖에서 여전히 아무 일 없다는 듯 흘러가는 타인의 계절을 본다',
            outcome:
              '나의 겨울과 세상의 여름 사이의 선명한 온도 차가 가슴 한구석을 서늘하게 울립니다.',
            resonanceDelta: 23,
          },
        },
        {
          prompt: '짧은 단편 한 편이 끝나갈 무렵, 인물은 말로 표현할 수 없는 감정의 경계에 섭니다.',
          choiceA: {
            label: '슬픔을 억지로 딛고 일어서기보다, 그 자리에 조용히 머물러 준다',
            outcome:
              '억지스러운 위로 대신 건네지는 담백한 공감이 오히려 깊은 숨을 내쉬게 만듭니다.',
            resonanceDelta: 24,
          },
          choiceB: {
            label: '작가의 치밀한 은유를 한 문장씩 곱씹으며 다음 편으로 넘어간다',
            outcome:
              '유리알처럼 투명하고 예리한 한국어 문장의 힘에 매료되어 시간 가는 줄 모르게 됩니다.',
            resonanceDelta: 22,
          },
        },
      ],
      climaxHook:
        '작은 방 안의 겨울과 문밖의 눈부신 여름이 교차하는 순간, 김애란의 문장들이 당신의 오늘 밤을 조용히 안아줄 것입니다.',
    },
  },
  {
    id: 'curated-demian',
    title: '데미안',
    author: '헤르만 헤세',
    genre: '성장 철학 고전',
    dungeonName: '알을 깨고 나오는 아브락사스의 성',
    dungeonRank: 'Lv.3 심해 유적',
    difficultyScore: 68,
    estimatedHours: 7,
    pages: 248,
    moodTags: ['방황', '사색', '내면의 변화'],
    moodMatchReason:
      '타인의 기준과 내 마음의 목소리 사이에서 방향을 고민하고 있을 때, 자기 자신에게로 걸어가는 단단한 용기를 깨워줍니다.',
    stats: {
      immersion: 74,
      depth: 94,
      lexicon: 68,
      resonance: 88,
    },
    bossChallenge: {
      name: '두 세계를 가르는 견고한 알 껍질',
      description: '선과 악, 빛과 어둠의 이분법을 넘어 자신만의 고유한 내면을 직면해야 하는 철학적 관문이 기다립니다.',
    },
    recommendedBuff: '에스프레소 더블샷 + 새벽의 정적 (사유력 +25%)',
    coverTheme: 'labyrinth',
    relicReward: {
      name: '새매가 새겨진 인장',
      iconType: 'compass',
      quote: '새는 알에서 나오려고 투쟁한다. 알은 세계다. 태어나려는 자는 하나의 세계를 깨뜨려야 한다.',
    },
    plotQuest: {
      prologue:
        '열 살 소년 에밀 싱클레어는 따뜻하고 질서 정연한 ‘밝은 세계’와 유혹적이고 불안한 ‘어두운 세계’ 사이에서 첫 번째 균열을 경험합니다. 그때 낯선 전학생 막스 데미안이 다가옵니다.',
      stages: [
        {
          prompt: '불량배 크로머의 협박에 시달리던 당신에게 데미안이 "카인의 표식"에 대한 도발적인 해석을 건넵니다. 어떻게 반응하겠습니까?',
          choiceA: {
            label: '지금껏 배워온 도덕 교과서의 기준이 흔들리는 두려움과 마주한다',
            outcome:
              '익숙한 안온함이 무너지는 틈새로, 남들이 정해준 답이 아닌 나만의 질문이 싹트기 시작합니다.',
            resonanceDelta: 24,
          },
          choiceB: {
            label: '데미안의 시선 너머에 숨겨진 단단한 독립심의 비밀을 캐묻는다',
            outcome:
              '그는 미소 지으며 "네 안에서 솟아오르는 것, 바로 그것을 살아보려 애쓰라"는 말을 남깁니다.',
            resonanceDelta: 26,
          },
        },
        {
          prompt: '성장한 싱클레어 앞에 불길하고 매혹적인 신 ‘아브락사스’의 상징이 나타납니다.',
          choiceA: {
            label: '빛과 어둠을 모두 끌어안는 온전한 자아를 향해 걸음을 옮긴다',
            outcome:
              '내면의 파편들이 하나로 모이며, 한 번도 본 적 없는 새로운 새벽의 윤곽이 드러납니다.',
            resonanceDelta: 28,
          },
          choiceB: {
            label: '오르간 선율이 울리는 성당 문 앞에서 잠시 망설이며 숨을 고른다',
            outcome:
              '방황조차 성장의 일부임을 깨달으며, 내면의 목소리가 더욱 또렷하게 울려 퍼집니다.',
            resonanceDelta: 22,
          },
        },
      ],
      climaxHook:
        '거울 속을 들여다보았을 때 마침내 마주하게 될 한 사람의 얼굴은 누구일까요? 자기 자신을 찾아 떠나는 가장 오래된 여정이 시작됩니다.',
    },
  },
  {
    id: 'curated-the-stranger',
    title: '이방인',
    author: '알베르 카뮈',
    genre: '실존주의 고전',
    dungeonName: '눈부신 태양 아래의 백색 법정',
    dungeonRank: 'Lv.3 심해 유적',
    difficultyScore: 66,
    estimatedHours: 4,
    pages: 192,
    moodTags: ['무기력', '냉소', '본질 탐구'],
    moodMatchReason:
      '세상의 관습이나 소음이 괜히 낯설고 건조하게 느껴지는 날, 거짓 위선 없이 삶과 존재의 맨얼굴을 직시하게 만듭니다.',
    stats: {
      immersion: 82,
      depth: 92,
      lexicon: 58,
      resonance: 84,
    },
    bossChallenge: {
      name: '부조리의 작렬하는 태양',
      description: '사회의 도덕적 기대에 맞추어 거짓 감정으로 자신을 포장하라는 요구 앞에서 끝까지 솔직함을 지킬 수 있을까요.',
    },
    recommendedBuff: '아이스 아메리카노 + 선명한 오후의 햇빛 (통찰력 +20%)',
    coverTheme: 'solitude',
    relicReward: {
      name: '알제 해변의 하얀 조약돌',
      iconType: 'moon',
      quote: '오늘 엄마가 죽었다. 아니, 어쩌면 어제.',
    },
    plotQuest: {
      prologue:
        '어머니의 부고를 받고 양로원으로 향한 뫼르소는 눈물을 흘리는 대신 커피를 마시고 담배를 피웁니다. 다음 날 바다로 나간 그는 한여름의 뜨거운 햇살 아래서 돌이킬 수 없는 순간을 맞습니다.',
      stages: [
        {
          prompt: '사람들이 당신에게 "왜 남들처럼 슬퍼하지 않느냐"고 의아한 시선을 보냅니다. 당신의 태도는?',
          choiceA: {
            label: '느끼지 않은 감정을 억지로 꾸며내지 않고 있는 그대로 답한다',
            outcome:
              '당신의 담백한 솔직함은 오히려 사회가 정해둔 규칙에 균열을 내는 위험한 불씨로 보이기 시작합니다.',
            resonanceDelta: 25,
          },
          choiceB: {
            label: '아무 말 없이 지금 눈앞의 바다와 햇빛의 감각에만 집중한다',
            outcome:
              '관습의 소음이 멀어지고, 오직 현재의 감각만이 날카롭게 살아남습니다.',
            resonanceDelta: 22,
          },
        },
        {
          prompt: '예심 판사가 구원의 십자가를 내밀며 회개를 요구합니다. 어떻게 하시겠습니까?',
          choiceA: {
            label: '내가 믿지 않는 거짓 위안은 끝까지 거부한다',
            outcome:
              '법정 안은 술렁이지만, 당신의 시선은 천장 너머의 맑은 밤하늘을 향해 맑게 트입니다.',
            resonanceDelta: 27,
          },
          choiceB: {
            label: '판사의 논리가 왜 그토록 자신과 어긋나는지 차갑게 관찰한다',
            outcome:
              '인간이 만든 제도의 부조리가 투명하게 드러나며, 실존의 깊은 울림이 남습니다.',
            resonanceDelta: 24,
          },
        },
      ],
      climaxHook:
        '감옥의 작은 창으로 별빛이 쏟아지는 마지막 밤, 뫼르소가 도달한 기이한 행복의 정체는 무엇일까요? 짧은 분량 안에 거대한 철학이 압축되어 있습니다.',
    },
  },
  {
    id: 'curated-ficciones',
    title: '픽션들',
    author: '호르헤 루이스 보르헤스',
    genre: '환상 · 미궁 문학',
    dungeonName: '끝없는 육각형 바벨의 도서관',
    dungeonRank: 'Lv.4 바벨의 탑',
    difficultyScore: 91,
    estimatedHours: 11,
    pages: 256,
    moodTags: ['지적 자극', '몰입', '불가사의'],
    moodMatchReason:
      '평범한 서사가 지루해지고, 뇌세포가 번쩍 깨어나는 듯한 지적 현기증과 정교한 상상력의 미궁을 탐험하고 싶을 때 최고의 선택입니다.',
    stats: {
      immersion: 68,
      depth: 98,
      lexicon: 90,
      resonance: 82,
    },
    bossChallenge: {
      name: '무한 회귀하는 시간의 미궁',
      description: '현실과 허구, 백과사전과 꿈의 경계가 무너지는 현기증 속에서 길을 잃지 않도록 집중력을 유지해야 합니다.',
    },
    recommendedBuff: '진한 블랙커피 + 메모용 만년필 (지적 해독력 +30%)',
    coverTheme: 'labyrinth',
    relicReward: {
      name: '육각형 열람실의 황동 거울',
      iconType: 'hourglass',
      quote: '우주는—누군가는 도서관이라 부르는 곳은—무수히 많은 육각형 회랑들로 이루어져 있다.',
    },
    plotQuest: {
      prologue:
        '가상의 백과사전 속 행성 틀뢴이 현실 세계를 서서히 잠식하고, 모든 가능한 책이 꽂혀 있는 무한한 도서관의 복도가 당신 앞에 끝없이 펼쳐집니다.',
      stages: [
        {
          prompt: '도서관의 육각형 회랑에서 모든 언어의 해독 열쇠가 담긴 목록서를 발견했습니다. 어떻게 사용하겠습니까?',
          choiceA: {
            label: '단 한 줄도 빠짐없이 모든 페이지의 변형 규칙을 추적한다',
            outcome:
              '시간이 두 갈래, 세 갈래로 갈라지는 정원처럼 무수한 평행 세계의 가능성이 눈앞에 겹쳐집니다.',
            resonanceDelta: 26,
          },
          choiceB: {
            label: '거울이 비추는 회랑의 끝에서 이 미궁을 설계한 자의 의도를 추론한다',
            outcome:
              '글을 읽는 당신 자신마저 누군가의 책 속 한 문장일지 모른다는 기묘한 전율이 스칩니다.',
            resonanceDelta: 28,
          },
        },
        {
          prompt: '기억을 한 번도 잊지 못해 고통받는 남자 ‘푸네스’가 어두운 방 안에서 당신을 부릅니다.',
          choiceA: {
            label: '모든 것을 기억하는 능력의 축복과 저주에 대해 묻는다',
            outcome:
              '사소한 나뭇잎의 떨림까지 모두 기억하는 그의 세계에서 진정한 ‘생각한다’는 것의 의미를 깨닫습니다.',
            resonanceDelta: 25,
          },
          choiceB: {
            label: '망각의 가치를 떠올리며 어둠 속에서 조용히 발걸음을 뗀다',
            outcome:
              '짧은 단편 하나가 웬만한 장편소설 열 권보다 깊은 여운을 머릿속에 새깁니다.',
            resonanceDelta: 24,
          },
        },
      ],
      climaxHook:
        '한 권의 책이 아니라 무한한 우주를 압축해 놓은 이 얇은 단편집, 당신의 지적 내공을 시험할 가장 매혹적인 던전이 열립니다.',
    },
  },
  {
    id: 'curated-old-man-and-sea',
    title: '노인과 바다',
    author: '어니스트 헤밍웨이',
    genre: '모험 고전',
    dungeonName: '멕시코 만류의 푸른 심해',
    dungeonRank: 'Lv.2 안개 숲',
    difficultyScore: 44,
    estimatedHours: 4,
    pages: 148,
    moodTags: ['투지', '조용한 결의', '집중'],
    moodMatchReason:
      '뜻대로 되지 않는 현실 앞에서 마음이 흔들릴 때, 군더더기 없는 단단한 문장이 묵묵히 버티는 인간의 품격을 일깨워 줍니다.',
    stats: {
      immersion: 88,
      depth: 82,
      lexicon: 45,
      resonance: 90,
    },
    bossChallenge: {
      name: '사흘 밤낮을 버티는 낚싯줄의 장력',
      description: '거대한 청새치와의 사투, 그리고 뒤이어 몰려오는 상어 떼 앞에서도 자존심을 잃지 않는 고독한 인내가 시험대에 오릅니다.',
    },
    recommendedBuff: '시원한 물 한 잔 + 파도 소리 화이트노이즈 (집중력 +20%)',
    coverTheme: 'solitude',
    relicReward: {
      name: '소금기 밴 낡은 낚싯바늘',
      iconType: 'compass',
      quote: '인간은 패배하도록 만들어지지 않았다. 파괴될 수는 있어도 패배하지는 않는다.',
    },
    plotQuest: {
      prologue:
        '84일 동안 단 한 마리의 물고기도 잡지 못한 늙은 어부 산티아고. 마을 사람들은 그를 ‘살라오(지독한 불운)’라 부르지만, 그는 85일째 새벽 아무도 가지 않은 먼 바다로 조각배를 띄웁니다.',
      stages: [
        {
          prompt: '수평선 너머로 깊은 바다에 드리운 낚싯줄이 엄청난 힘으로 당겨집니다. 배가 끌려가기 시작할 때 어떻게 하겠습니까?',
          choiceA: {
            label: '아픈 왼손의 쥐를 참아내며 낚싯줄을 어깨에 단단히 감는다',
            outcome:
              '보이지 않는 거대한 생명체와 낚싯줄 하나를 사이에 둔 숭고한 대결이 시작됩니다.',
            resonanceDelta: 24,
          },
          choiceB: {
            label: '무리하게 당기지 않고 바다의 흐름을 읽으며 거대한 물고기의 호흡을 기다린다',
            outcome:
              '바다는 적이 아니라 오래된 벗으로 변하며, 고독한 항해에 장엄한 리듬이 생깁니다.',
            resonanceDelta: 22,
          },
        },
        {
          prompt: '밤하늘의 별빛 아래, 노인은 자신이 맞서고 있는 거대한 청새치에게 묘한 연대감을 느낍니다.',
          choiceA: {
            label: '"너는 정말 훌륭한 적수다"라고 조용히 말을 건넨다',
            outcome:
              '승패를 넘어선 존중 속에서 노인의 고독이 단단한 존엄으로 빛나기 시작합니다.',
            resonanceDelta: 26,
          },
          choiceB: {
            label: '동이 트기 전까지 정신이 흐려지지 않도록 지난날의 기억을 떠올린다',
            outcome:
              '사자가 노닐던 아프리카 해변의 꿈처럼 맑은 힘 이 노인의 팔에 다시 깃듭니다.',
            resonanceDelta: 23,
          },
        },
      ],
      climaxHook:
        '마침내 수면 위로 거대한 은빛 몸체를 드러낸 청새치, 그리고 그 뒤를 따라오는 또 다른 시련—단숨에 읽히지만 평생 잊히지 않을 항해를 떠나보세요.',
    },
  },
  {
    id: 'curated-momo',
    title: '모모',
    author: '미하엘 엔데',
    genre: '판타지 우화',
    dungeonName: '회색 신사들이 훔쳐 간 시간의 원형극장',
    dungeonRank: 'Lv.1 산책로',
    difficultyScore: 34,
    estimatedHours: 7,
    pages: 368,
    moodTags: ['번아웃', '여유 회복', '동화적 상상'],
    moodMatchReason:
      '할 일에 쫓겨 하루가 너무 빠르게 지나가는 것 같은 날, 진짜 ‘시간을 산다는 것’이 무엇인지 따뜻하고 환상적으로 되돌아보게 합니다.',
    stats: {
      immersion: 90,
      depth: 80,
      lexicon: 35,
      resonance: 93,
    },
    bossChallenge: {
      name: '회색 신사들의 시간 저축 은행',
      description: '"시간을 아껴라"는 효율의 속삭임에 속아 삶의 따뜻한 순간들을 저당 잡히지 않도록 경청의 힘을 지켜야 합니다.',
    },
    recommendedBuff: '따뜻한 밀크티 + 휴대폰 방해 금지 모드 (여유 회복 +25%)',
    coverTheme: 'dream',
    relicReward: {
      name: '거북이 카시오페이아의 시간꽃',
      iconType: 'hourglass',
      quote: '시간은 삶이며, 삶은 우리 마음속에 깃들어 있는 것이다.',
    },
    plotQuest: {
      prologue:
        '도시 외곽의 낡은 원형극장에 사는 소녀 모모에게는 남들의 이야기를 가만히 들어주는 특별한 재능이 있습니다. 그런데 어느 날부터 도시의 사람들이 모두 "시간을 아껴야 한다"며 웃음을 잃어갑니다.',
      stages: [
        {
          prompt: '늘 다정하던 동네 이발사 아저씨가 "이제 손님과 수다 떨 시간도 아깝다"며 시계만 쳐다봅니다. 모모라면 어떻게 할까요?',
          choiceA: {
            label: '조급해진 아저씨의 맞은편에 앉아 아무 재촉 없이 이야기를 들어준다',
            outcome:
              '모모의 고요한 경청 앞에서 굳어 있던 어른의 마음속에 잊고 있던 여유가 조금씩 되살아납니다.',
            resonanceDelta: 23,
          },
          choiceB: {
            label: '그에게 시가 연기를 뿜는 수상한 회색 신사가 다녀갔는지 살핀다',
            outcome:
              '서늘한 잿빛 기운을 풍기며 사람들의 시간을 훔치는 비밀 조직의 그림자가 서서히 포착됩니다.',
            resonanceDelta: 21,
          },
        },
        {
          prompt: '등껍질에 글자가 떠오르는 신비한 거북이 카시오페이아가 모모에게 ‘아무 데도 없는 집’으로 가자고 안내합니다.',
          choiceA: {
            label: '서두르지 말고 거북이의 느린 걸음에 발을 맞춰 따라간다',
            outcome:
              '느리게 걸을수록 오히려 더 빨리 도달하는 역설적인 시간의 마법이 눈앞에 펼쳐집니다.',
            resonanceDelta: 26,
          },
          choiceB: {
            label: '호라 박사가 기다리는 시간의 근원지를 향해 설레는 마음으로 문을 연다',
            outcome:
              '세상 모든 사람의 마음속에서 피어나는 황금빛 ‘시간꽃’의 비밀이 조금씩 모습을 드러냅니다.',
            resonanceDelta: 25,
          },
        },
      ],
      climaxHook:
        '회색 신사들의 추격을 피해 모모는 도시의 잃어버린 시간들을 되찾을 수 있을까요? 어른이 되어서 읽으면 더욱 깊이 울리는 마법 같은 이야기가 기다립니다.',
    },
  },
  {
    id: 'curated-almond',
    title: '아몬드',
    author: '손원평',
    genre: '성장 심리 소설',
    dungeonName: '감정이 잠든 아몬드의 미로',
    dungeonRank: 'Lv.1 산책로',
    difficultyScore: 28,
    estimatedHours: 4,
    pages: 264,
    moodTags: ['공감', '성찰', '빠른 몰입'],
    moodMatchReason:
      '감정의 무게에 지치거나 관계의 온도가 낯설게 느껴질 때, 오히려 감정을 느끼지 못하는 소년의 시선을 통해 ‘마음이 움직인다’는 것의 의미를 선명하게 보여줍니다.',
    stats: {
      immersion: 93,
      depth: 76,
      lexicon: 32,
      resonance: 90,
    },
    bossChallenge: {
      name: '타인의 시선이라는 편견의 벽',
      description: '세상이 정한 평범함의 틀 밖에서도 스스로의 방식으로 누군가를 구하고 이해하려는 용기를 시험받습니다.',
    },
    recommendedBuff: '레몬티 + 조용한 밤 산책 후 침대 스탠드 (몰입도 +20%)',
    coverTheme: 'solitude',
    relicReward: {
      name: '작은 가죽 표지 수첩',
      iconType: 'feather',
      quote: '멀리서 보면 비극이지만 가까이서 보면 희극이 아니라, 누구도 함부로 정의할 수 없는 삶이 있다.',
    },
    plotQuest: {
      prologue:
        '선천적으로 뇌의 편도체가 작아 공포도 분노도 잘 느끼지 못하는 소년 윤재. 할머니와 엄마의 세심한 돌봄 속에서 감정을 학습하던 어느 크리스마스이브, 평온했던 일상이 한순간에 무너집니다.',
      stages: [
        {
          prompt: '홀로 남게 된 윤재 앞에 거칠고 공격적인 소년 ‘곤이’가 나타납니다. 감정을 읽지 못하는 당신은 어떻게 마주하겠습니까?',
          choiceA: {
            label: '주먹을 휘두르려는 곤이의 눈을 흔들림 없이 담담하게 마주 본다',
            outcome:
              '겁먹지도 화내지도 않는 윤재의 기묘한 평온함 앞에서, 곤이의 분노는 오히려 방향을 잃고 멈춰 섭니다.',
            resonanceDelta: 24,
          },
          choiceB: {
            label: '그가 왜 그렇게까지 화가 나 있는지 한 발 물러서서 관찰한다',
            outcome:
              '겉으로 드러난 거친 말투 뒤에 숨어 있는 상처의 모양이 서서히 윤재의 눈에 들어오기 시작합니다.',
            resonanceDelta: 21,
          },
        },
        {
          prompt: '조금씩 가까워진 두 소년에게 위험한 위기가 찾아옵니다. 지금 당신의 마음을 움직이는 것은 무엇입니까?',
          choiceA: {
            label: '이유를 설명할 수 없지만, 곤이를 구하기 위해 망설임 없이 몸을 움직인다',
            outcome:
              '머리로 배운 감정이 아니라 몸이 먼저 반응한 순간, 아몬드처럼 굳어 있던 내면에 미세한 균열이 생깁니다.',
            resonanceDelta: 27,
          },
          choiceB: {
            label: '할머니가 적어주신 감정 단어를 떠올리며 지금의 느낌에 이름을 붙인다',
            outcome:
              '두려움과 걱정이라는 낯선 감각이 처음으로 싹트며 이야기의 심장이 힘차게 뛰기 시작합니다.',
            resonanceDelta: 23,
          },
        },
      ],
      climaxHook:
        '느끼지 못하던 소년이 누군가를 위해 위험 속으로 걸어 들어갈 때, 과연 그의 마음속에서는 어떤 기적이 피어날까요?',
    },
  },
  {
    id: 'curated-dallergut',
    title: '달러구트 꿈 백화점',
    author: '이미예',
    genre: '힐링 판타지',
    dungeonName: '잠든 자들이 드나드는 5층 백화점',
    dungeonRank: 'Lv.1 산책로',
    difficultyScore: 24,
    estimatedHours: 5,
    pages: 300,
    moodTags: ['몽환', '따뜻한 위로', '휴식'],
    moodMatchReason:
      '잠들기 전 머릿속의 걱정을 잠시 내려놓고, 다정하고 기발한 상상력 속에서 기분 좋은 꿈을 꾸듯 쉬어가고 싶은 밤에 가장 잘 어울립니다.',
    stats: {
      immersion: 90,
      depth: 62,
      lexicon: 28,
      resonance: 88,
    },
    bossChallenge: {
      name: '잠들지 못하는 새벽의 잡념',
      description: '현실의 피로를 잠시 문 밖에 두고 몽환적인 꿈의 진열대 앞에 설 수 있는 여유를 회복해야 합니다.',
    },
    recommendedBuff: '따뜻한 캐모마일 차 + 포근한 담요 (수면 직전 평온 +25%)',
    coverTheme: 'dream',
    relicReward: {
      name: '별빛이 담긴 꿈 유리병',
      iconType: 'moon',
      quote: '잠든 시간은 낭비가 아니라, 깨어 있는 나를 다시 사랑하기 위해 건너가는 다리다.',
    },
    plotQuest: {
      prologue:
        '잠들어야만 입장할 수 있는 신비한 마을 한가운데, 온갖 꿈을 진열해 파는 ‘달러구트 꿈 백화점’이 있습니다. 신입 직원 페니는 오늘 밤 손님들에게 가장 알맞은 꿈을 골라주어야 합니다.',
      stages: [
        {
          prompt: '자정이 넘은 시각, 지친 표정의 손님이 백화점 1층에 들어섰습니다. 어떤 꿈을 권해드리겠습니까?',
          choiceA: {
            label: '그리운 사람과 아무 걱정 없이 차를 마시는 재회의 꿈을 꺼내 보인다',
            outcome:
              '유리병이 은은한 금빛으로 빛나며 손님의 굳어 있던 어깨가 사르르 풀립니다.',
            resonanceDelta: 24,
          },
          choiceB: {
            label: '푸른 하늘 위를 자유롭게 날아다니는 비상의 꿈을 추천한다',
            outcome:
              '청량한 바람의 감촉이 손님의 마음에 스며들며 내일을 살아갈 산뜻한 활력이 피어납니다.',
            resonanceDelta: 22,
          },
        },
        {
          prompt: '꿈값을 계산하는 카운터에서 손님은 잠에서 깬 뒤 느낀 ‘감정’으로 대금을 치릅니다.',
          choiceA: {
            label: '손님이 남기고 간 따뜻한 설렘과 여운을 조심스레 병에 담는다',
            outcome:
              '백화점 장부에 반짝이는 기록이 남고, 이곳이 단순한 상점이 아닌 마음의 치유소임을 깨닫습니다.',
            resonanceDelta: 25,
          },
          choiceB: {
            label: '가장 잘 팔리는 인기 꿈 제작자 ‘야스누즈’의 비밀 작업실을 엿본다',
            outcome:
              '사람들이 왜 하필 그토록 이상하고 아련한 꿈을 찾는지 놀라운 비밀이 밝혀집니다.',
            resonanceDelta: 23,
          },
        },
      ],
      climaxHook:
        '오늘 밤 당신이 잠든 사이, 달러구트 백화점의 5층 창고에서는 어떤 특별한 꿈이 당신을 기다리고 있을까요?',
    },
  },
  {
    id: 'curated-little-prince',
    title: '어린 왕자',
    author: '앙투안 드 생텍쥐페리',
    genre: '철학 동화 고전',
    dungeonName: '소행성 B612와 사막의 별빛',
    dungeonRank: 'Lv.2 안개 숲',
    difficultyScore: 40,
    estimatedHours: 3,
    pages: 144,
    moodTags: ['순수', '사색', '그리움'],
    moodMatchReason:
      '어른이 되며 무뎌진 감각을 다시 맑게 닦아내고, 내가 진심으로 ‘길들인’ 소중한 관계와 본질을 조용히 떠올리고 싶을 때 딱 맞는 책입니다.',
    stats: {
      immersion: 84,
      depth: 88,
      lexicon: 38,
      resonance: 96,
    },
    bossChallenge: {
      name: '숫자와 소유에만 집착하는 어른의 시선',
      description: '눈에 보이지 않는 마음의 가치를 가볍게 여기는 세속의 논리를 벗어나 별이 웃는 소리를 들을 줄 알아야 합니다.',
    },
    recommendedBuff: '은은한 밤 하늘 플레이리스트 + 따뜻한 우유 한 잔 (순수 회복 +30%)',
    coverTheme: 'solitude',
    relicReward: {
      name: '사막 여우의 황금빛 밀밭',
      iconType: 'lantern',
      quote: '가장 중요한 것은 눈에 보이지 않아. 오직 마음으로 보아야만 잘 볼 수 있어.',
    },
    plotQuest: {
      prologue:
        '사하라 사막 한가운데 비행기가 불시착한 밤, 지친 조종사 앞에 먼 별에서 온 작은 소년이 나타나 "양 한 마리만 그려줘"라고 부탁합니다.',
      stages: [
        {
          prompt: '어린 왕자가 자신이 떠나온 작은 별의 장미꽃 이야기를 들려줍니다. 어떤 질문으로 대화를 이어가겠습니까?',
          choiceA: {
            label: '까다롭고 도도한 그 장미꽃을 왜 그토록 떠나기 아쉬워했는지 묻는다',
            outcome:
              '왕자는 잠시 침묵하더니, 물을 주고 유리 덮개를 씌워주던 시간 자체가 꽃을 특별하게 만들었다고 고백합니다.',
            resonanceDelta: 26,
          },
          choiceB: {
            label: '사막에서 만난 여우가 가르쳐준 ‘길들인다’는 말의 뜻을 묻는다',
            outcome:
              '세상에 수만 송이의 장미가 있어도, 내가 시간을 들인 단 한 송이만이 유일해진다는 진실이 가슴을 울립니다.',
            resonanceDelta: 25,
          },
        },
        {
          prompt: '사막의 목마름 속에서 마침내 두 사람은 별빛 아래 숨겨진 오래된 우물을 찾아냅니다.',
          choiceA: {
            label: '두레박에 담긴 물 한 모금이 왜 그토록 달콤한지 조용히 음미한다',
            outcome:
              '밤하늘 아래 함께 걸었던 발걸음과 마음이 그 물에 담겨 있음을 깨닫습니다.',
            resonanceDelta: 27,
          },
          choiceB: {
            label: '이제 별으로 돌아가야 할 왕자의 마지막 선택을 묵묵히 지켜본다',
            outcome:
              '슬픔 속에서도 밤하늘의 모든 별이 방울처럼 웃을 것이라는 약속이 마음속에 별빛처럼 남습니다.',
            resonanceDelta: 24,
          },
        },
      ],
      climaxHook:
        '어릴 적 읽었을 때와는 전혀 다른 문장으로 다가오는 어른을 위한 동화, 오늘 밤 하늘의 별 하나를 마음속에 켜보세요.',
    },
  },
  {
    id: 'curated-1984',
    title: '1984',
    author: '조지 오웰',
    genre: '디스토피아 고전',
    dungeonName: '빅 브라더의 감시탑과 101호실',
    dungeonRank: 'Lv.4 바벨의 탑',
    difficultyScore: 84,
    estimatedHours: 12,
    pages: 420,
    moodTags: ['긴장감', '지적 각성', '몰입'],
    moodMatchReason:
      '안온한 이야기보다 심장을 조이는 긴장감과 날카로운 사회·철학적 통찰로 정신이 번쩍 드는 강렬한 독서를 원할 때 최고의 선택입니다.',
    stats: {
      immersion: 88,
      depth: 95,
      lexicon: 72,
      resonance: 86,
    },
    bossChallenge: {
      name: '이중사고와 진실부의 기억 조작',
      description: '언어와 역사마저 통제되는 거대한 전체주의 시스템 속에서 개인의 진실과 기억을 끝까지 지켜내야 합니다.',
    },
    recommendedBuff: '진한 블랙커피 + 팽팽한 긴장감을 주는 앰비언트 사운드 (집중력 +25%)',
    coverTheme: 'labyrinth',
    relicReward: {
      name: '금지된 유리 문진',
      iconType: 'key',
      quote: '자유란 둘 더하기 둘이 넷이라고 말할 수 있는 자유다.',
    },
    plotQuest: {
      prologue:
        '거대한 스크린 ‘텔레스크린’이 모든 집 안을 감시하는 오세아니아. 진실부 말단 공무원 윈스턴 스미스는 사각지대 구석에서 금지된 공책을 펼치고 몰래 일기를 쓰기 시작합니다.',
      stages: [
        {
          prompt: '동료 여성 줄리아가 당신의 손에 몰래 접힌 쪽지 하나를 쥐여주었습니다. 사상경찰의 눈을 피해 어떻게 행동하겠습니까?',
          choiceA: {
            label: '숨 막히는 감시망을 뚫고 인적 드문 숲속 비밀 장소에서 그녀를 만난다',
            outcome:
              '회색빛 도시 바깥의 짧은 자유 속에서, 억압된 인간성이 얼마나 강렬하게 살아 숨 쉬는지 체감합니다.',
            resonanceDelta: 25,
          },
          choiceB: {
            label: '골동품 상점 위층의 텔레스크린 없는 작은 방을 은신처로 삼는다',
            outcome:
              '유리 문진 속 산호처럼 아늑한 공간에서 두 사람은 시스템에 균열을 내는 위험한 저항을 꿈꿉니다.',
            resonanceDelta: 24,
          },
        },
        {
          prompt: '고위 간부 오브라이언이 비밀 저항 조직의 금서 ‘골드스타인의 책’을 건네주겠다는 신호를 보냅니다.',
          choiceA: {
            label: '체포의 위험을 감수하고서라도 진실이 적힌 금서의 문을 연다',
            outcome:
              '권력이 왜 권력을 유지하려 하는지, 서늘하고 소름 돋는 통찰의 실체가 눈앞에 드러납니다.',
            resonanceDelta: 28,
          },
          choiceB: {
            label: '그의 눈빛 속에 숨은 의도가 진짜 동지애인지 냉정하게 의심한다',
            outcome:
              '누구도 믿을 수 없는 세계의 긴장감이 최고조에 달하며 책에서 눈을 뗄 수 없게 됩니다.',
            resonanceDelta: 26,
          },
        },
      ],
      climaxHook:
        '감시와 언어 조작의 끝에서 윈스턴을 기다리는 ‘101호실’의 정체는 무엇일까요? 단 한 번 읽으면 평생 잊히지 않을 압도적인 디스토피아가 열립니다.',
    },
  },
  {
    id: 'curated-namiya',
    title: '나미야 잡화점의 기적',
    author: '히가시노 게이고',
    genre: '미스터리 힐링',
    dungeonName: '32년 전 편지가 닿는 낡은 잡화점',
    dungeonRank: 'Lv.1 산책로',
    difficultyScore: 30,
    estimatedHours: 6,
    pages: 456,
    moodTags: ['따뜻함', '미스터리', '인연'],
    moodMatchReason:
      '마음이 헛헛하거나 누군가의 진심 어린 조언이 필요할 때, 시간을 건너 이어지는 따뜻한 편지들이 촘촘한 퍼즐처럼 마음을 채워줍니다.',
    stats: {
      immersion: 94,
      depth: 72,
      lexicon: 30,
      resonance: 92,
    },
    bossChallenge: {
      name: '엇갈린 시간 속의 미완성 편지',
      description: '우유 상자에 도착하는 과거의 고민들 사이에서 숨겨진 인연의 실타래를 끝까지 놓치지 말아야 합니다.',
    },
    recommendedBuff: '따뜻한 우유 + 비 오는 밤의 우체통 감성 (몰입도 +22%)',
    coverTheme: 'dream',
    relicReward: {
      name: '낡은 셔터 틈의 답장 봉투',
      iconType: 'key',
      quote: '아무리 하찮은 고민이라도, 진심으로 귀 기울이는 순간 기적은 시작된다.',
    },
    plotQuest: {
      prologue:
        '어느 날 밤, 낡고 문 닫은 잡화점에 숨어든 세 명의 빈집털이 청년 앞에 셔터 틈으로 32년 전에서 온 고민 상담 편지가 뚝 떨어집니다.',
      stages: [
        {
          prompt: '편지에는 시한부 연인과 올림픽 꿈 사이에서 괴로워하는 여성의 절박한 사연이 적혀 있습니다. 장난으로 넘길 수도 있는 상황, 어떻게 하겠습니까?',
          choiceA: {
            label: '서툰 글씨라도 진심을 담아 편지지 위에 조심스레 답장을 써 내려간다',
            outcome:
              '우유 상자 속에 답장을 넣자마자 바람 소리가 스치고, 과거의 운명이 미세하게 방향을 틀기 시작합니다.',
            resonanceDelta: 24,
          },
          choiceB: {
            label: '왜 이런 기이한 일이 일어나는지 잡화점 주인 할아버지의 옛 기억을 추리한다',
            outcome:
              '과거와 현재를 잇는 절묘한 시간의 연결고리가 하나씩 맞춰지며 소름 돋는 전율이 흐릅니다.',
            resonanceDelta: 22,
          },
        },
        {
          prompt: '두 번째 편지가 도착하며, 이 작은 잡화점이 동네 사람들의 인생을 어떻게 바꾸어 놓았는지 드러납니다.',
          choiceA: {
            label: '겉돌던 인물들의 이야기가 하나의 궤도로 만나는 순간을 지켜본다',
            outcome:
              '흩어져 있던 작은 선의들이 거대한 기적의 그물로 엮이는 따뜻한 카타르시스가 밀려옵니다.',
            resonanceDelta: 26,
          },
          choiceB: {
            label: '백지 편지를 넣으면 어떤 답이 돌아올지 마지막 밤을 기다린다',
            outcome:
              '동이 트기 전 마지막 우유 상자 앞에서 삶의 방향을 비추는 다정한 한 문장을 마주하게 됩니다.',
            resonanceDelta: 25,
          },
        },
      ],
      climaxHook:
        '다섯 개의 사연이 마침내 하나의 기적으로 이어지는 순간, 당신의 오늘 고민에도 따뜻한 답장이 도착할지 모릅니다.',
    },
  },
  {
    id: 'curated-contradiction',
    title: '모순',
    author: '양귀자',
    genre: '한국 현대 소설',
    dungeonName: '이모와 엄마, 두 갈래의 인생 회랑',
    dungeonRank: 'Lv.2 안개 숲',
    difficultyScore: 48,
    estimatedHours: 5,
    pages: 308,
    moodTags: ['성장', '인생 사색', '공감'],
    moodMatchReason:
      '삶의 선택 앞에서 정답을 몰라 막막하거나 청춘의 엇갈린 감정들을 가감 없이 들여다보고 싶은 날, 첫 문장부터 단숨에 사로잡힙니다.',
    stats: {
      immersion: 87,
      depth: 86,
      lexicon: 48,
      resonance: 91,
    },
    bossChallenge: {
      name: '이해할 수 없는 선택들의 역설',
      description: '합리성만으로는 재단할 수 없는 사랑과 인생의 모순적인 결들을 있는 그대로 끌어안는 시선이 필요합니다.',
    },
    recommendedBuff: '진한 카페라떼 + 조용한 저녁 창가 (성찰력 +20%)',
    coverTheme: 'solitude',
    relicReward: {
      name: '스물다섯의 빨간 수첩',
      iconType: 'feather',
      quote: '인생은 탐구하면서 살아가는 것이 아니라, 살아가면서 탐구하는 것이다.',
    },
    plotQuest: {
      prologue:
        '스물다섯 살 안진진은 일란성 쌍둥이이지만 정반대의 삶을 산 어머니와 이모 사이에서, 전혀 다른 매력의 두 남자를 동시에 마주하게 됩니다.',
      stages: [
        {
          prompt: '고달프지만 생의 활력이 넘치는 엄마의 삶과, 우아하지만 어딘가 공허한 이모의 삶. 당신은 어떤 시선으로 두 사람을 바라보겠습니까?',
          choiceA: {
            label: '아무 일 없는 평온함 뒤에 숨어 있는 이모의 고독한 그림자를 살핀다',
            outcome:
              '행복의 겉모습과 내면의 온도 차를 깨달으며 인생을 바라보는 눈이 한층 깊어집니다.',
            resonanceDelta: 24,
          },
          choiceB: {
            label: '고단해도 살아있음을 부딪치며 버텨내는 엄마의 생명력에 귀 기울인다',
            outcome:
              '상처와 결핍조차 사람을 살게 하는 역설적인 힘이라는 진실이 가슴에 묵직하게 닿습니다.',
            resonanceDelta: 25,
          },
        },
        {
          prompt: '안정적인 미래를 약속하는 나영규와, 이유 없이 마음이 흔들리는 김장우가 동시에 당신 앞에 서 있습니다.',
          choiceA: {
            label: '예측 가능한 삶의 질서 대신 이해할 수 없는 감정의 파동을 응시한다',
            outcome:
              '합리적인 계산을 비껴가는 마음의 움직임 속에서 진짜 자기 자신의 모습을 마주합니다.',
            resonanceDelta: 26,
          },
          choiceB: {
            label: '두 선택 모두에 숨어 있는 위험과 모순을 담담하게 노트에 적는다',
            outcome:
              '타인의 시선이 아닌 스스로의 기준으로 내일의 문을 여는 단단한 결심이 자라납니다.',
            resonanceDelta: 23,
          },
        },
      ],
      climaxHook:
        '“사람들에게는 그들만의 모순이 있다.” 마지막 장을 덮는 순간 한 편의 짙은 영화를 본 듯한 여운이 오래도록 남습니다.',
    },
  },
  {
    id: 'curated-alchemist',
    title: '연금술사',
    author: '파울로 코엘료',
    genre: '모험 철학 우화',
    dungeonName: '이집트 피라미드로 향하는 황금 사막',
    dungeonRank: 'Lv.1 산책로',
    difficultyScore: 32,
    estimatedHours: 4,
    pages: 252,
    moodTags: ['여행', '희망', '모험'],
    moodMatchReason:
      '반복되는 일상에 지쳐 어딘가로 훌쩍 떠나고 싶거나, 잊고 있던 내 마음의 나침반을 다시 확인하고 싶을 때 가볍지만 깊이 있는 응원을 건넵니다.',
    stats: {
      immersion: 85,
      depth: 78,
      lexicon: 34,
      resonance: 86,
    },
    bossChallenge: {
      name: '안주하려는 마음과 실패의 두려움',
      description: '안정된 양치기 생활을 뒤로하고 사막의 모래바람 속으로 발을 내딛는 용기가 가장 큰 관문입니다.',
    },
    recommendedBuff: '상쾌한 바람 + 여행 플레이리스트 (모험심 +25%)',
    coverTheme: 'dream',
    relicReward: {
      name: '우림과 툼밈의 두 돌',
      iconType: 'compass',
      quote: '무언가를 간절히 원할 때 온 우주는 자네의 소망이 실현되도록 도와준다네.',
    },
    plotQuest: {
      prologue:
        '안달루시아의 젊은 양치기 산티아고는 이집트 피라미드 부근에 보물이 숨겨져 있다는 꿈을 두 번이나 꾼 뒤, 늙은 왕의 조언을 따라 낯선 사막으로 향합니다.',
      stages: [
        {
          prompt: '타리파 항구에서 전 재산을 사기당해 낯선 이방인이 된 순간, 어떻게 하겠습니까?',
          choiceA: {
            label: '크리스탈 가게에서 일하며 다시 사막을 건널 여비와 표식을 모은다',
            outcome:
              '돌아가는 듯 보였던 시간 속에서 세상의 언어를 읽는 인내와 지혜가 단단하게 쌓여갑니다.',
            resonanceDelta: 23,
          },
          choiceB: {
            label: '사막을 건너는 대상단에 합류해 오아시스의 바람 소리에 귀를 기울인다',
            outcome:
              '모래언덕 너머로 반짝이는 별빛 아래, 두려움을 넘어서는 여행자의 시야가 활짝 열립니다.',
            resonanceDelta: 24,
          },
        },
        {
          prompt: '오아시스에서 운명적인 만남을 마주한 산티아고에게 연금술사가 "자네의 자아의 신화를 끝까지 걸어가라"고 말합니다.',
          choiceA: {
            label: '사랑하는 마음이 발목을 잡지 않고 오히려 날개가 됨을 믿고 나아간다',
            outcome:
              '모래바람 속에서 만물의 영혼과 대화하는 경이로운 순간이 당신의 걸음을 이끕니다.',
            resonanceDelta: 26,
          },
          choiceB: {
            label: '잠시 멈춰 서서 지금껏 걸어온 발자국 자체가 이미 보물이 아녔는지 묻는다',
            outcome:
              '여정의 끝에서 마주할 놀라운 반전을 향해 마음이 서서히 뜨거워집니다.',
            resonanceDelta: 23,
          },
        },
      ],
      climaxHook:
        '먼 사막을 건너온 소년이 마침내 보물의 자리에서 깨닫게 된 진실은 무엇이었을까요? 오늘의 작은 출발선이 펼쳐집니다.',
    },
  },
  {
    id: 'curated-siddhartha',
    title: '싯다르타',
    author: '헤르만 헤세',
    genre: '명상 철학 소설',
    dungeonName: '모든 목소리가 겹쳐 흐르는 강가',
    dungeonRank: 'Lv.3 심해 유적',
    difficultyScore: 62,
    estimatedHours: 5,
    pages: 216,
    moodTags: ['고요함', '명상', '내면의 평화'],
    moodMatchReason:
      '마음속 소음이 너무 크고 조급함이 밀려올 때, 도도히 흐르는 강물처럼 삶의 모든 순간을 고요히 바라보는 법을 일깨워 줍니다.',
    stats: {
      immersion: 72,
      depth: 95,
      lexicon: 64,
      resonance: 90,
    },
    bossChallenge: {
      name: '탐욕과 집착의 세속 윤회',
      description: '지식도 부유함도 아닌, 오직 직접 부딪혀 겪어낸 상처 끝에서만 들려오는 강물의 소리를 기다려야 합니다.',
    },
    recommendedBuff: '따뜻한 녹차 + 장작 타는 소리 (평온함 +28%)',
    coverTheme: 'solitude',
    relicReward: {
      name: '뱃사공 바주데바의 노',
      iconType: 'hourglass',
      quote: '시간이란 존재하지 않는다. 강물은 언제나 모든 곳에 동시에 존재한다.',
    },
    plotQuest: {
      prologue:
        '총명한 바라문의 아들 싯다르타는 경전의 가르침만으로는 진정한 평화에 닿을 수 없음을 깨닫고, 친구 고빈다와 함께 모든 것을 버린 채 길 위로 나섭니다.',
      stages: [
        {
          prompt: '유명한 스승의 설법을 들은 뒤에도 싯다르타는 "누구에게도 구원을 배울 수 없다"며 홀로 떠나려 합니다.',
          choiceA: {
            label: '스승의 그림자에서 벗어나 나만의 감각으로 세상을 직접 겪어보기로 한다',
            outcome:
              '머리로 아는 지식이 아니라 피부로 부딪히는 살아있는 삶의 호흡이 비로소 시작됩니다.',
            resonanceDelta: 24,
          },
          choiceB: {
            label: '도시로 내려가 부와 사랑이라는 세속의 세계 한복판으로 걸어 들어간다',
            outcome:
              '화려함 뒤에 찾아오는 공허함마저 깨달음을 위한 필연적인 통과 의례가 됩니다.',
            resonanceDelta: 22,
          },
        },
        {
          prompt: '세월이 흘러 지친 몸으로 다시 강가에 선 당신에게 늙은 뱃사공이 말없이 물결을 가리킵니다.',
          choiceA: {
            label: '아무 판단 없이 흐르는 물의 수많은 목소리를 가만히 경청한다',
            outcome:
              '기쁨과 슬픔, 과거와 미래가 하나의 잔잔한 화음으로 합쳐지는 신비로운 고요가 찾아옵니다.',
            resonanceDelta: 28,
          },
          choiceB: {
            label: '물 위에 비친 자신의 주름진 얼굴에서 아버지와 아들의 얼굴을 겹쳐 본다',
            outcome:
              '모든 고통과 방황을 따뜻하게 감싸 안는 깊은 연민의 빛이 조용히 번져갑니다.',
            resonanceDelta: 26,
          },
        },
      ],
      climaxHook:
        '바닥 없는 방황 끝에 강물 앞에서 비로소 미소 짓게 된 싯다르타—지친 마음을 물처럼 씻어내리는 가장 아름다운 명상록입니다.',
    },
  },
  {
    id: 'curated-pachinko',
    title: '파친코',
    author: '이민진',
    genre: '역사 대서사시',
    dungeonName: '현해탄을 건넌 사대의 바다',
    dungeonRank: 'Lv.3 심해 유적',
    difficultyScore: 64,
    estimatedHours: 14,
    pages: 720,
    moodTags: ['대서사', '가족', '강인한 생명력'],
    moodMatchReason:
      '잠깐의 기분 전환보다 한 시대를 관통하는 거대한 서사에 푹 빠져, 모진 풍파 속에서도 꺾이지 않는 삶의 강인함을 느끼고 싶을 때 압도적인 몰입을 줍니다.',
    stats: {
      immersion: 92,
      depth: 88,
      lexicon: 52,
      resonance: 96,
    },
    bossChallenge: {
      name: '4대에 걸친 역사의 거센 파도',
      description: '묵직한 분량과 시대의 비극 앞에서도 하루하루를 성실히 살아내는 인물들의 숨결을 끝까지 따라가는 여정입니다.',
    },
    recommendedBuff: '넉넉한 주말 오후 + 따뜻한 보리차 (서사 지구력 +25%)',
    coverTheme: 'labyrinth',
    relicReward: {
      name: '영도 하숙집의 백자 쌀항아리',
      iconType: 'lantern',
      quote: '역사가 우리를 망쳐놨지만 그래도 상관없다.',
    },
    plotQuest: {
      prologue:
        '20세기 초 부산 영도 바닷가, 가난하지만 단단한 하숙집 딸 선자는 낯선 이방인 한수를 만나면서 자신과 후손의 운명을 송두리째 바꾸는 거친 파도 속으로 걸어 들어갑니다.',
      stages: [
        {
          prompt: '고향을 떠나 낯선 오사카의 땅을 밟아야 하는 기로에 섰습니다. 무엇을 붙잡고 버텨내겠습니까?',
          choiceA: {
            label: '비바람이 몰아쳐도 가족에게 따뜻한 밥 한 끼를 지어 올리는 성실함',
            outcome:
              '거창한 영웅담보다 강한 평범한 사람들의 존엄이 페이지마다 묵직하게 빛납니다.',
            resonanceDelta: 26,
          },
          choiceB: {
            label: '차별과 가난의 한복판에서도 다음 세대의 미래만큼은 지켜내려는 결의',
            outcome:
              '세대에서 세대로 이어지는 사랑과 희생의 맥박이 가슴 깊숙이 울려 퍼집니다.',
            resonanceDelta: 25,
          },
        },
        {
          prompt: '어지럽게 튕기는 파친코 구슬처럼 예측할 수 없는 운명 앞에서, 인물은 삶의 선택을 내려야 합니다.',
          choiceA: {
            label: '시대가 강요한 낙인을 거부하고 스스로의 이름과 자존을 세운다',
            outcome:
              '비극을 이겨내는 인간 본연의 단단한 힘이 거대한 파도처럼 밀려옵니다.',
            resonanceDelta: 27,
          },
          choiceB: {
            label: '서로 다른 상처를 품은 가족들의 진심이 엇갈리고 만나는 순간을 응시한다',
            outcome:
              '수백 페이지가 순식간에 넘어가는 압도적인 가독성과 벅찬 여운을 경험합니다.',
            resonanceDelta: 24,
          },
        },
      ],
      climaxHook:
        '700쪽이 넘는 분량조차 아쉽게 느껴질 만큼 숨 쉴 틈 없이 펼쳐지는 네 세대의 대서사시—지금 영도 바닷가의 문을 열어보세요.',
    },
  },
  {
    id: 'curated-crime-and-punishment',
    title: '죄와 벌',
    author: '표도르 도스토옙스키',
    genre: '심리 추리 고전',
    dungeonName: '상트페테르부르크의 열병 앓는 다락방',
    dungeonRank: 'Lv.4 바벨의 탑',
    difficultyScore: 93,
    estimatedHours: 16,
    pages: 780,
    moodTags: ['치열한 사유', '심리 스릴러', '묵직함'],
    moodMatchReason:
      '안이한 위로를 넘어 인간 내면의 가장 어두운 심연과 구원의 가능성을 끝까지 파고드는 압도적인 지적·심리적 대결을 원할 때 도전할 가치가 있는 거대한 봉우리입니다.',
    stats: {
      immersion: 84,
      depth: 99,
      lexicon: 86,
      resonance: 94,
    },
    bossChallenge: {
      name: '예심 판사 포르피리와의 숨 막히는 심리전',
      description: '초인 사상의 오만과 흔들리는 양심 사이에서 라스콜니코프가 겪는 극한의 열병을 함께 견뎌내야 합니다.',
    },
    recommendedBuff: '진한 홍차 + 밤새 집중할 수 있는 조용한 서재 (지적 몰입 +30%)',
    coverTheme: 'labyrinth',
    relicReward: {
      name: '다락방 문틈의 구리 십자가',
      iconType: 'key',
      quote: '고통과 괴로움은 크나큰 자의식과 깊은 마음을 지닌 인간에게 언제나 필연적이다.',
    },
    plotQuest: {
      prologue:
        '무더운 여름 상트페테르부르크의 관처럼 좁은 다락방, 가난한 법학도 라스콜니코프는 "비범한 인간은 도덕을 넘을 수 있다"는 위험한 이론에 사로잡혀 돌이킬 수 없는 문턱에 섭니다.',
      stages: [
        {
          prompt: '사건 이후 극도의 열병과 편집증에 시달리던 당신 앞에, 날카로운 눈빛의 예심 판사 포르피리가 미소 지으며 말을 걸어옵니다.',
          choiceA: {
            label: '논리와 지적 오만으로 판사의 유도 심문을 한 치의 빈틈없이 방어한다',
            outcome:
              '숨 막히는 두뇌 싸움이 시작되지만, 내면의 균열 소리는 오히려 더 크게 들려옵니다.',
            resonanceDelta: 25,
          },
          choiceB: {
            label: '가장 낮은 자리에서 순수한 연민으로 손을 내미는 소냐의 눈빛을 마주한다',
            outcome:
              '차가운 이성의 탑이 조금씩 흔들리며 인간적인 떨림이 마음 깊은 곳을 두드립니다.',
            resonanceDelta: 27,
          },
        },
        {
          prompt: '비밀을 지켜낼 것인가, 아니면 스스로 무너진 양심 앞에 무릎을 꿇을 것인가—최후의 기로가 다가옵니다.',
          choiceA: {
            label: '모든 논리를 내려놓고 진실의 무게를 정면으로 받아들인다',
            outcome:
              '광기와 죄책감의 긴 터널 끝에 서늘하면서도 눈부신 재생의 새벽빛이 비칩니다.',
            resonanceDelta: 28,
          },
          choiceB: {
            label: '인간이 왜 스스로를 속이고 또 용서받으려 하는지 끝까지 응시한다',
            outcome:
              '문학사상 가장 정교하고 강렬한 심리 드라마가 머릿속에 깊은 각인을 남깁니다.',
            resonanceDelta: 26,
          },
        },
      ],
      climaxHook:
        '죄를 지은 자가 스스로에게 내리는 가장 잔인한 벌, 그리고 그 너머에서 기다리는 뜻밖의 구원—고전의 거대한 심연으로 들어가 보세요.',
    },
  },
];

export interface StaticMatchOptions {
  customNote?: string;
  presetLabel?: string;
  excludeTitles?: string[];
}

const KEYWORD_CLUSTERS: { triggers: string[]; matches: string[] }[] = [
  {
    triggers: ['비', '우울', '쓸쓸', '슬픔', '눈물', '외로', '상실', '서늘'],
    matches: ['비 오는 밤', '쓸쓸함', '정교한 문장', '그리움', '감정 파동', '위로'],
  },
  {
    triggers: ['위로', '지침', '피곤', '피로', '번아웃', '휴식', '잠', '밤', '따뜻', '힐링', '쉬고'],
    matches: ['위로', '따뜻함', '따뜻한 위로', '휴식', '여유 회복', '몽환', '번아웃'],
  },
  {
    triggers: ['sf', '우주', '미래', '과학', '상상', '환상', '미궁', '판타지'],
    matches: ['서정 sf', '환상', '미궁', '몽환', '불가사의', '판타지', '힐링 판타지'],
  },
  {
    triggers: ['추리', '미스터리', '긴장', '스릴러', '사건', '범인'],
    matches: ['미스터리', '긴장감', '심리 스릴러', '몰입', '추리'],
  },
  {
    triggers: ['철학', '사색', '고민', '인생', '방황', '명상', '본질', '성장', '청춘'],
    matches: ['사색', '철학', '방황', '성장', '내면의 변화', '명상', '인생 사색', '성찰'],
  },
  {
    triggers: ['모험', '여행', '떠나', '바다', '자유', '도전', '결의'],
    matches: ['모험', '여행', '희망', '투지', '조용한 결의'],
  },
  {
    triggers: ['가볍', '웃음', '유쾌', '편안', '짧', '술술'],
    matches: ['가벼운 웃음', '빠른 몰입', '일상 힐링'],
  },
  {
    triggers: ['묵직', '대서사', '고전', '깊이', '역사', '지적'],
    matches: ['지적 자극', '치열한 사유', '대서사', '묵직함', '지적 각성', '고전'],
  },
];

export function getMoodMatchedCuratedQuests(
  energy: number,
  warmth: number,
  stamina: ReadingStamina,
  count = 3,
  options: StaticMatchOptions = {}
): BookQuest[] {
  const targetDifficulty =
    stamina === 'light' ? 30 : stamina === 'balanced' ? 54 : 82;

  const noteLower = (options.customNote ?? '').trim().toLowerCase();
  const presetLower = (options.presetLabel ?? '').trim().toLowerCase();
  const excludeSet = new Set(
    (options.excludeTitles ?? []).map((t) => t.trim().toLowerCase()).filter(Boolean)
  );

  // Extract semantic boosts from user's note & preset
  const semanticTokens: string[] = [];
  if (noteLower) {
    semanticTokens.push(
      ...noteLower
        .split(/[\s,./!?"'()]+/)
        .map((w) => w.trim())
        .filter((w) => w.length >= 2)
    );
    for (const cluster of KEYWORD_CLUSTERS) {
      if (cluster.triggers.some((trig) => noteLower.includes(trig))) {
        semanticTokens.push(...cluster.matches);
      }
    }
  }
  if (presetLower) {
    for (const cluster of KEYWORD_CLUSTERS) {
      if (cluster.triggers.some((trig) => presetLower.includes(trig))) {
        semanticTokens.push(...cluster.matches);
      }
    }
  }

  const scored = CURATED_QUESTS.map((q) => {
    const warmthScore = 100 - Math.abs(warmth - q.stats.resonance);
    const energyScore = 100 - Math.abs(energy - q.stats.immersion);
    const diffScore = 100 - Math.abs(targetDifficulty - q.difficultyScore);
    let total = warmthScore * 0.38 + energyScore * 0.34 + diffScore * 0.28;

    if (semanticTokens.length > 0) {
      const searchable = `${q.title} ${q.author} ${q.genre} ${q.moodTags.join(' ')} ${q.moodMatchReason}`.toLowerCase();
      let keywordHits = 0;
      for (const token of semanticTokens) {
        if (searchable.includes(token.toLowerCase())) {
          keywordHits += 1;
        }
      }
      total += Math.min(28, keywordHits * 7);
    }

    return { quest: q, score: total };
  });

  scored.sort((a, b) => b.score - a.score);

  const nonExcluded = scored
    .filter((entry) => !excludeSet.has(entry.quest.title.trim().toLowerCase()))
    .map((entry) => entry.quest);

  if (nonExcluded.length >= count) {
    return nonExcluded.slice(0, count);
  }

  const fallbackPool = scored
    .filter((entry) => !nonExcluded.some((picked) => picked.id === entry.quest.id))
    .map((entry) => entry.quest);

  return [...nonExcluded, ...fallbackPool].slice(0, count);
}

export function buildStaticMoodSummary(params: {
  presetLabel: string;
  energy: number;
  warmth: number;
  stamina: ReadingStamina;
  customNote: string;
}): string {
  const note = params.customNote.trim();
  const tone =
    params.warmth >= 70
      ? '다정한 온기와 위로가 스며드는'
      : params.warmth <= 35
        ? '서늘하고 또렷한 사유가 살아있는'
        : '감정과 사색의 균형이 잘 잡힌';
  const pace =
    params.stamina === 'light'
      ? '부담 없이 펼칠 수 있는'
      : params.stamina === 'epic'
        ? '깊이 몰입해 도전할 만한'
        : '호흡을 따라 천천히 빠져드는';

  if (note) {
    return `“${note}”의 결에 맞춰 ${tone} ${pace} 문학 퀘스트 3장을 꺼냈습니다.`;
  }
  return `「${params.presetLabel}」 상태에 맞춰 ${tone} ${pace} 퀘스트 3장을 봉인에서 꺼냈습니다.`;
}


