import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

export interface FloatingEffect {
  id: number;
  label: string;
  tone: 'xp' | 'damage' | 'victory';
}

interface EffectBurstOverlayProps {
  effects: FloatingEffect[];
}

export const EffectBurstOverlay: React.FC<EffectBurstOverlayProps> = ({
  effects,
}) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-20 z-50 flex flex-col items-center gap-2"
    >
      <AnimatePresence>
        {effects.map((fx) => {
          const colorClass =
            fx.tone === 'damage'
              ? 'text-rose-300 bg-rose-950/85 border-rose-400/50'
              : fx.tone === 'victory'
                ? 'text-amber-200 bg-amber-950/90 border-amber-400/70'
                : 'text-emerald-200 bg-emerald-950/85 border-emerald-400/50';

          return (
            <motion.div
              key={fx.id}
              initial={{ opacity: 0, y: 18, scale: 0.85 }}
              animate={{ opacity: 1, y: -12, scale: 1 }}
              exit={{ opacity: 0, y: -42, scale: 0.95 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className={`px-4 py-1.5 rounded-lg border text-sm font-bold font-mono-num shadow-xl backdrop-blur-sm ${colorClass}`}
            >
              {fx.label}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

interface SparkParticleBurstProps {
  triggerKey: number;
  color?: string;
}

const SPARK_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export const SparkParticleBurst: React.FC<SparkParticleBurstProps> = ({
  triggerKey,
  color = '#FBBF24',
}) => {
  if (triggerKey === 0) return null;

  return (
    <div
      key={triggerKey}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
    >
      {SPARK_ANGLES.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const tx = Math.cos(rad) * 44;
        const ty = Math.sin(rad) * 44;
        return (
          <motion.span
            key={angle}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{ opacity: 0, x: tx, y: ty, scale: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: color }}
          />
        );
      })}
    </div>
  );
};
