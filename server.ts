import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const choiceSchema = {
  type: Type.OBJECT,
  properties: {
    label: { type: Type.STRING, description: '간결한 선택지 (25자 이내)' },
    outcome: { type: Type.STRING, description: '선택에 따른 전개 (1~2문장, 스포일러 금지)' },
    resonanceDelta: { type: Type.INTEGER, description: '15~28 사이 정수' },
  },
  required: ['label', 'outcome', 'resonanceDelta'],
};

const questResponseSchema = {
  type: Type.OBJECT,
  properties: {
    moodSummary: {
      type: Type.STRING,
      description: '사용자 기분에 공감하는 짧은 1문장.',
    },
    quests: {
      type: Type.ARRAY,
      description: '기분에 맞는 실제 출간 도서 3권 배열.',
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: '실제 출간 도서 한국어 제목' },
          author: { type: Type.STRING, description: '저자 이름' },
          genre: { type: Type.STRING, description: '장르 (예: 서정 SF, 현대 소설)' },
          dungeonName: { type: Type.STRING, description: '책의 세계관을 빗댄 던전 이름 (15자 이내)' },
          dungeonRank: {
            type: Type.STRING,
            description: '"Lv.1 산책로", "Lv.2 안개 숲", "Lv.3 심해 유적", "Lv.4 바벨의 탑" 중 택1',
          },
          difficultyScore: { type: Type.INTEGER, description: '1~100 정수' },
          estimatedHours: { type: Type.INTEGER, description: '예상 완독 시간(시간)' },
          pages: { type: Type.INTEGER, description: '페이지 수' },
          moodTags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: '기분 키워드 2개',
          },
          moodMatchReason: {
            type: Type.STRING,
            description: '지금 기분에 어울리는 이유 (간결한 1~2문장)',
          },
          stats: {
            type: Type.OBJECT,
            properties: {
              immersion: { type: Type.INTEGER, description: '몰입도 1~100' },
              depth: { type: Type.INTEGER, description: '사유력 1~100' },
              lexicon: { type: Type.INTEGER, description: '어휘력 1~100' },
              resonance: { type: Type.INTEGER, description: '감정 파동 1~100' },
            },
            required: ['immersion', 'depth', 'lexicon', 'resonance'],
          },
          bossChallenge: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: '핵심 갈등 보스 이름 (15자 이내)' },
              description: { type: Type.STRING, description: '독서 허들 설명 (1문장)' },
            },
            required: ['name', 'description'],
          },
          recommendedBuff: {
            type: Type.STRING,
            description: '추천 독서 환경 버프 (예: 따뜻한 홍차 + 빗소리: 집중력 +15%)',
          },
          coverTheme: {
            type: Type.STRING,
            description: '"dream", "solitude", "labyrinth" 중 택1',
          },
          relicReward: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: '책갈피 아티팩트 이름' },
              iconType: {
                type: Type.STRING,
                description: '"lantern", "compass", "key", "hourglass", "feather", "moon" 중 택1',
              },
              quote: { type: Type.STRING, description: '인상적인 짧은 문구 1문장' },
            },
            required: ['name', 'iconType', 'quote'],
          },
          plotQuest: {
            type: Type.OBJECT,
            properties: {
              prologue: { type: Type.STRING, description: '도입부 상황 묘사 (2문장, 스포일러 금지)' },
              stages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    prompt: { type: Type.STRING, description: '초반 갈등 질문 (1문장)' },
                    choiceA: choiceSchema,
                    choiceB: choiceSchema,
                  },
                  required: ['prompt', 'choiceA', 'choiceB'],
                },
              },
              climaxHook: {
                type: Type.STRING,
                description: '책을 펼치고 싶게 만드는 스포일러 없는 훅 (1~2문장)',
              },
            },
            required: ['prologue', 'stages', 'climaxHook'],
          },
        },
        required: [
          'title',
          'author',
          'genre',
          'dungeonName',
          'dungeonRank',
          'difficultyScore',
          'estimatedHours',
          'pages',
          'moodTags',
          'moodMatchReason',
          'stats',
          'bossChallenge',
          'recommendedBuff',
          'coverTheme',
          'relicReward',
          'plotQuest',
        ],
      },
    },
  },
  required: ['moodSummary', 'quests'],
};

function cleanJsonText(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('```')) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();
  }
  return trimmed;
}

function clampStat(val: unknown, fallback = 65): number {
  const n = Number(val);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(100, Math.round(n)));
}

