import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Dices,
  Eye,
  Loader2,
  RefreshCw,
  Sparkles,
  Timer,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  AdventureDeckView,
  calcTimerDamage,
  calcTimerXp,
} from './components/AdventureDeckView';
import {
  EffectBurstOverlay,
  FloatingEffect,
  SparkParticleBurst,
} from './components/EffectBurst';
import { PlotQuestModal } from './components/PlotQuestModal';
import { QuestCard } from './components/QuestCard';
import {
  ACHIEVEMENTS,
  CURATED_QUESTS,
  HERO_TABLETOP_IMAGE,
  MOOD_PRESETS,
  getReaderRank,
} from './data/curatedQuests';
import {
  AcceptedQuest,
  ActiveTab,
  BookQuest,
  DungeonRank,
  MoodProfile,
  PlayerProgress,
  ReadingStamina,
} from './types/quest';
import { soundFx } from './utils/sound';

const STORAGE_KEY = 'bookquest_progress_v2';

const DEFAULT_PROGRESS: PlayerProgress = {
  xp: 0,
  soundEnabled: true,
  completedPreviewIds: [],
  acceptedQuests: [],
  unlockedAchievements: [],
  aiRequestCount: 0,
  diceRollCount: 0,
  focusSessionsCompleted: 0,
};

function loadProgress(): PlayerProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    return {
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      completedPreviewIds: Array.isArray(parsed.completedPreviewIds)
        ? parsed.completedPreviewIds
        : [],
      acceptedQuests: Array.isArray(parsed.acceptedQuests)
        ? parsed.acceptedQuests.map((aq) => ({
            ...aq,
            bossHp: typeof aq.bossHp === 'number' ? aq.bossHp : aq.checkpoints?.cleared ? 0 : 100,
            readingSessions: typeof aq.readingSessions === 'number' ? aq.readingSessions : 0,
          }))
        : [],
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements)
        ? parsed.unlockedAchievements
        : [],
      aiRequestCount: typeof parsed.aiRequestCount === 'number' ? parsed.aiRequestCount : 0,
      diceRollCount: typeof parsed.diceRollCount === 'number' ? parsed.diceRollCount : 0,
      focusSessionsCompleted:
        typeof parsed.focusSessionsCompleted === 'number' ? parsed.focusSessionsCompleted : 0,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

type CatalogSort = 'default' | 'diff-asc' | 'diff-desc' | 'immersion';

