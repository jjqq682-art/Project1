import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  CheckCircle2,
  Circle,
  CloudRain,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ShieldAlert,
  Swords,
  Timer,
  Trash2,
  Trophy,
} from 'lucide-react';
import {
  ACHIEVEMENTS,
  COVER_IMAGES,
  READER_RANKS,
  getReaderRank,
} from '../data/curatedQuests';
import { AcceptedQuest, BookQuest } from '../types/quest';
import { SparkParticleBurst } from './EffectBurst';
import { RelicIcon } from './RelicIcon';

export interface FocusTimerProps {
  sprintMinutes: number;
  secondsLeft: number;
  isRunning: boolean;
  ambientRain: boolean;
  targetQuestId: string;
  onChangeMinutes: (mins: number) => void;
  onToggleRunning: () => void;
  onResetTimer: () => void;
  onCompleteEarly: () => void;
  onToggleRain: () => void;
  onChangeTargetQuest: (questId: string) => void;
}

interface AdventureDeckViewProps {
  mode: 'deck' | 'vault';
  acceptedQuests: AcceptedQuest[];
  unlockedAchievements: string[];
  xp: number;
  timer: FocusTimerProps;
  onAttackBoss: (questId: string, damage: number, fromTimer?: boolean) => void;
  onToggleCheckpoint: (
    questId: string,
    checkpoint: 'act1' | 'midBoss' | 'cleared'
  ) => void;
  onUpdateNote: (questId: string, note: string) => void;
  onRemoveQuest: (questId: string) => void;
  onOpenEncounter: (quest: BookQuest) => void;
  onGoToTuner: () => void;
}

export function calcTimerDamage(minutes: number): number {
  return Math.max(10, Math.min(80, Math.round(minutes * 1.2)));
}

export function calcTimerXp(minutes: number): number {
  return Math.max(15, Math.min(180, Math.round(minutes * 1.8)));
}