function sanitizeQuest(q: Record<string, unknown>, idx: number) {
  const validRanks = new Set([
    'Lv.1 산책로',
    'Lv.2 안개 숲',
    'Lv.3 심해 유적',
    'Lv.4 바벨의 탑',
  ]);
  const validCovers = new Set(['dream', 'solitude', 'labyrinth']);
  const validIcons = new Set(['lantern', 'compass', 'key', 'hourglass', 'feather', 'moon']);

  const rawStats = (q.stats as Record<string, unknown>) ?? {};
  const rawBoss = (q.bossChallenge as Record<string, unknown>) ?? {};
  const rawRelic = (q.relicReward as Record<string, unknown>) ?? {};
  const rawPlot = (q.plotQuest as Record<string, unknown>) ?? {};
  const rawStages = Array.isArray(rawPlot.stages) ? rawPlot.stages : [];

  const sanitizeChoice = (
    c: unknown,
    fallbackLabel: string,
    fallbackOutcome: string
  ) => {
    const obj = (c as Record<string, unknown>) ?? {};
    return {
      label: String(obj.label || fallbackLabel),
      outcome: String(obj.outcome || fallbackOutcome),
      resonanceDelta: Math.max(10, Math.min(30, Math.round(Number(obj.resonanceDelta) || 20))),
    };
  };

  const sanitizeStage = (s: unknown, index: number) => {
    const obj = (s as Record<string, unknown>) ?? {};
    const defaultPrompt =
      index === 0
        ? '이야기의 첫 장에서 인물은 낯선 선택 앞에 섭니다. 당신이라면 어떻게 하겠습니까?'
        : '예상치 못한 갈림길이 나타났습니다. 어느 방향으로 발길을 옮기겠습니까?';
    return {
      prompt: String(obj.prompt || defaultPrompt),
      choiceA: sanitizeChoice(
        obj.choiceA,
        '인물의 내면과 감정의 결을 따라간다',
        '조용한 사유 속에서 숨겨진 진실의 단서가 서서히 윤곽을 드러냅니다.'
      ),
      choiceB: sanitizeChoice(
        obj.choiceB,
        '사건의 단서와 바깥 풍경을 먼저 짚어본다',
        '세계를 둘러싼 긴장감이 또렷해지며 다음 장에 대한 궁금증이 커집니다.'
      ),
    };
  };

  return {
    id: `ai-${Date.now()}-${idx}`,
    title: String(q.title || '이름 없는 서재'),
    author: String(q.author || '작자 미상'),
    genre: String(q.genre || '현대 문학'),
    dungeonName: String(q.dungeonName || '기억의 작은 방'),
    dungeonRank: validRanks.has(String(q.dungeonRank))
      ? String(q.dungeonRank)
      : 'Lv.2 안개 숲',
    difficultyScore: clampStat(q.difficultyScore, 45),
    estimatedHours: Math.max(1, Math.round(Number(q.estimatedHours) || 5)),
    pages: Math.max(80, Math.round(Number(q.pages) || 260)),
    moodTags: Array.isArray(q.moodTags)
      ? q.moodTags.slice(0, 3).map(String)
      : ['사색', '여운'],
    moodMatchReason: String(
      q.moodMatchReason || '지금 당신의 감정선과 조용히 공명하는 작품입니다.'
    ),
    stats: {
      immersion: clampStat(rawStats.immersion, 75),
      depth: clampStat(rawStats.depth, 75),
      lexicon: clampStat(rawStats.lexicon, 55),
      resonance: clampStat(rawStats.resonance, 80),
    },
    bossChallenge: {
      name: String(rawBoss.name || '내면의 망설임'),
      description: String(
        rawBoss.description || '이야기 속 인물의 딜레마를 함께 통과하는 과정입니다.'
      ),
    },
    recommendedBuff: String(
      q.recommendedBuff || '따뜻한 차 한 잔 + 조용한 조명: 몰입감 +15%'
    ),
    coverTheme: validCovers.has(String(q.coverTheme))
      ? String(q.coverTheme)
      : 'dream',
    relicReward: {
      name: String(rawRelic.name || '황동 책갈피'),
      iconType: validIcons.has(String(rawRelic.iconType))
        ? String(rawRelic.iconType)
        : 'lantern',
      quote: String(
        rawRelic.quote || '한 권의 책은 지금의 나를 비추는 가장 고요한 거울이다.'
      ),
    },
    plotQuest: {
      prologue: String(
        rawPlot.prologue ||
          '조용한 서재의 첫 페이지를 여는 순간, 낯설지만 오래 기다려온 이야기가 시작됩니다.'
      ),
      stages: [sanitizeStage(rawStages[0], 0), sanitizeStage(rawStages[1], 1)],
      climaxHook: String(
        rawPlot.climaxHook ||
          '이 짧은 만남 뒤에 이어질 진짜 이야기는 책의 첫 장에서 당신을 기다리고 있습니다.'
      ),
    },
    isAiGenerated: true,
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/download-github-zip', (_req, res) => {
  const zipPath = path.resolve(__dirname, 'bookquest-github.zip');
  if (!fs.existsSync(zipPath)) {
    res.status(404).json({ error: 'ZIP 파일을 찾을 수 없습니다.' });
    return;
  }
  res.download(zipPath, 'bookquest-github.zip');
});