export default function App() {
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress);
  const [activeTab, setActiveTab] = useState<ActiveTab>('tuner');

  const [mood, setMood] = useState<MoodProfile>({
    presetId: MOOD_PRESETS[0].id,
    presetLabel: MOOD_PRESETS[0].label,
    energy: MOOD_PRESETS[0].energy,
    warmth: MOOD_PRESETS[0].warmth,
    stamina: MOOD_PRESETS[0].stamina,
    customNote: '',
  });

  const [aiQuests, setAiQuests] = useState<BookQuest[]>([]);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [moodSummary, setMoodSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRollingDice, setIsRollingDice] = useState<boolean>(false);
  const [diceBurstKey, setDiceBurstKey] = useState<number>(0);
  const [diceQuest, setDiceQuest] = useState<BookQuest | null>(null);

  const [rankFilter, setRankFilter] = useState<'전체' | DungeonRank>('전체');
  const [catalogSort, setCatalogSort] = useState<CatalogSort>('default');
  const [activeEncounterQuest, setActiveEncounterQuest] = useState<BookQuest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Floating RPG Effects queue
  const [floatingEffects, setFloatingEffects] = useState<FloatingEffect[]>([]);
  const effectIdRef = useRef(1);

  // Persistent Focus Reading Timer state (lives across tab switches)
  const [sprintMinutes, setSprintMinutes] = useState<number>(15);
  const [secondsLeft, setSecondsLeft] = useState<number>(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [ambientRain, setAmbientRain] = useState<boolean>(false);
  const [targetQuestId, setTargetQuestId] = useState<string>('');

  const resultsRef = useRef<HTMLElement | null>(null);
  const prevRankLevelRef = useRef<number>(getReaderRank(progress.xp).level);

  const pushFloatingEffect = useCallback(
    (label: string, tone: FloatingEffect['tone'] = 'xp') => {
      const id = effectIdRef.current++;
      setFloatingEffects((prev) => [...prev.slice(-3), { id, label, tone }]);
      window.setTimeout(() => {
        setFloatingEffects((prev) => prev.filter((item) => item.id !== id));
      }, 1200);
    },
    []
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota issues
    }
  }, [progress]);

  // Detect Rank Level-Up
  useEffect(() => {
    const currentRank = getReaderRank(progress.xp);
    if (currentRank.level > prevRankLevelRef.current) {
      soundFx.levelUp(progress.soundEnabled);
      pushFloatingEffect(
        `승급! Lv.${currentRank.level} ${currentRank.title}`,
        'victory'
      );
      setToastMessage(`등급 상승! Lv.${currentRank.level} ${currentRank.title}가 되었습니다`);
    }
    prevRankLevelRef.current = currentRank.level;
  }, [progress.xp, progress.soundEnabled, pushFloatingEffect]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  // Sync ambient rain cleanup
  useEffect(() => {
    if (ambientRain) {
      soundFx.startAmbientRain();
    } else {
      soundFx.stopAmbientRain();
    }
    return () => {
      soundFx.stopAmbientRain();
    };
  }, [ambientRain]);

  // Keep targetQuestId aligned with active accepted quests
  useEffect(() => {
    const active = progress.acceptedQuests.filter((q) => !q.checkpoints.cleared);
    if (targetQuestId && !active.some((q) => q.quest.id === targetQuestId)) {
      setTargetQuestId(active[0]?.quest.id ?? '');
    } else if (!targetQuestId && active.length > 0) {
      // Auto-select first active book if user hasn't picked one yet
      setTargetQuestId(active[0].quest.id);
    }
  }, [progress.acceptedQuests, targetQuestId]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const awardAchievement = useCallback(
    (achievementId: string) => {
      const def = ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (!def) return;
      setProgress((prev) => {
        if (prev.unlockedAchievements.includes(achievementId)) return prev;
        soundFx.questClear(prev.soundEnabled);
        pushFloatingEffect(`업적 해금 +${def.xpReward} XP`, 'victory');
        showToast(`업적 달성! 「${def.title}」 (+${def.xpReward} XP)`);
        return {
          ...prev,
          xp: prev.xp + def.xpReward,
          unlockedAchievements: [...prev.unlockedAchievements, achievementId],
        };
      });
    },
    [pushFloatingEffect, showToast]
  );

  const handleCompleteFocusSprint = useCallback(
    (elapsedRatio = 1) => {
      const ratio = Math.max(0.25, Math.min(1, elapsedRatio));
      const dmg = Math.max(5, Math.round(calcTimerDamage(sprintMinutes) * ratio));
      const earnedXp = Math.max(10, Math.round(calcTimerXp(sprintMinutes) * ratio));

      let targetTitle = '';
      let clearedRelic = '';

      setProgress((prev) => {
        const updated = targetQuestId
          ? prev.acceptedQuests.map((item) => {
              if (item.quest.id !== targetQuestId) return item;
              targetTitle = item.quest.title;
              const nextHp = Math.max(0, (item.bossHp ?? 100) - dmg);
              const act1 = item.checkpoints.act1 || nextHp <= 70;
              const midBoss = item.checkpoints.midBoss || nextHp <= 35;
              const cleared = item.checkpoints.cleared || nextHp === 0;
              if (cleared && !item.checkpoints.cleared) {
                clearedRelic = item.quest.relicReward.name;
              }
              return {
                ...item,
                bossHp: nextHp,
                readingSessions: (item.readingSessions ?? 0) + 1,
                checkpoints: { act1, midBoss, cleared },
              };
            })
          : prev.acceptedQuests;

        return {
          ...prev,
          xp: prev.xp + earnedXp + (clearedRelic ? 100 : 0),
          focusSessionsCompleted: prev.focusSessionsCompleted + 1,
          acceptedQuests: updated,
        };
      });

      soundFx.questClear(progress.soundEnabled);
      pushFloatingEffect(`+${earnedXp} XP`, 'xp');

      if (clearedRelic) {
        pushFloatingEffect(`던전 정복!`, 'victory');
        showToast(`집중 독서로 던전 클리어! 아티팩트 「${clearedRelic}」 해금`);
        awardAchievement('babel-conqueror');
        awardAchievement('boss-striker');
      } else if (targetTitle) {
        pushFloatingEffect(`보스 -${dmg} HP`, 'damage');
        showToast(`집중 독서 완료! 「${targetTitle}」 보스 -${dmg} HP · +${earnedXp} XP`);
        awardAchievement('boss-striker');
      } else {
        showToast(`자유 독서 스프린트 완료! +${earnedXp} XP 획득`);
      }
    },
    [
      awardAchievement,
      progress.soundEnabled,
      pushFloatingEffect,
      showToast,
      sprintMinutes,
      targetQuestId,
    ]
  );

  // Tick Focus Timer
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          handleCompleteFocusSprint(1);
          return sprintMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isTimerRunning, sprintMinutes, handleCompleteFocusSprint]);

  const acceptedIdSet = useMemo(
    () => new Set(progress.acceptedQuests.map((item) => item.quest.id)),
    [progress.acceptedQuests]
  );

  const completedPreviewSet = useMemo(
    () => new Set(progress.completedPreviewIds),
    [progress.completedPreviewIds]
  );

  const readerRank = useMemo(() => getReaderRank(progress.xp), [progress.xp]);

  const bestCuratedMatch = useMemo(() => {
    const targetDifficulty =
      mood.stamina === 'light' ? 30 : mood.stamina === 'balanced' ? 55 : 82;

    const scored = CURATED_QUESTS.map((q) => {
      const warmthScore = 100 - Math.abs(mood.warmth - q.stats.resonance);
      const energyScore = 100 - Math.abs(mood.energy - q.stats.immersion);
      const diffScore = 100 - Math.abs(targetDifficulty - q.difficultyScore);
      const total = warmthScore * 0.4 + energyScore * 0.35 + diffScore * 0.25;
      return { quest: q, score: total };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.quest ?? CURATED_QUESTS[0];
  }, [mood]);

  const filteredCatalog = useMemo(() => {
    const base =
      rankFilter === '전체'
        ? [...CURATED_QUESTS]
        : CURATED_QUESTS.filter((q) => q.dungeonRank === rankFilter);

    if (catalogSort === 'diff-asc') {
      base.sort((a, b) => a.difficultyScore - b.difficultyScore);
    } else if (catalogSort === 'diff-desc') {
      base.sort((a, b) => b.difficultyScore - a.difficultyScore);
    } else if (catalogSort === 'immersion') {
      base.sort((a, b) => b.stats.immersion - a.stats.immersion);
    }
    return base;
  }, [rankFilter, catalogSort]);

  const handleSwitchTab = (tab: ActiveTab) => {
    soundFx.pageTurn(progress.soundEnabled);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPreset = (presetId: string) => {
    const found = MOOD_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    soundFx.pageTurn(progress.soundEnabled);
    setMood((prev) => ({
      ...prev,
      presetId: found.id,
      presetLabel: found.label,
      energy: found.energy,
      warmth: found.warmth,
      stamina: found.stamina,
    }));
  };

  const handleRequestAiQuests = async (excludeTitles: string[] = []) => {
    setIsGenerating(true);
    setApiError(null);
    soundFx.cardDraw(progress.soundEnabled);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presetLabel: mood.presetLabel,
          energy: mood.energy,
          warmth: mood.warmth,
          stamina: mood.stamina,
          customNote: mood.customNote.trim(),
          excludeTitles,
        }),
      });

      const rawBody = await response.text();
      let data: { error?: string; moodSummary?: string; quests?: BookQuest[] } = {};
      try {
        data = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        throw new Error(
          `서버 응답을 읽는 중 오류가 발생했습니다 (HTTP ${response.status}). 잠시 후 다시 시도해 주세요.`
        );
      }

      if (!response.ok) {
        throw new Error(data.error || '추천 요청을 처리하지 못했습니다.');
      }

      if (!Array.isArray(data.quests) || data.quests.length === 0) {
        throw new Error('추천 결과를 받아오지 못했습니다. 다시 시도해 주세요.');
      }

      setMoodSummary(data.moodSummary || '당신의 현재 감정에 맞춘 세 권의 퀘스트입니다.');
      setAiQuests(data.quests);
      setRevealedIds([]);
      setDiceQuest(null);
      setProgress((prev) => ({
        ...prev,
        aiRequestCount: prev.aiRequestCount + 1,
      }));
      soundFx.questClear(progress.soundEnabled);
      pushFloatingEffect('퀘스트 카드 3장 도착!', 'victory');
      showToast('봉인된 퀘스트 카드 3장이 도착했습니다. 카드를 열어보세요!');
      awardAchievement('first-mood-oracle');

      window.setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setApiError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevealCard = (questId: string) => {
    if (revealedIds.includes(questId)) return;
    soundFx.cardFlip(progress.soundEnabled);
    setRevealedIds((prev) => [...prev, questId]);
  };

  const handleRevealAllCards = () => {
    soundFx.questClear(progress.soundEnabled);
    setRevealedIds(aiQuests.map((q) => q.id));
  };

  const handleRollFateDice = () => {
    if (isRollingDice) return;
    soundFx.diceRoll(progress.soundEnabled);
    setIsRollingDice(true);

    const finalRoll = Math.floor(Math.random() * 20) + 1;
    const randomPreset =
      MOOD_PRESETS[Math.floor(Math.random() * MOOD_PRESETS.length)];
    const randomQuest =
      CURATED_QUESTS[Math.floor(Math.random() * CURATED_QUESTS.length)];

    let ticks = 0;
    const interval = window.setInterval(() => {
      ticks += 1;
      setDiceValue(Math.floor(Math.random() * 20) + 1);
      if (ticks >= 8) {
        window.clearInterval(interval);
        setIsRollingDice(false);
        setDiceValue(finalRoll);
        setDiceBurstKey((k) => k + 1);
        setDiceQuest(randomQuest);
        setMood((prev) => ({
          ...prev,
          presetId: randomPreset.id,
          presetLabel: randomPreset.label,
          energy: randomPreset.energy,
          warmth: randomPreset.warmth,
          stamina: randomPreset.stamina,
        }));
        setProgress((prev) => ({
          ...prev,
          diceRollCount: prev.diceRollCount + 1,
        }));
        pushFloatingEffect(`d20 주사위 [${finalRoll}]`, 'victory');
        showToast(
          `d20 주사위 [${finalRoll}] — 「${randomQuest.title}」 퀘스트가 선택되었습니다`
        );
        awardAchievement('fate-roller');
      }
    }, 50);
  };

  const handleAcceptQuest = (quest: BookQuest) => {
    if (acceptedIdSet.has(quest.id)) return;
    soundFx.choiceTick(progress.soundEnabled);

    const newAccepted: AcceptedQuest = {
      quest,
      acceptedAt: Date.now(),
      bossHp: 100,
      readingSessions: 0,
      checkpoints: {
        act1: false,
        midBoss: false,
        cleared: false,
      },
      plotPreviewCompleted: completedPreviewSet.has(quest.id),
      journalNote: '',
    };

    setProgress((prev) => ({
      ...prev,
      xp: prev.xp + 30,
      acceptedQuests: [newAccepted, ...prev.acceptedQuests],
    }));

    pushFloatingEffect('+30 XP', 'xp');
    showToast(`+30 XP · 「${quest.title}」 모험 덱에 등록되었습니다`);
    awardAchievement('first-contract');
  };

  const handleCompletePreview = (questId: string) => {
    if (!completedPreviewSet.has(questId)) {
      setProgress((prev) => ({
        ...prev,
        xp: prev.xp + 50,
        completedPreviewIds: [...prev.completedPreviewIds, questId],
        acceptedQuests: prev.acceptedQuests.map((item) =>
          item.quest.id === questId ? { ...item, plotPreviewCompleted: true } : item
        ),
      }));
      pushFloatingEffect('+50 XP', 'xp');
      showToast('+50 XP · 줄거리 퀘스트 체험 완료');
    }
    awardAchievement('story-witness');
  };

  const handleAttackBoss = useCallback(
    (questId: string, damage: number, fromTimer = false) => {
      let clearedTitle = '';
      let targetName = '';

      setProgress((prev) => {
        const updated = prev.acceptedQuests.map((item) => {
          if (item.quest.id !== questId) return item;
          targetName = item.quest.title;
          const nextHp = Math.max(0, (item.bossHp ?? 100) - damage);
          const act1 = item.checkpoints.act1 || nextHp <= 70;
          const midBoss = item.checkpoints.midBoss || nextHp <= 35;
          const cleared = item.checkpoints.cleared || nextHp === 0;
          if (cleared && !item.checkpoints.cleared) {
            clearedTitle = item.quest.relicReward.name;
          }
          return {
            ...item,
            bossHp: nextHp,
            readingSessions: (item.readingSessions ?? 0) + 1,
            checkpoints: { act1, midBoss, cleared },
          };
        });

        const bonusXp = fromTimer ? 35 : 20;
        return {
          ...prev,
          xp: prev.xp + bonusXp + (clearedTitle ? 100 : 0),
          focusSessionsCompleted:
            prev.focusSessionsCompleted + (fromTimer ? 1 : 0),
          acceptedQuests: updated,
        };
      });

      if (clearedTitle) {
        soundFx.questClear(progress.soundEnabled);
        pushFloatingEffect(`던전 정복! +120 XP`, 'victory');
        showToast(`던전 클리어! 아티팩트 「${clearedTitle}」 해금!`);
        awardAchievement('babel-conqueror');
      } else {
        soundFx.bossHit(progress.soundEnabled);
        pushFloatingEffect(`-${damage} HP · +20 XP`, 'damage');
        showToast(`독서 공격! 「${targetName}」 보스 -${damage} HP`);
      }
      awardAchievement('boss-striker');
    },
    [awardAchievement, progress.soundEnabled, pushFloatingEffect, showToast]
  );

  const handleToggleCheckpoint = (
    questId: string,
    checkpoint: 'act1' | 'midBoss' | 'cleared'
  ) => {
    const xpMap = { act1: 40, midBoss: 70, cleared: 120 };
    let deltaXp = 0;
    let newlyClearedTitle = '';

    setProgress((prev) => {
      const updated = prev.acceptedQuests.map((item) => {
        if (item.quest.id !== questId) return item;
        const wasDone = item.checkpoints[checkpoint];
        const nextDone = !wasDone;
        deltaXp = nextDone ? xpMap[checkpoint] : -xpMap[checkpoint];

        const nextCheckpoints = {
          ...item.checkpoints,
          [checkpoint]: nextDone,
        };

        let nextHp = 100;
        if (nextCheckpoints.cleared) nextHp = 0;
        else if (nextCheckpoints.midBoss) nextHp = 35;
        else if (nextCheckpoints.act1) nextHp = 70;

        if (checkpoint === 'cleared' && nextDone) {
          newlyClearedTitle = item.quest.relicReward.name;
        }
        return {
          ...item,
          bossHp: nextHp,
          checkpoints: nextCheckpoints,
        };
      });

      return {
        ...prev,
        xp: Math.max(0, prev.xp + deltaXp),
        acceptedQuests: updated,
      };
    });

    if (deltaXp > 0) {
      if (newlyClearedTitle) {
        soundFx.questClear(progress.soundEnabled);
        pushFloatingEffect(`+${deltaXp} XP · 아티팩트 해금!`, 'victory');
        showToast(`+${deltaXp} XP · 아티팩트 「${newlyClearedTitle}」 해금!`);
        awardAchievement('babel-conqueror');
      } else {
        soundFx.choiceTick(progress.soundEnabled);
        pushFloatingEffect(`+${deltaXp} XP`, 'xp');
        showToast(`+${deltaXp} XP · 보스 공략 단계가 반영되었습니다`);
        awardAchievement('boss-striker');
      }
    } else if (deltaXp < 0) {
      soundFx.pageTurn(progress.soundEnabled);
    }
  };

  const handleUpdateNote = (questId: string, note: string) => {
    setProgress((prev) => ({
      ...prev,
      acceptedQuests: prev.acceptedQuests.map((item) =>
        item.quest.id === questId ? { ...item, journalNote: note } : item
      ),
    }));
  };

  const handleRemoveQuest = (questId: string) => {
    soundFx.pageTurn(progress.soundEnabled);
    setProgress((prev) => ({
      ...prev,
      acceptedQuests: prev.acceptedQuests.filter((item) => item.quest.id !== questId),
    }));
    showToast('모험 덱에서 책을 정리했습니다');
  };

  const staminaLabels: Record<ReadingStamina, string> = {
    light: '가벼운 산책',
    balanced: '균형 잡힌 탐험',
    epic: '대서사시 정복',
  };

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'tuner', label: '기분 조율소' },
    { id: 'catalog', label: '퀘스트 도감' },
    { id: 'deck', label: '내 모험 덱' },
    { id: 'vault', label: '아티팩트' },
  ];

  const unrevealedCount = aiQuests.filter((q) => !revealedIds.includes(q.id)).length;
  const miniTimerFormatted = `${String(Math.floor(secondsLeft / 60)).padStart(
    2,
    '0'
  )}:${String(secondsLeft % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-[#0E1A16] text-[#F5F1E6] flex flex-col">
      {/* Floating XP / Damage Effects */}
      <EffectBurstOverlay effects={floatingEffects} />

      {/* Strict 3-Zone Top Bar */}
      <header className="border-b border-[#F5F1E6]/10 bg-[#0E1A16]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => handleSwitchTab('tuner')}
            className="text-xl font-bold tracking-tight text-[#FAF7F0] font-display whitespace-nowrap shrink-0 cursor-pointer"
          >
            북퀘스트
          </button>

          <nav
            aria-label="주요 메뉴"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSwitchTab(item.id)}
                  className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 border-b-2 ${
                    active
                      ? 'text-amber-400 border-amber-400'
                      : 'text-[#C7C1B2] border-transparent hover:text-[#FAF7F0]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="relative flex items-center shrink-0">
            <SparkParticleBurst triggerKey={diceBurstKey} />
            <button
              type="button"
              onClick={() => {
                setActiveTab('tuner');
                handleRollFateDice();
              }}
              className="px-4 py-2 text-xs font-semibold text-[#0E1A16] bg-amber-500 rounded-lg hover:bg-amber-400 active:scale-[0.97] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
            >
              오늘의 퀘스트
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden px-6 pb-3 flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSwitchTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-[#0E1A16] font-semibold'
                    : 'bg-[#15241E] text-[#C7C1B2]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Compact Player HUD Strip */}
      <div className="border-b border-[#F5F1E6]/8 bg-[#121F1A]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[#A8A295]">등급</span>
              <span className="font-semibold text-[#FAF7F0]">
                Lv.{readerRank.level} {readerRank.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#A8A295]">경험치</span>
              <span className="font-mono-num font-semibold text-amber-400">
                {progress.xp} XP
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#A8A295]">모험 덱</span>
              <span className="font-mono-num font-semibold text-[#FAF7F0]">
                {progress.acceptedQuests.length}권
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#A8A295]">업적</span>
              <span className="font-mono-num font-semibold text-emerald-400">
                {progress.unlockedAchievements.length} / {ACHIEVEMENTS.length}
              </span>
            </div>

            {isTimerRunning && (
              <button
                type="button"
                onClick={() => handleSwitchTab('deck')}
                className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-mono-num font-semibold cursor-pointer whitespace-nowrap"
              >
                <Timer className="w-3.5 h-3.5" aria-hidden="true" />
                <span>집중 중 {miniTimerFormatted}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setProgress((prev) => ({
                ...prev,
                soundEnabled: !prev.soundEnabled,
              }))
            }
            className="inline-flex items-center gap-1.5 text-xs text-[#C7C1B2] hover:text-[#FAF7F0] transition-colors cursor-pointer whitespace-nowrap"
          >
            {progress.soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span>효과음 켜짐</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#8F897B]" aria-hidden="true" />
                <span>효과음 꺼짐</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Active Workspace with Smooth Tab Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'tuner' && (
            <motion.div
              key="tab-tuner"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <section
                id="section-tuner"
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
              >
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h1
                      className="font-bold text-[#FAF7F0] leading-tight"
                      style={{
                        fontSize: 'clamp(1.95rem, 3.3vw, 2.95rem)',
                        textWrap: 'balance',
                      }}
                    >
                      지금의 기분으로 여는 문학 퀘스트
                    </h1>
                    <p className="text-sm md:text-base text-[#C7C1B2] leading-relaxed max-w-2xl">
                      오늘의 감정 온도와 독서 체력을 조율하면, 어울리는 책의 줄거리 도입부와 던전 난이도를 플레이 가능한 카드 덱으로 꺼내 드립니다.
                    </p>
                  </div>

                  {/* Mood Control Board */}
                  <div className="p-6 rounded-xl bg-[#15241E] border border-[#F5F1E6]/10 space-y-5">
                    <div className="space-y-2.5">
                      <span className="block text-xs font-medium text-[#C7C1B2]">
                        1. 지금 가장 가까운 기분 선택
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {MOOD_PRESETS.map((preset) => {
                          const active = mood.presetId === preset.id;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => handleSelectPreset(preset.id)}
                              className={`p-3 rounded-lg border text-left transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                                active
                                  ? 'bg-amber-500/15 border-amber-400 text-[#FAF7F0]'
                                  : 'bg-[#0E1A16]/75 border-[#F5F1E6]/10 text-[#C7C1B2] hover:border-[#F5F1E6]/30 hover:text-[#FAF7F0]'
                              }`}
                            >
                              <div className="text-xs font-semibold truncate">
                                {preset.label}
                              </div>
                              <div className="text-[11px] text-[#A8A295] mt-0.5 line-clamp-1">
                                {preset.subtitle}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2-Axis Mood Sliders */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-[#F5F1E6]/8">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <label htmlFor="energy-slider" className="text-[#E2DDD0] font-medium">
                            마음의 에너지
                          </label>
                          <span className="font-mono-num text-amber-400 font-semibold">
                            {mood.energy} / 100
                          </span>
                        </div>
                        <input
                          id="energy-slider"
                          type="range"
                          min={0}
                          max={100}
                          value={mood.energy}
                          onChange={(e) =>
                            setMood((prev) => ({
                              ...prev,
                              energy: Number(e.target.value),
                            }))
                          }
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] text-[#8F897B]">
                          <span>고요함</span>
                          <span>역동적</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <label htmlFor="warmth-slider" className="text-[#E2DDD0] font-medium">
                            감정의 온도
                          </label>
                          <span className="font-mono-num text-amber-400 font-semibold">
                            {mood.warmth} / 100
                          </span>
                        </div>
                        <input
                          id="warmth-slider"
                          type="range"
                          min={0}
                          max={100}
                          value={mood.warmth}
                          onChange={(e) =>
                            setMood((prev) => ({
                              ...prev,
                              warmth: Number(e.target.value),
                            }))
                          }
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] text-[#8F897B]">
                          <span>서늘한 사색</span>
                          <span>따뜻한 위로</span>
                        </div>
                      </div>
                    </div>

                    {/* Stamina & Custom Note */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-3 border-t border-[#F5F1E6]/8 items-end">
                      <div className="sm:col-span-6 space-y-1.5">
                        <span className="block text-xs font-medium text-[#C7C1B2]">
                          2. 독서 체력 (난이도)
                        </span>
                        <div className="grid grid-cols-3 gap-1 p-1 bg-[#0E1A16] rounded-lg border border-[#F5F1E6]/10">
                          {(
                            [
                              { id: 'light', label: '가벼움' },
                              { id: 'balanced', label: '균형' },
                              { id: 'epic', label: '묵직함' },
                            ] as const
                          ).map((opt) => {
                            const active = mood.stamina === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  soundFx.pageTurn(progress.soundEnabled);
                                  setMood((prev) => ({ ...prev, stamina: opt.id }));
                                }}
                                className={`px-2 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                                  active
                                    ? 'bg-amber-500 text-[#0E1A16] font-semibold'
                                    : 'text-[#C7C1B2] hover:text-[#FAF7F0]'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="sm:col-span-6 space-y-1.5">
                        <label
                          htmlFor="custom-mood-note"
                          className="block text-xs font-medium text-[#C7C1B2]"
                        >
                          3. 지금 상태 한 줄 메모 (선택)
                        </label>
                        <input
                          id="custom-mood-note"
                          type="text"
                          value={mood.customNote}
                          onChange={(e) =>
                            setMood((prev) => ({ ...prev, customNote: e.target.value }))
                          }
                          placeholder="예: 비 오는 밤, 잠깐 현실을 잊고 싶어요"
                          className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#0E1A16] border border-[#F5F1E6]/15 text-[#FAF7F0] placeholder:text-[#787366] focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        disabled={isGenerating}
                        onClick={() => handleRequestAiQuests([])}
                        className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg bg-amber-500 text-[#0E1A16] hover:bg-amber-400 active:scale-[0.98] disabled:opacity-60 transition-all cursor-pointer whitespace-nowrap"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                            <span>맞춤 카드 3장 생성 중...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" aria-hidden="true" />
                            <span>AI 기분 맞춤 퀘스트 받기</span>
                          </>
                        )}
                      </button>

                      <div className="relative">
                        <SparkParticleBurst triggerKey={diceBurstKey} />
                        <button
                          type="button"
                          onClick={handleRollFateDice}
                          disabled={isRollingDice}
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-lg border border-[#F5F1E6]/20 bg-[#0E1A16] text-[#FAF7F0] hover:border-amber-400/60 hover:text-amber-300 active:scale-[0.97] transition-all cursor-pointer whitespace-nowrap"
                        >
                          <Dices
                            className={`w-4 h-4 text-amber-400 ${
                              isRollingDice ? 'animate-spin' : ''
                            }`}
                            aria-hidden="true"
                          />
                          <span>
                            {diceValue !== null
                              ? `주사위 (${diceValue})`
                              : '운명의 주사위'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Tabletop Atmospheric Visual */}
                <div className="lg:col-span-5 flex">
                  <div className="relative w-full min-h-[380px] lg:h-full rounded-xl overflow-hidden border border-[#F5F1E6]/12 bg-[#0B1411]">
                    <img
                      src={HERO_TABLETOP_IMAGE}
                      alt="녹색 펠트 테이블 위에 놓인 열린 책과 황동 주사위"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#09120F] via-[#0E1A16]/55 to-transparent" />

                    <motion.div
                      key={(diceQuest ?? bestCuratedMatch).id}
                      initial={{ opacity: 0.5, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute bottom-6 left-6 right-6 space-y-4"
                    >
                      <div className="space-y-1">
                        <p className="text-xs text-amber-300 font-medium">
                          실시간 공명 도서 · {staminaLabels[mood.stamina]}
                        </p>
                        <h2 className="text-2xl font-bold text-[#FAF7F0]">
                          {(diceQuest ?? bestCuratedMatch).title}
                        </h2>
                        <p className="text-xs text-[#D6D0C2]">
                          {(diceQuest ?? bestCuratedMatch).author} ·{' '}
                          {(diceQuest ?? bestCuratedMatch).dungeonRank} · 난이도{' '}
                          <span className="font-mono-num">
                            {(diceQuest ?? bestCuratedMatch).difficultyScore}
                          </span>
                        </p>
                      </div>

                      <p className="text-sm text-[#E2DDD0] leading-relaxed line-clamp-3">
                        {(diceQuest ?? bestCuratedMatch).moodMatchReason}
                      </p>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.cardDraw(progress.soundEnabled);
                            setActiveEncounterQuest(diceQuest ?? bestCuratedMatch);
                          }}
                          className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#FAF7F0] text-[#0E1A16] hover:bg-amber-300 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                        >
                          줄거리 퀘스트 체험
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSwitchTab('catalog')}
                          className="px-4 py-2.5 text-xs font-medium rounded-lg border border-[#F5F1E6]/25 bg-[#0E1A16]/75 text-[#FAF7F0] hover:border-amber-400/60 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          전체 도감 보기
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>

              {apiError && (
                <div
                  role="alert"
                  className="p-5 rounded-xl bg-rose-950/50 border border-rose-500/40 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-rose-200">
                      맞춤 퀘스트 생성을 완료하지 못했습니다
                    </p>
                    <p className="text-xs text-rose-300/90">{apiError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRequestAiQuests([])}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-500 text-white hover:bg-rose-400 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    다시 시도
                  </button>
                </div>
              )}

              {aiQuests.length > 0 && (
                <section ref={resultsRef} id="section-results" className="space-y-6 pt-2">
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#F5F1E6]/12 pb-4">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-[#FAF7F0]">
                        도착한 기분 맞춤 퀘스트 카드
                      </h2>
                      <p className="text-sm text-[#C7C1B2]">{moodSummary}</p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {unrevealedCount > 0 && (
                        <button
                          type="button"
                          onClick={handleRevealAllCards}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-[#0E1A16] hover:bg-amber-400 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>모두 뒤집기 ({unrevealedCount})</span>
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isGenerating}
                        onClick={() =>
                          handleRequestAiQuests(aiQuests.map((q) => q.title))
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-[#F5F1E6]/20 bg-[#15241E] text-[#FAF7F0] hover:border-amber-400/60 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`}
                          aria-hidden="true"
                        />
                        <span>새 3장 뽑기</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aiQuests.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        isRevealed={revealedIds.includes(quest.id)}
                        onReveal={() => handleRevealCard(quest.id)}
                        isAccepted={acceptedIdSet.has(quest.id)}
                        isPreviewCompleted={completedPreviewSet.has(quest.id)}
                        onOpenEncounter={(q) => {
                          soundFx.cardDraw(progress.soundEnabled);
                          setActiveEncounterQuest(q);
                        }}
                        onAcceptQuest={handleAcceptQuest}
                      />
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {activeTab === 'catalog' && (
            <motion.section
              key="tab-catalog"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              id="section-catalog"
              className="space-y-6"
            >
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#F5F1E6]/12 pb-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#FAF7F0]">
                    퀘스트 도감
                  </h2>
                  <p className="text-sm text-[#C7C1B2] mt-1">
                    던전 난이도와 몰입도 기준으로 책을 고르고 줄거리 퀘스트를 체험해 보세요.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    aria-label="도감 정렬 기준"
                    value={catalogSort}
                    onChange={(e) => setCatalogSort(e.target.value as CatalogSort)}
                    className="px-3 py-2 text-xs rounded-lg bg-[#15241E] border border-[#F5F1E6]/15 text-[#EAE5D8] focus:outline-none focus:border-amber-400"
                  >
                    <option value="default">기본 추천순</option>
                    <option value="diff-asc">난이도 낮은순</option>
                    <option value="diff-desc">난이도 높은순</option>
                    <option value="immersion">몰입도 높은순</option>
                  </select>

                  <div className="flex flex-wrap items-center gap-1 p-1 bg-[#15241E] rounded-lg border border-[#F5F1E6]/10">
                    {(
                      [
                        '전체',
                        'Lv.1 산책로',
                        'Lv.2 안개 숲',
                        'Lv.3 심해 유적',
                        'Lv.4 바벨의 탑',
                      ] as const
                    ).map((rank) => {
                      const active = rankFilter === rank;
                      return (
                        <button
                          key={rank}
                          type="button"
                          onClick={() => {
                            soundFx.pageTurn(progress.soundEnabled);
                            setRankFilter(rank);
                          }}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            active
                              ? 'bg-amber-500 text-[#0E1A16] font-semibold'
                              : 'text-[#C7C1B2] hover:text-[#FAF7F0]'
                          }`}
                        >
                          {rank}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCatalog.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    isAccepted={acceptedIdSet.has(quest.id)}
                    isPreviewCompleted={completedPreviewSet.has(quest.id)}
                    onOpenEncounter={(q) => {
                      soundFx.cardDraw(progress.soundEnabled);
                      setActiveEncounterQuest(q);
                    }}
                    onAcceptQuest={handleAcceptQuest}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {(activeTab === 'deck' || activeTab === 'vault') && (
            <motion.div
              key={`tab-${activeTab}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              <AdventureDeckView
                mode={activeTab}
                acceptedQuests={progress.acceptedQuests}
                unlockedAchievements={progress.unlockedAchievements}
                xp={progress.xp}
                timer={{
                  sprintMinutes,
                  secondsLeft,
                  isRunning: isTimerRunning,
                  ambientRain,
                  targetQuestId,
                  onChangeMinutes: (mins) => {
                    setIsTimerRunning(false);
                    setSprintMinutes(mins);
                    setSecondsLeft(mins * 60);
                  },
                  onToggleRunning: () => {
                    soundFx.pageTurn(progress.soundEnabled);
                    setIsTimerRunning((prev) => !prev);
                  },
                  onResetTimer: () => {
                    soundFx.pageTurn(progress.soundEnabled);
                    setIsTimerRunning(false);
                    setSecondsLeft(sprintMinutes * 60);
                  },
                  onCompleteEarly: () => {
                    const total = sprintMinutes * 60;
                    const elapsed = total - secondsLeft;
                    setIsTimerRunning(false);
                    setSecondsLeft(total);
                    handleCompleteFocusSprint(elapsed / total);
                  },
                  onToggleRain: () => setAmbientRain((prev) => !prev),
                  onChangeTargetQuest: (qId) => setTargetQuestId(qId),
                }}
                onAttackBoss={handleAttackBoss}
                onToggleCheckpoint={handleToggleCheckpoint}
                onUpdateNote={handleUpdateNote}
                onRemoveQuest={handleRemoveQuest}
                onOpenEncounter={(q) => {
                  soundFx.cardDraw(progress.soundEnabled);
                  setActiveEncounterQuest(q);
                }}
                onGoToTuner={() => handleSwitchTab('tuner')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-[#F5F1E6]/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-[#8F897B]">
          <span>북퀘스트 — 기분 맞춤 문학 탐험 서재</span>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="/api/download-github-zip"
              download="bookquest-github.zip"
              className="text-amber-400/90 hover:text-amber-300 hover:underline underline-offset-4 transition-colors"
            >
              GitHub용 소스 ZIP 다운로드
            </a>
            <span>진행 기록과 업적은 이 브라우저에 저장됩니다.</span>
          </div>
        </div>
      </footer>

      {/* Interactive Plot Encounter Modal */}
      <PlotQuestModal
        quest={activeEncounterQuest}
        isAccepted={
          activeEncounterQuest ? acceptedIdSet.has(activeEncounterQuest.id) : false
        }
        isPreviewCompleted={
          activeEncounterQuest
            ? completedPreviewSet.has(activeEncounterQuest.id)
            : false
        }
        soundEnabled={progress.soundEnabled}
        onClose={() => setActiveEncounterQuest(null)}
        onCompletePreview={handleCompletePreview}
        onAcceptQuest={handleAcceptQuest}
      />

      {/* Non-intrusive Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.18 }}
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-lg bg-[#1A2D25] border border-amber-400/45 text-sm font-medium text-[#FAF7F0] shadow-xl"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
