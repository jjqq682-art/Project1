import React from 'react';
import { QuestStats } from '../types/quest';

interface StatRadarChartProps {
  stats: QuestStats;
  size?: number;
}

export const StatRadarChart: React.FC<StatRadarChartProps> = ({ stats, size = 210 }) => {
  const center = size / 2;
  const radius = size * 0.33;

  const axes = [
    { key: 'immersion' as const, label: '몰입도', angle: -Math.PI / 2 },
    { key: 'depth' as const, label: '사유력', angle: 0 },
    { key: 'resonance' as const, label: '감정 파동', angle: Math.PI / 2 },
    { key: 'lexicon' as const, label: '어휘 밀도', angle: Math.PI },
  ];

  const getPoint = (value: number, angle: number) => {
    const r = (Math.max(10, Math.min(100, value)) / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const polygonPoints = axes
    .map((axis) => {
      const pt = getPoint(stats[axis.key], axis.angle);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        role="img"
        aria-label={`독서 능력치 레이더 차트: 몰입도 ${stats.immersion}, 사유력 ${stats.depth}, 감정 파동 ${stats.resonance}, 어휘 밀도 ${stats.lexicon}`}
      >
        {/* Concentric diamond rings */}
        {gridLevels.map((lvl) => {
          const pts = axes
            .map((axis) => {
              const r = radius * lvl;
              return `${(center + r * Math.cos(axis.angle)).toFixed(1)},${(center + r * Math.sin(axis.angle)).toFixed(1)}`;
            })
            .join(' ');
          return (
            <polygon
              key={lvl}
              points={pts}
              fill="none"
              stroke="rgba(245, 241, 230, 0.14)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis lines */}
        {axes.map((axis) => (
          <line
            key={axis.key}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(axis.angle)}
            y2={center + radius * Math.sin(axis.angle)}
            stroke="rgba(245, 241, 230, 0.14)"
            strokeWidth="1"
          />
        ))}

        {/* Filled stat polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(245, 158, 11, 0.24)"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Vertex dots */}
        {axes.map((axis) => {
          const pt = getPoint(stats[axis.key], axis.angle);
          return (
            <circle
              key={axis.key}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill="#FBBF24"
              stroke="#0E1A16"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Labels */}
        {axes.map((axis) => {
          const labelR = radius + 22;
          const lx = center + labelR * Math.cos(axis.angle);
          const ly = center + labelR * Math.sin(axis.angle);
          const value = stats[axis.key];
          return (
            <g key={axis.key} transform={`translate(${lx}, ${ly})`}>
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-[#E2DDD0] text-[11px] font-medium"
              >
                {axis.label}
              </text>
              <text
                y="13"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-amber-400 text-[11px] font-semibold font-mono-num"
              >
                {value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
