"use client";

import { useMemo, useState } from "react";

const WHEEL_COLORS = [
  "#E8D5C4",
  "#D4C5A9",
  "#C9D4C5",
  "#C4CCD8",
  "#DCCDC4",
  "#D8C8A0",
  "#C4D4D0",
  "#D4BDB8",
];

interface SpinWheelProps {
  labels: string[];
  onResult: (label: string) => void;
}

export function SpinWheel({ labels, onResult }: SpinWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const segments = useMemo(() => {
    const slice = 360 / labels.length;
    return labels.map((label, index) => ({
      label,
      path: describeArc(120, 120, 112, index * slice, (index + 1) * slice),
      color: WHEEL_COLORS[index % WHEEL_COLORS.length],
      textAngle: index * slice + slice / 2,
    }));
  }, [labels]);

  const spin = () => {
    if (spinning || labels.length === 0) return;

    const winner = Math.floor(Math.random() * labels.length);
    const slice = 360 / labels.length;
    const landingAngle = winner * slice + slice / 2;
    const extraTurns = 4 + Math.floor(Math.random() * 2);
    const nextRotation = rotation + extraTurns * 360 + (270 - landingAngle);

    setSpinning(true);
    setRotation(nextRotation);
    window.setTimeout(() => {
      setSpinning(false);
      onResult(labels[winner]);
    }, 4100);
  };

  return (
    <div className="relative mx-auto size-[280px]">
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <path d="M14 27 3 4h22Z" fill="var(--color-primary-strong)" />
        </svg>
      </div>

      <svg
        viewBox="0 0 240 240"
        className="size-full drop-shadow-[0_14px_30px_rgba(44,44,44,0.12)]"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? "transform 4s cubic-bezier(0.2, 0.8, 0.3, 1)"
            : "none",
        }}
      >
        {segments.map((segment) => (
          <g key={segment.label}>
            <path
              d={segment.path}
              fill={segment.color}
              stroke="var(--color-surface)"
              strokeWidth="2"
            />
            <text
              x="120"
              y="34"
              textAnchor="middle"
              fill="var(--color-charcoal)"
              fontSize="12"
              fontWeight="700"
              transform={`rotate(${segment.textAngle} 120 120)`}
            >
              {segment.label}
            </text>
          </g>
        ))}
        <circle cx="120" cy="120" r="38" fill="var(--color-surface)" />
      </svg>

      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary-strong font-serif text-xl text-surface shadow-lg transition hover:scale-105 disabled:cursor-wait disabled:opacity-80"
      >
        {"\u8f6c"}!
      </button>
    </div>
  );
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${centerX} ${centerY}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}
