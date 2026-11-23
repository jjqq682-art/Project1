export type DungeonRank =
  | 'Lv.1 산책로'
  | 'Lv.2 안개 숲'
  | 'Lv.3 심해 유적'
  | 'Lv.4 바벨의 탑';

export type CoverTheme = 'dream' | 'solitude' | 'labyrinth';

export type RelicIconType =
  | 'lantern'
  | 'compass'
  | 'key'
  | 'hourglass'
  | 'feather'
  | 'moon';

export interface QuestStats {
  immersion: number; // 몰입도 (페이지 넘어가는 속도)
  depth: number; // 사유력 (철학적/심리적 깊이)
  lexicon: number; // 어휘력 (문장의 밀도와 난해함)
  resonance: number; // 감정 파동 (여운과 정서적 타격)
}

export interface PlotChoice {
  label: string;
  outcome: string;
  resonanceDelta: number;
}

export interface PlotStage {
  prompt: string;
  choiceA: PlotChoice;
  choiceB: PlotChoice;
}

export interface BookQuest {
  id: string;
  title: string;
  author: string;
  genre: string;
  dungeonName: string;
  dungeonRank: DungeonRank;
  difficultyScore: number;
  estimatedHours: number;
  pages: number;
  moodTags: string[];
  moodMatchReason: string;
  stats: QuestStats;
  bossChallenge: {
    name: string;
    description: string;
  };
  recommendedBuff: string;
  coverTheme: CoverTheme;
  relicReward: {
    name: string;
    iconType: RelicIconType;
    quote: string;
  };
  plotQuest: {
    prologue: string;
    stages: [PlotStage, PlotStage];
    climaxHook: string;
  };
  isAiGenerated?: boolean;
}

export type ReadingStamina = 'light' | 'balanced' | 'epic';

export interface MoodProfile {
  presetId: string;
  presetLabel: string;
  energy: number; // 0 (고요함) - 100 (역동적)
  warmth: number; // 0 (서늘/사색적) - 100 (따뜻/위로)
  stamina: ReadingStamina;
  customNote: string;
}

export interface AcceptedQuest {
  quest: BookQuest;
  acceptedAt: number;
  bossHp: number; // 100 down to 0
  readingSessions: number;
  checkpoints: {
    act1: boolean;
    midBoss: boolean;
    cleared: boolean;
  };
  plotPreviewCompleted: boolean;
  journalNote: string;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  xpReward: number;
}

export interface PlayerProgress {
  xp: number;
  soundEnabled: boolean;
  completedPreviewIds: string[];
  acceptedQuests: AcceptedQuest[];
  unlockedAchievements: string[];
  aiRequestCount: number;
  diceRollCount: number;
  focusSessionsCompleted: number;
}

export type ActiveTab = 'tuner' | 'catalog' | 'deck' | 'vault';