app.post('/api/recommend', async (req, res) => {
  const ai = getGeminiClient();
  if (!ai) {
    res.status(503).json({
      error:
        'GEMINI_API_KEY가 설정되어 있지 않습니다. Settings > Secrets 패널에서 API 키를 확인한 뒤 다시 시도해 주세요.',
    });
    return;
  }

  try {
    const {
      presetLabel = '고요한 사색',
      energy = 45,
      warmth = 60,
      stamina = 'balanced',
      customNote = '',
      excludeTitles = [],
    } = req.body ?? {};

    const staminaGuide =
      stamina === 'light'
        ? '가벼운 산책 (Lv.1~2, 술술 읽히는 책)'
        : stamina === 'epic'
          ? '대서사시 정복 (Lv.3~4, 깊이 있고 묵직한 책)'
          : '균형 잡힌 탐험 (Lv.1~3 조화)';

    const prompt = [
      `기분 프리셋: ${presetLabel}`,
      `마음 에너지: ${energy}/100, 감정 온도: ${warmth}/100`,
      `독서 체력: ${staminaGuide}`,
      customNote ? `사용자 메모: "${customNote}"` : '',
      Array.isArray(excludeTitles) && excludeTitles.length > 0
        ? `제외할 책: ${excludeTitles.join(', ')}`
        : '',
      '실제 출간된 유명 도서 3권을 추천하세요. 각 텍스트 필드는 간결하고 시적으로(1~2문장) 작성하며 plotQuest.stages는 정확히 2개, 결말 스포일러는 금지합니다.',
    ]
      .filter(Boolean)
      .join('\n');

    const callModel = async (modelName: 'gemini-3.1-flash-lite' | 'gemini-4-hydrogen') => {
      const thinkingLevel =
        modelName === 'gemini-3.1-flash-lite'
          ? ThinkingLevel.MINIMAL
          : ThinkingLevel.LOW;

      return ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction:
            '당신은 "북퀘스트" 서재의 문학 큐레이터입니다. 실제 존재하는 훌륭한 도서 3권을 선정해 간결하고 밀도 있는 한국어 RPG 퀘스트 JSON으로 반환하세요.',
          thinkingConfig: { thinkingLevel },
          responseMimeType: 'application/json',
          responseSchema: questResponseSchema,
        },
      });
    };

    let response;
    try {
      // Use fast low-latency model first so card drawing feels snappy (<10s)
      response = await callModel('gemini-3.1-flash-lite');
    } catch (primaryErr) {
      console.warn('Primary model failed, falling back to gemini-4-hydrogen:', primaryErr);
      response = await callModel('gemini-4-hydrogen');
    }

    const rawText = cleanJsonText(response.text ?? '');
    if (!rawText) {
      res.status(502).json({ error: 'AI 응답이 비어 있습니다. 다시 시도해 주세요.' });
      return;
    }

    const parsed = JSON.parse(rawText) as {
      moodSummary?: string;
      quests?: Record<string, unknown>[];
    };

    const rawQuests = Array.isArray(parsed.quests) ? parsed.quests : [];
    if (rawQuests.length === 0) {
      res.status(502).json({ error: '추천 도서 목록을 생성하지 못했습니다. 다시 시도해 주세요.' });
      return;
    }

    const quests = rawQuests.slice(0, 3).map((q, idx) => sanitizeQuest(q, idx));

    res.json({
      moodSummary:
        parsed.moodSummary || '오늘의 기분에 맞춘 세 가지 문학 퀘스트가 도착했습니다.',
      quests,
    });
  } catch (err) {
    console.error('Gemini recommendation error:', err);
    const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    res.status(500).json({
      error: `퀘스트 생성 중 오류가 발생했습니다: ${message}`,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BookQuest server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
