import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Coffee,
  Dices,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import { COVER_IMAGES } from '../data/curatedQuests';
import { BookQuest, PlotChoice } from '../types/quest';
import { soundFx } from '../utils/sound';
import { SparkParticleBurst } from './EffectBurst';
import { RelicIcon } from './RelicIcon';
import { StatRadarChart } from './StatRadarChart';

interface PlotQuestModalProps {
  quest: BookQuest | null;
  isAccepted: boolean;
  isPreviewCompleted: boolean;
  soundEnabled: boolean;
  onClose: () => void;
  onCompletePreview: (questId: string) => void;
  onAcceptQuest: (quest: BookQuest) => void;
}

type EncounterPhase = 'prologue' | 'stage1' | 'stage2' | 'climax';

export const PlotQuestModal: React.FC<PlotQuestModalProps> = ({
  quest,
  isAccepted,
  isPreviewCompleted,
  soundEnabled,
  onClose,
  onCompletePreview,
  onAcceptQuest,
}) => {
  const [phase, setPhase] = useState<EncounterPhase>('prologue');
  const [resonance, setResonance] = useState<number>(35);
  const [stage1Choice, setStage1Choice] = useState<PlotChoice | null>(null);
  const [stage2Choice, setStage2Choice] = useState<PlotChoice | null>(null);

  const [isRollingDice, setIsRollingDice] = useState<boolean>(false);
  const [rollingDisplay, setRollingDisplay] = useState<number>(12);
  const [skillCheckRoll, setSkillCheckRoll] = useState<number | null>(null);
  const [diceBurstKey, setDiceBurstKey] = useState<number>(0);

  useEffect(() => {
    if (quest) {
      setPhase('prologue');
      setResonance(35);
      setStage1Choice(null);
      setStage2Choice(null);
      setIsRollingDice(false);
      setSkillCheckRoll(null);
    }
  }, [quest]);

  useEffect(() => {
    if (!quest) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quest, onClose]);

  if (!quest) return null;

  const coverSrc = COVER_IMAGES[quest.coverTheme] ?? COVER_IMAGES.dream;
  const stage1 = quest.plotQuest.stages[0];
  const stage2 = quest.plotQuest.stages[1];

  const handleStartEncounter = () => {
    soundFx.pageTurn(soundEnabled);
    setPhase('stage1');
  };

  const handleSelectStage1 = (choice: PlotChoice) => {
    soundFx.choiceTick(soundEnabled);
    setStage1Choice(choice);
    setResonance((prev) => Math.min(100, prev + choice.resonanceDelta));
  };

  const handleSelectStage2 = (choice: PlotChoice) => {
    soundFx.choiceTick(soundEnabled);
    setStage2Choice(choice);
    setResonance((prev) => Math.min(100, prev + choice.resonanceDelta));
  };

  const handleSkillCheck = () => {
    if (skillCheckRoll !== null || isRollingDice) return;
    soundFx.diceRoll(soundEnabled);
    setIsRollingDice(true);

    const finalRoll = Math.floor(Math.random() * 20) + 1;
    let ticks = 0;
    const interval = window.setInterval(() => {
      ticks += 1;
      setRollingDisplay(Math.floor(Math.random() * 20) + 1);
      if (ticks >= 7) {
        window.clearInterval(interval);
        setIsRollingDice(false);
        setSkillCheckRoll(finalRoll);
        setDiceBurstKey((k) => k + 1);
        const bonus = finalRoll >= 15 ? 16 : finalRoll >= 8 ? 10 : 5;
        setResonance((prev) => Math.min(100, prev + bonus));
      }
    }, 55);
  };

  const handleFinishEncounter = () => {
    soundFx.questClear(soundEnabled);
    setPhase('climax');
    onCompletePreview(quest.id);
  };

  const handleResetEncounter = () => {
    soundFx.pageTurn(soundEnabled);
    setPhase('prologue');
    setResonance(35);
    setStage1Choice(null);
    setStage2Choice(null);
    setIsRollingDice(false);
    setSkillCheckRoll(null);
  };

  const stepNumber =
    phase === 'prologue' ? 1 : phase === 'stage1' ? 2 : phase === 'stage2' ? 3 : 4;

  const getReaderArchetype = () => {
    if (resonance >= 90) return '완전 공명자 · 책 속 인물의 숨결을 그대로 따라가는 독자';
    if (resonance >= 75) return '깊은 사색가 · 문장 행간의 여백까지 읽어내는 독자';
    return '냉철한 관찰자 · 거리를 두고 세계의 구조를 파악하는 독자';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#060C0A]/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#121F1A] border border-[#F5F1E6]/15 rounded-xl shadow-2xl"
      >
        {/* Top Modal Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 py-4 bg-[#121F1A]/95 backdrop-blur-md border-b border-[#F5F1E6]/10">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#C7C1B2]">
              <span>{quest.genre}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-semibold">{quest.dungeonRank}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">{quest.pages}쪽 / 약 {quest.estimatedHours}시간</span>
            </div>
            <h2
              id="quest-modal-title"
              className="text-xl md:text-2xl font-bold text-[#FAF7F0] truncate mt-0.5"
            >
              {quest.title} — {quest.author}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="퀘스트 창 닫기"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#F5F1E6]/15 text-[#E2DDD0] hover:bg-[#F5F1E6]/10 hover:text-white transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column */}
          <aside className="lg:col-span-5 p-6 bg-[#0E1A16]/70 border-b lg:border-b-0 lg:border-r border-[#F5F1E6]/10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-22 rounded-lg overflow-hidden shrink-0 border border-[#F5F1E6]/15 bg-[#09120F]">
                <img
                  src={coverSrc}
                  alt={quest.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-amber-400 font-medium">던전 이름</p>
                <p className="text-base font-semibold text-[#FAF7F0] leading-snug mt-0.5">
                  {quest.dungeonName}
                </p>
                <p className="mt-1.5 text-xs text-[#C7C1B2]">
                  종합 난이도{' '}
                  <span className="font-mono-num font-semibold text-rose-400">
                    {quest.difficultyScore} / 100
                  </span>
                </p>
              </div>
            </div>

            <div className="py-3 border-y border-[#F5F1E6]/10 flex flex-col items-center">
              <p className="text-xs font-medium text-[#C7C1B2] mb-2">
                책의 4대 독서 능력치
              </p>
              <StatRadarChart stats={quest.stats} size={200} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>던전 보스: {quest.bossChallenge.name}</span>
              </div>
              <p className="text-xs text-[#D6D0C2] leading-relaxed">
                {quest.bossChallenge.description}
              </p>
            </div>

            <div className="space-y-1 pt-3 border-t border-[#F5F1E6]/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <Coffee className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>장착 추천 독서 버프</span>
              </div>
              <p className="text-xs text-[#D6D0C2] leading-relaxed">
                {quest.recommendedBuff}
              </p>
            </div>

            <div className="space-y-1 pt-3 border-t border-[#F5F1E6]/10">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FAF7F0]">
                <RelicIcon type={quest.relicReward.iconType} className="w-4 h-4 text-amber-400" />
                <span>완독 아티팩트: {quest.relicReward.name}</span>
              </div>
              <p className="text-xs text-[#A8A295] italic leading-relaxed">
                “{quest.relicReward.quote}”
              </p>
            </div>
          </aside>

          {/* Right Column */}
          <section className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F5F1E6]/10">
                <div>
                  <p className="text-xs text-[#C7C1B2]">
                    줄거리 체험 퀘스트 · {stepNumber} / 4 단계 (스포일러 없음)
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {[1, 2, 3, 4].map((step) => (
                      <span
                        key={step}
                        className={`h-1.5 w-8 rounded-sm transition-colors duration-200 ${
                          step <= stepNumber ? 'bg-amber-400' : 'bg-[#F5F1E6]/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-[#C7C1B2]">감정 공명도</p>
                  <motion.p
                    key={resonance}
                    initial={{ scale: 1.25 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.22 }}
                    className="text-lg font-bold font-mono-num text-amber-400"
                  >
                    {resonance}%
                  </motion.p>
                </div>
              </div>

              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-6 space-y-5"
              >
                {phase === 'prologue' && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-[#FAF7F0]">
                      도입부: 이야기의 문이 열립니다
                    </h3>
                    <p className="text-base text-[#EAE5D8] leading-relaxed">
                      {quest.plotQuest.prologue}
                    </p>
                    <div className="p-4 rounded-lg bg-[#0E1A16] border border-[#F5F1E6]/10 text-xs text-[#C7C1B2] leading-relaxed">
                      초반 갈림길 선택과 운명 주사위(d20) 판정을 통해 책의 분위기와 몰입감을 미리 경험할 수 있습니다.
                    </div>
                    <button
                      type="button"
                      onClick={handleStartEncounter}
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-lg bg-amber-500 text-[#0E1A16] hover:bg-amber-400 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>첫 번째 선택지로 들어가기</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                )}

                {phase === 'stage1' && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-[#FAF7F0]">
                      제1막 갈림길
                    </h3>
                    <p className="text-base text-[#EAE5D8] leading-relaxed">
                      {stage1.prompt}
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                      {[stage1.choiceA, stage1.choiceB].map((choice, idx) => {
                        const isSelected = stage1Choice?.label === choice.label;
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={Boolean(stage1Choice)}
                            onClick={() => handleSelectStage1(choice)}
                            className={`text-left p-4 rounded-lg border transition-all duration-150 ${
                              isSelected
                                ? 'border-amber-400 bg-amber-500/15 text-[#FAF7F0]'
                                : stage1Choice
                                  ? 'border-[#F5F1E6]/8 bg-[#0E1A16]/40 text-[#8F897B] cursor-default'
                                  : 'border-[#F5F1E6]/20 bg-[#0E1A16]/80 text-[#EAE5D8] hover:border-amber-400/70 hover:bg-[#192B24] cursor-pointer'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-sm font-medium leading-relaxed">
                                {idx === 0 ? '선택 A.' : '선택 B.'} {choice.label}
                              </span>
                              <span className="text-xs font-mono-num text-amber-400 shrink-0">
                                공명 +{choice.resonanceDelta}%
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {stage1Choice && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-5 rounded-lg bg-[#0E1A16] border border-amber-400/35 space-y-4"
                      >
                        <p className="text-sm text-[#FAF7F0] leading-relaxed">
                          {stage1Choice.outcome}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.pageTurn(soundEnabled);
                            setPhase('stage2');
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-amber-500 text-[#0E1A16] hover:bg-amber-400 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <span>다음 전환점으로 이동</span>
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}

                {phase === 'stage2' && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-[#FAF7F0]">
                      제2막 전환점 & 운명 판정
                    </h3>
                    <p className="text-base text-[#EAE5D8] leading-relaxed">
                      {stage2.prompt}
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                      {[stage2.choiceA, stage2.choiceB].map((choice, idx) => {
                        const isSelected = stage2Choice?.label === choice.label;
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={Boolean(stage2Choice)}
                            onClick={() => handleSelectStage2(choice)}
                            className={`text-left p-4 rounded-lg border transition-all duration-150 ${
                              isSelected
                                ? 'border-amber-400 bg-amber-500/15 text-[#FAF7F0]'
                                : stage2Choice
                                  ? 'border-[#F5F1E6]/8 bg-[#0E1A16]/40 text-[#8F897B] cursor-default'
                                  : 'border-[#F5F1E6]/20 bg-[#0E1A16]/80 text-[#EAE5D8] hover:border-amber-400/70 hover:bg-[#192B24] cursor-pointer'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="text-sm font-medium leading-relaxed">
                                {idx === 0 ? '선택 A.' : '선택 B.'} {choice.label}
                              </span>
                              <span className="text-xs font-mono-num text-amber-400 shrink-0">
                                공명 +{choice.resonanceDelta}%
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {stage2Choice && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-5 rounded-lg bg-[#0E1A16] border border-amber-400/35 space-y-4"
                      >
                        <p className="text-sm text-[#FAF7F0] leading-relaxed">
                          {stage2Choice.outcome}
                        </p>

                        {skillCheckRoll === null ? (
                          <button
                            type="button"
                            onClick={handleSkillCheck}
                            disabled={isRollingDice}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-amber-500 text-[#0E1A16] hover:bg-amber-400 transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <Dices
                              className={`w-4 h-4 ${isRollingDice ? 'animate-spin' : ''}`}
                              aria-hidden="true"
                            />
                            <span>
                              {isRollingDice
                                ? `주사위 굴리는 중... (${rollingDisplay})`
                                : '운명 주사위(d20) 굴려 공명 판정하기'}
                            </span>
                          </button>
                        ) : (
                          <div className="relative pt-3 border-t border-[#F5F1E6]/10 flex flex-wrap items-center justify-between gap-3">
                            <SparkParticleBurst triggerKey={diceBurstKey} />
                            <div className="text-xs">
                              <span className="font-mono-num font-bold text-amber-400">
                                주사위 결과: {skillCheckRoll}
                              </span>
                              <span className="mx-2 text-[#8F897B]">·</span>
                              <span className="text-emerald-300 font-medium">
                                {skillCheckRoll >= 15
                                  ? '대성공! 이야기의 결이 선명히 열립니다 (+16%)'
                                  : skillCheckRoll >= 8
                                    ? '성공! 안정적으로 몰입합니다 (+10%)'
                                    : '묵직한 시련이지만 깊은 여운이 남습니다 (+5%)'}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleFinishEncounter}
                              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-[#0E1A16] hover:bg-amber-400 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <span>체험 결과 확인하기</span>
                              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}

                {phase === 'climax' && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                      <span>
                        줄거리 퀘스트 완료 {isPreviewCompleted ? '(탐험 기록됨)' : '(+50 XP 획득)'}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-[#FAF7F0]">
                      이 책은 지금 당신과 {resonance}% 공명합니다
                    </h3>

                    <p className="text-xs font-medium text-amber-300">
                      판정 성향: {getReaderArchetype()}
                    </p>

                    <p className="text-base text-[#EAE5D8] leading-relaxed">
                      {quest.plotQuest.climaxHook}
                    </p>

                    <div className="p-4 rounded-lg bg-[#0E1A16] border border-[#F5F1E6]/10 space-y-1">
                      <p className="text-xs font-semibold text-amber-300">추천 사유</p>
                      <p className="text-sm text-[#D6D0C2] leading-relaxed">
                        {quest.moodMatchReason}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Bottom Modal Action Strip */}
            <div className="pt-5 border-t border-[#F5F1E6]/10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetEncounter}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#F5F1E6]/15 text-[#C7C1B2] hover:text-white hover:border-[#F5F1E6]/35 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>다시 체험</span>
              </button>

              <button
                type="button"
                onClick={() => onAcceptQuest(quest)}
                disabled={isAccepted}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  isAccepted
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 cursor-default'
                    : 'bg-amber-500 text-[#0E1A16] hover:bg-amber-400 cursor-pointer'
                }`}
              >
                {isAccepted ? (
                  <>
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>모험 덱에 담겨 있음</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    <span>모험 덱에 수락하기 (+30 XP)</span>
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};
