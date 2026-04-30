"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ScratchCardProps {
  width: number;
  height: number;
  coverColor?: string;
  revealThreshold?: number;
  onReveal?: () => void;
  children: React.ReactNode;
}

const BRUSH_RADIUS = 25;
const PARTICLES = Array.from({ length: 14 }, (_, index) => index);

export function ScratchCard({
  width,
  height,
  coverColor = "#C9A97C",
  revealThreshold = 0.6,
  onReveal,
  children,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const hasRevealedRef = useRef(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const drawCover = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    context.globalCompositeOperation = "source-over";
    context.clearRect(0, 0, width, height);
    context.fillStyle = coverColor;
    context.fillRect(0, 0, width, height);

    const sheen = context.createLinearGradient(0, 0, width, height);
    sheen.addColorStop(0, "rgba(255,255,255,0.28)");
    sheen.addColorStop(0.32, "rgba(255,255,255,0.08)");
    sheen.addColorStop(0.5, "rgba(100,70,35,0.12)");
    sheen.addColorStop(0.74, "rgba(255,255,255,0.16)");
    sheen.addColorStop(1, "rgba(120,85,45,0.16)");
    context.fillStyle = sheen;
    context.fillRect(0, 0, width, height);

    context.globalAlpha = 0.22;
    for (let y = -height; y < height * 2; y += 18) {
      context.beginPath();
      context.moveTo(-20, y);
      context.lineTo(width + 20, y + width * 0.28);
      context.strokeStyle = "rgba(255,255,255,0.35)";
      context.lineWidth = 1;
      context.stroke();
    }
    context.globalAlpha = 1;
  }, [coverColor, height, width]);

  useEffect(() => {
    drawCover();
  }, [drawCover]);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * width,
      y: ((event.clientY - rect.top) / rect.height) * height,
    };
  };

  const eraseAt = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context || hasRevealedRef.current) return;

      context.globalCompositeOperation = "destination-out";
      const gradient = context.createRadialGradient(x, y, 0, x, y, BRUSH_RADIUS);
      gradient.addColorStop(0, "rgba(0,0,0,1)");
      gradient.addColorStop(0.72, "rgba(0,0,0,0.82)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
      context.fill();
    },
    []
  );

  const calculateErasedRatio = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context) return 0;

    const pixels = context.getImageData(0, 0, width, height).data;
    let transparent = 0;
    for (let index = 3; index < pixels.length; index += 4) {
      if (pixels[index] < 20) transparent += 1;
    }
    return transparent / (width * height);
  }, [height, width]);

  const reveal = useCallback(() => {
    if (hasRevealedRef.current) return;
    hasRevealedRef.current = true;
    setIsRevealed(true);
    onReveal?.();
  }, [onReveal]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    const point = getPoint(event);
    eraseAt(point.x, point.y);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const point = getPoint(event);
    eraseAt(point.x, point.y);
    if (calculateErasedRatio() >= revealThreshold) {
      reveal();
    }
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  return (
    <div
      className="relative overflow-hidden rounded-card"
      style={{ width, height, touchAction: "none" }}
    >
      <div className="absolute inset-0 grid place-items-center">{children}</div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`absolute inset-0 z-10 cursor-grab transition-opacity duration-700 active:cursor-grabbing ${
          isRevealed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        onPointerLeave={stopDrawing}
        aria-label="Scratch to reveal"
      />
      {isRevealed && (
        <div className="pointer-events-none absolute inset-0 z-20">
          {PARTICLES.map((particle) => (
            <span
              key={particle}
              className="scratch-particle"
              style={
                {
                  "--angle": `${(360 / PARTICLES.length) * particle}deg`,
                  "--distance": `${42 + (particle % 4) * 12}px`,
                  animationDelay: `${particle * 28}ms`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
