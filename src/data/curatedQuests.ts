import { BookQuest, CoverTheme, ReadingStamina } from '../types/quest';

export const HERO_TABLETOP_IMAGE =
  '/src/assets/images/tabletop_hero_atlas_1795398029030.jpg';

export const COVER_IMAGES: Record<CoverTheme, string> = {
  dream: '/src/assets/images/quest_cover_dream_1795398029205.jpg',
  solitude: '/src/assets/images/quest_cover_solitude_1795398030776.jpg',
  labyrinth: '/src/assets/images/quest_cover_labyrinth_1795398029689.jpg',
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
    description: 'AI 기분 맞춤 북퀘스트를 1회 이상 의뢰했습니다.',
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
];