export const AdventureDeckView: React.FC<AdventureDeckViewProps> = ({
  mode,
  acceptedQuests,
  unlockedAchievements,
  xp,
  timer,
  onAttackBoss,
  onToggleCheckpoint,
  onUpdateNote,
  onRemoveQuest,
  onOpenEncounter,
  onGoToTuner,
}) => {
  const rank = getReaderRank(xp);
  const progressRange = Math.max(1, rank.nextXp - rank.minXp);
  const progressPercent = Math.min(
    100,
    Math.round(((xp - rank.minXp) / progressRange) * 100)
  );

  const clearedQuests = acceptedQuests.filter((q) => q.checkpoints.cleared);
  const activeQuests = acceptedQuests.filter((q) => !q.checkpoints.cleared);

  const [hitCounts, setHitCounts] = useState<Record<string, number>>({});

  const triggerCardHit = (questId: string, damage: number) => {
    setHitCounts((prev) => ({
      ...prev,
      [questId]: (prev[questId] ?? 0) + 1,
    }));
    onAttackBoss(questId, damage, false);
  };

  const totalTimerSeconds = Math.max(60, timer.sprintMinutes * 60);
  const timerProgress = 1 - timer.secondsLeft / totalTimerSeconds;
  const ringRadius = 38;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - Math.max(0, Math.min(1, timerProgress)));

  const formattedTime = `${String(Math.floor(timer.secondsLeft / 60)).padStart(
    2,
    '0'
  )}:${String(timer.secondsLeft % 60).padStart(2, '0')}`;

  const hasStarted = timer.secondsLeft < totalTimerSeconds;
  const expectedDmg = calcTimerDamage(timer.sprintMinutes);
  const expectedXp = calcTimerXp(timer.sprintMinutes);

  if (mode === 'deck') {
    return (
      <section id="section-deck" className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#F5F1E6]/12 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#FAF7F0]">
              내 모험 덱 & 집중 독서
            </h2>
            <p className="text-sm text-[#C7C1B2] mt-1">
              집중 독서 타이머를 설정하고 보스 HP를 깎아 던전을 정복하세요.
            </p>
          </div>
          <div className="text-sm text-[#C7C1B2] font-mono-num">
            공략 중 {activeQuests.length}권 · 완독 {clearedQuests.length}권
          </div>
        </div>

        {/* Configurable Focus Reading Timer Panel */}
        <div className="p-6 rounded-xl bg-[#15241E] border border-[#F5F1E6]/12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Circular Progress Ring + Live Clock */}
          <div className="lg:col-span-5 flex items-center gap-5">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg
                width="96"
                height="96"
                viewBox="0 0 96 96"
                className="-rotate-90"
                aria-hidden="true"
              >
                <circle
                  cx="48"
                  cy="48"
                  r={ringRadius}
                  fill="none"
                  stroke="rgba(245, 241, 230, 0.1)"
                  strokeWidth="5"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={ringRadius}
                  fill="none"
                  stroke={timer.isRunning ? '#F59E0B' : '#34D399'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                  style={{ transition: 'stroke-dashoffset 0.35s linear' }}
                />
              </svg>
              <span className="absolute text-lg font-bold font-mono-num text-[#FAF7F0]">
                {formattedTime}
              </span>
            </div>

            <div className="min-w-0 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Timer className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>집중 독서 타이머</span>
              </div>
              <p className="text-xs text-[#C7C1B2]">
                완료 보상: 보스{' '}
                <span className="font-mono-num text-rose-300 font-semibold">
                  -{expectedDmg} HP
                </span>{' '}
                ·{' '}
                <span className="font-mono-num text-emerald-300 font-semibold">
                  +{expectedXp} XP
                </span>
              </p>

              {/* Target Book Selector */}
              <div className="pt-1">
                <select
                  aria-label="집중 독서 대상 도서"
                  value={timer.targetQuestId}
                  onChange={(e) => timer.onChangeTargetQuest(e.target.value)}
                  className="w-full max-w-[240px] px-3 py-1.5 text-xs rounded-lg bg-[#0E1A16] border border-[#F5F1E6]/15 text-[#EAE5D8] focus:outline-none focus:border-amber-400"
                >
                  <option value="">자유 독서 모드 (경험치만 획득)</option>
                  {activeQuests.map((item) => (
                    <option key={item.quest.id} value={item.quest.id}>
                      보스전: {item.quest.title} (HP {item.bossHp})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Middle & Right: Custom Duration Configurator + Sound + Controls */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Duration Presets & Custom Minute Adjuster */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#0E1A16] border border-[#F5F1E6]/10">
                {([5, 15, 25, 45] as const).map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    disabled={timer.isRunning}
                    onClick={() => timer.onChangeMinutes(mins)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap ${
                      timer.sprintMinutes === mins
                        ? 'bg-amber-500 text-[#0E1A16] font-semibold'
                        : 'text-[#C7C1B2] hover:text-white'
                    }`}
                  >
                    {mins}분
                  </button>
                ))}
              </div>

              {/* Direct Custom Minutes Stepper & Input */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={timer.isRunning || timer.sprintMinutes <= 1}
                  onClick={() =>
                    timer.onChangeMinutes(Math.max(1, timer.sprintMinutes - 5))
                  }
                  aria-label="5분 줄이기"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#F5F1E6]/15 bg-[#0E1A16] text-[#C7C1B2] hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0E1A16] border border-[#F5F1E6]/15">
                  <input
                    type="number"
                    min={1}
                    max={120}
                    disabled={timer.isRunning}
                    aria-label="직접 분 설정"
                    value={timer.sprintMinutes}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (Number.isFinite(val)) {
                        timer.onChangeMinutes(Math.max(1, Math.min(120, Math.round(val))));
                      }
                    }}
                    className="w-11 bg-transparent text-center text-xs font-mono-num font-semibold text-[#FAF7F0] focus:outline-none disabled:opacity-50"
                  />
                  <span className="text-xs text-[#A8A295]">분</span>
                </div>
                <button
                  type="button"
                  disabled={timer.isRunning || timer.sprintMinutes >= 120}
                  onClick={() =>
                    timer.onChangeMinutes(Math.min(120, timer.sprintMinutes + 5))
                  }
                  aria-label="5분 늘리기"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-[#F5F1E6]/15 bg-[#0E1A16] text-[#C7C1B2] hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons + Ambient Rain Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-[#F5F1E6]/8">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={timer.onToggleRunning}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-[#0E1A16] hover:bg-amber-400 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  {timer.isRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>일시정지</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{hasStarted ? '이어서 시작' : '집중 시작'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={timer.onResetTimer}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-[#F5F1E6]/15 text-[#C7C1B2] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>초기화</span>
                </button>

                {hasStarted && (
                  <button
                    type="button"
                    onClick={timer.onCompleteEarly}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Swords className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>지금까지 독서 완료하기</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={timer.onToggleRain}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                  timer.ambientRain
                    ? 'border-amber-400/50 bg-amber-500/15 text-amber-300'
                    : 'border-[#F5F1E6]/15 bg-[#0E1A16] text-[#A8A295] hover:text-[#FAF7F0]'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{timer.ambientRain ? '빗소리 재생 중' : '빗소리 배경음'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Accepted Books / Boss Battles */}
        {acceptedQuests.length === 0 ? (
          <div className="p-12 rounded-xl bg-[#15241E] border border-[#F5F1E6]/10 text-center space-y-4">
            <p className="text-base font-medium text-[#E2DDD0]">
              아직 모험 덱에 담긴 책이 없습니다.
            </p>
            <p className="text-sm text-[#A8A295]">
              위 타이머로 자유 독서를 시작하거나, 기분 조율소에서 마음에 드는 책 퀘스트를 덱에 담아보세요.
            </p>
            <button
              type="button"
              onClick={onGoToTuner}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-amber-500 text-[#0E1A16] hover:bg-amber-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              기분 조율소로 이동
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {acceptedQuests.map((item) => {
              const {
                quest,
                checkpoints,
                journalNote,
                bossHp = 100,
                readingSessions = 0,
              } = item;
              const coverSrc = COVER_IMAGES[quest.coverTheme] ?? COVER_IMAGES.dream;
              const isCleared = checkpoints.cleared || bossHp <= 0;
              const cardHitCount = hitCounts[quest.id] ?? 0;

              return (
                <motion.article
                  key={quest.id}
                  animate={
                    cardHitCount > 0
                      ? { x: [0, -6, 6, -4, 4, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.28 }}
                  className={`relative p-5 rounded-xl bg-[#15241E] border transition-colors flex flex-col justify-between gap-5 ${
                    isCleared
                      ? 'border-emerald-500/35'
                      : 'border-[#F5F1E6]/12'
                  }`}
                >
                  <SparkParticleBurst
                    triggerKey={cardHitCount}
                    color={isCleared ? '#34D399' : '#FB7185'}
                  />

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-18 h-24 rounded-lg overflow-hidden shrink-0 border border-[#F5F1E6]/15 bg-[#0B1411]">
                        <img
                          src={coverSrc}
                          alt={quest.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-amber-400 font-medium truncate">
                            {quest.dungeonRank} · {quest.genre}
                          </span>
                          <span className="text-xs font-mono-num text-[#C7C1B2] shrink-0">
                            독서 기록 {readingSessions}회
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#FAF7F0] mt-1 truncate">
                          {quest.title}
                        </h3>
                        <p className="text-xs text-[#A8A295] truncate">
                          {quest.author} · {quest.dungeonName}
                        </p>

                        {/* Boss HP Battle Bar */}
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="inline-flex items-center gap-1.5 text-[#E2DDD0] font-medium truncate">
                              <ShieldAlert
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isCleared ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                                aria-hidden="true"
                              />
                              <span className="truncate">{quest.bossChallenge.name}</span>
                            </span>
                            <span
                              className={`font-mono-num font-semibold shrink-0 ${
                                isCleared ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {isCleared ? 'HP 0/100 · 처치됨' : `HP ${bossHp}/100`}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-[#0E1A16] rounded-sm overflow-hidden border border-[#F5F1E6]/10">
                            <div
                              className={`h-full transition-all duration-300 ${
                                isCleared ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.max(0, Math.min(100, bossHp))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Strike & Checkpoints */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F5F1E6]/8">
                      <button
                        type="button"
                        disabled={isCleared}
                        onClick={() => triggerCardHit(quest.id, 15)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-[#0E1A16] hover:bg-amber-400 active:scale-[0.97] disabled:opacity-45 disabled:cursor-default transition-all cursor-pointer whitespace-nowrap"
                      >
                        <Swords className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{isCleared ? '던전 정복 완료' : '오늘 분량 읽고 공격 (-15 HP)'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {(
                          [
                            { key: 'act1' as const, label: '1막', done: checkpoints.act1 },
                            { key: 'midBoss' as const, label: '중반', done: checkpoints.midBoss },
                            { key: 'cleared' as const, label: '완독', done: checkpoints.cleared },
                          ] as const
                        ).map((cp) => (
                          <button
                            key={cp.key}
                            type="button"
                            onClick={() => onToggleCheckpoint(quest.id, cp.key)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                              cp.done
                                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                                : 'bg-[#0E1A16] border-[#F5F1E6]/12 text-[#C7C1B2] hover:border-amber-400/50'
                            }`}
                          >
                            {cp.done ? (
                              <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                            ) : (
                              <Circle className="w-3 h-3" aria-hidden="true" />
                            )}
                            <span>{cp.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Journal Note & Actions */}
                  <div className="pt-3 border-t border-[#F5F1E6]/10 space-y-3">
                    <input
                      type="text"
                      aria-label={`${quest.title} 모험 메모`}
                      value={journalNote}
                      onChange={(e) => onUpdateNote(quest.id, e.target.value)}
                      placeholder="인상 깊은 문장이나 오늘의 감상을 짧게 기록해 보세요..."
                      className="w-full px-3.5 py-2 text-xs rounded-lg bg-[#0E1A16] border border-[#F5F1E6]/12 text-[#FAF7F0] placeholder:text-[#787366] focus:outline-none focus:border-amber-400"
                    />

                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => onOpenEncounter(quest)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 cursor-pointer whitespace-nowrap"
                      >
                        <Swords className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>줄거리 & 능력치 보기</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveQuest(quest.id)}
                        aria-label={`${quest.title} 덱에서 제거`}
                        className="inline-flex items-center gap-1 text-xs text-[#A8A295] hover:text-rose-400 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>제거</span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>
    );
  }

  // mode === 'vault'
  return (
    <section id="section-relics" className="space-y-10">
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#F5F1E6]/12 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#FAF7F0]">
              아티팩트 & 모험가 업적
            </h2>
            <p className="text-sm text-[#C7C1B2] mt-1">
              독서 모험을 통해 쌓은 등급, 해금한 업적, 수집한 문학 책갈피를 모아봅니다.
            </p>
          </div>
          <div className="text-sm text-[#C7C1B2] font-mono-num">
            업적 {unlockedAchievements.length}/{ACHIEVEMENTS.length} · 아티팩트 {clearedQuests.length}개
          </div>
        </div>

        <div className="p-6 rounded-xl bg-[#15241E] border border-[#F5F1E6]/12 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-5 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
              <Award className="w-4 h-4" aria-hidden="true" />
              <span>현재 등급 · Lv.{rank.level}</span>
            </div>
            <h3 className="text-2xl font-bold text-[#FAF7F0]">{rank.title}</h3>
            <p className="text-xs text-[#C7C1B2] font-mono-num">
              누적 XP: {xp} / 다음 승급 {rank.nextXp} XP
            </p>
          </div>

          <div className="md:col-span-7 space-y-3">
            <div className="h-2.5 w-full bg-[#0E1A16] rounded-sm overflow-hidden border border-[#F5F1E6]/10">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
              {READER_RANKS.map((tier) => (
                <div
                  key={tier.level}
                  className={
                    tier.level <= rank.level
                      ? 'text-amber-300 font-semibold'
                      : 'text-[#787366]'
                  }
                >
                  Lv.{tier.level} {tier.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Board */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#FAF7F0]">모험가 업적 보드</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-5 rounded-xl border transition-colors ${
                  unlocked
                    ? 'bg-[#172821] border-amber-400/40'
                    : 'bg-[#121E19] border-[#F5F1E6]/8 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy
                      className={`w-4 h-4 shrink-0 ${
                        unlocked ? 'text-amber-400' : 'text-[#6D685C]'
                      }`}
                      aria-hidden="true"
                    />
                    <h4 className="text-sm font-bold text-[#FAF7F0]">{ach.title}</h4>
                  </div>
                  <span
                    className={`text-xs font-mono-num font-semibold ${
                      unlocked ? 'text-emerald-400' : 'text-[#8F897B]'
                    }`}
                  >
                    {unlocked ? `달성 · +${ach.xpReward} XP` : `미달성 · ${ach.xpReward} XP`}
                  </span>
                </div>
                <p className="text-xs text-[#C7C1B2] leading-relaxed">
                  {ach.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bookmark Relics */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#FAF7F0]">책갈피 아티팩트 보관함</h3>
        {acceptedQuests.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#15241E] border border-[#F5F1E6]/10 text-center text-sm text-[#A8A295]">
            모험 덱에 책을 추가하고 보스 HP를 0으로 만들면 책갈피 아티팩트가 이곳에 전시됩니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {acceptedQuests.map(({ quest, checkpoints }) => {
              const unlocked = checkpoints.cleared;
              return (
                <div
                  key={quest.id}
                  className={`p-5 rounded-xl border transition-colors ${
                    unlocked
                      ? 'bg-[#172821] border-amber-400/40'
                      : 'bg-[#121E19] border-[#F5F1E6]/8 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`p-2 rounded-lg ${
                          unlocked
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-[#0E1A16] text-[#787366]'
                        }`}
                      >
                        <RelicIcon type={quest.relicReward.iconType} className="w-4 h-4" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#FAF7F0] truncate">
                          {quest.relicReward.name}
                        </h4>
                        <p className="text-xs text-[#A8A295] truncate">
                          {quest.title}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-medium shrink-0 ${
                        unlocked ? 'text-emerald-400' : 'text-[#8F897B]'
                      }`}
                    >
                      {unlocked ? '해금됨' : '완독 시 해금'}
                    </span>
                  </div>
                  <p className="text-xs text-[#D6D0C2] leading-relaxed italic mt-3 pt-3 border-t border-[#F5F1E6]/8">
                    “{quest.relicReward.quote}”
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
