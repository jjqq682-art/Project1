import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Check, Compass, Lock, ShieldAlert, Swords } from 'lucide-react';
import { COVER_IMAGES } from '../data/curatedQuests';
import { BookQuest } from '../types/quest';
import { SparkParticleBurst } from './EffectBurst';

interface QuestCardProps {
  quest: BookQuest;
  isAccepted: boolean;
  isPreviewCompleted: boolean;
  isRevealed?: boolean;
  onReveal?: () => void;
  onOpenEncounter: (quest: BookQuest) => void;
  onAcceptQuest: (quest: BookQuest) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({
  quest,
  isAccepted,
  isPreviewCompleted,
  isRevealed = true,
  onReveal,
  onOpenEncounter,
  onAcceptQuest,
}) => {
  const [sheenPos, setSheenPos] = useState<{ x: number; y: number } | null>(null);
  const [burstKey, setBurstKey] = useState(0);

  const coverSrc = COVER_IMAGES[quest.coverTheme] ?? COVER_IMAGES.dream;

  const rankAccentText =
    quest.dungeonRank === 'Lv.4 바벨의 탑'
      ? 'text-rose-400'
      : quest.dungeonRank === 'Lv.3 심해 유적'
        ? 'text-amber-400'
        : quest.dungeonRank === 'Lv.2 안개 숲'
          ? 'text-emerald-400'
          : 'text-teal-300';

  if (!isRevealed) {
    return (
      <motion.button
        type="button"
        onClick={onReveal}
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="group relative flex flex-col items-center justify-center min-h-[410px] p-8 rounded-xl bg-[#13211B] border border-amber-400/35 hover:border-amber-400 text-center cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(245, 158, 11, 0.14), transparent 68%)',
          }}
        />
        <div className="relative w-16 h-16 rounded-full bg-amber-500/12 border border-amber-400/40 flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110">
          <Lock className="w-6 h-6 text-amber-400" aria-hidden="true" />
        </div>
        <p className="relative text-xs font-medium text-amber-400 mb-2">
          {quest.dungeonRank} · {quest.genre}
        </p>
        <h3 className="relative text-xl font-bold text-[#FAF7F0] mb-2">
          봉인된 문학 퀘스트
        </h3>
        <p className="relative text-sm text-[#A8A295] leading-relaxed max-w-[24ch]">
          카드를 클릭해 추천 도서와 던전 난이도를 확인하세요.
        </p>
        <span className="relative mt-6 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-[#0E1A16] group-hover:bg-amber-400 transition-colors">
          카드 열기
        </span>
      </motion.button>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, rotateY: 22, scale: 0.96 }}
      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setSheenPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }}
      onPointerLeave={() => setSheenPos(null)}
      className="group relative flex flex-col justify-between bg-[#15241E] border border-[#F5F1E6]/10 hover:border-amber-400/35 rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-1"
    >
      {/* Subtle Pointer-Following Spotlight Sheen */}
      {sheenPos && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-150"
          style={{
            background: `radial-gradient(280px circle at ${sheenPos.x}px ${sheenPos.y}px, rgba(245, 158, 11, 0.08), transparent 70%)`,
          }}
        />
      )}

      <div>
        {/* Cover Image with Measured Scrim */}
        <div className="relative h-52 w-full overflow-hidden bg-[#0B1411]">
          <img
            src={coverSrc}
            alt={`${quest.title} 일러스트`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15241E] via-[#0E1A16]/55 to-transparent" />

          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 text-xs text-[#E2DDD0]/85 mb-1">
              <span>{quest.genre}</span>
              <span aria-hidden="true">·</span>
              <span className={`font-semibold ${rankAccentText}`}>{quest.dungeonRank}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-num">약 {quest.estimatedHours}시간</span>
            </div>
            <h3 className="text-xl font-bold text-[#FAF7F0] leading-snug truncate">
              {quest.title}
            </h3>
            <p className="text-xs text-[#C7C1B2] mt-0.5 truncate">
              {quest.author} · {quest.dungeonName}
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-[#DDD7C8] leading-relaxed line-clamp-2">
            {quest.moodMatchReason}
          </p>

          <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#F5F1E6]/8 text-center">
            <div>
              <p className="text-[11px] text-[#A8A295]">난이도</p>
              <p className="text-sm font-bold font-mono-num text-[#FAF7F0] mt-0.5">
                {quest.difficultyScore}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#A8A295]">몰입도</p>
              <p className="text-sm font-bold font-mono-num text-amber-400 mt-0.5">
                {quest.stats.immersion}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#A8A295]">감정 파동</p>
              <p className="text-sm font-bold font-mono-num text-emerald-400 mt-0.5">
                {quest.stats.resonance}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#C7C1B2]">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
            <span className="truncate">
              보스: <strong className="text-[#FAF7F0] font-medium">{quest.bossChallenge.name}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-20 px-5 pb-5 pt-1 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onOpenEncounter(quest)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg bg-amber-500 text-[#0E1A16] hover:bg-amber-400 active:scale-[0.98] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
        >
          {isPreviewCompleted ? (
            <>
              <Compass className="w-3.5 h-3.5" aria-hidden="true" />
              <span>줄거리 다시 체험</span>
            </>
          ) : (
            <>
              <Swords className="w-3.5 h-3.5" aria-hidden="true" />
              <span>줄거리 퀘스트</span>
            </>
          )}
        </button>

        <div className="relative shrink-0">
          <SparkParticleBurst triggerKey={burstKey} color="#34D399" />
          <button
            type="button"
            onClick={() => {
              if (!isAccepted) {
                setBurstKey((k) => k + 1);
                onAcceptQuest(quest);
              }
            }}
            disabled={isAccepted}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-medium rounded-lg border transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 ${
              isAccepted
                ? 'border-emerald-500/40 bg-emerald-950/50 text-emerald-300 cursor-default'
                : 'border-[#F5F1E6]/20 bg-[#0E1A16]/70 text-[#FAF7F0] hover:border-amber-400/60 hover:text-amber-300 active:scale-[0.97] cursor-pointer'
            }`}
          >
            {isAccepted ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                <span>수락됨</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>덱에 담기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
};
