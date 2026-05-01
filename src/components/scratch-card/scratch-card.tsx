"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ScratchCardProps {
  width: number;
  height: number;
  revealThreshold?: number;
  onReveal?: () => void;
  children: React.ReactNode;
}

const BRUSH_RADIUS = 22;
const PARTICLES = Array.from({ length: 14 }, (_, index) => index);

export function ScratchCard({
  width,
  height,
  revealThreshold = 0.5,
  onReveal,
  children,
}: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const hasRevealedRef = useRef(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const drawCover = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.globalCompositeOperation = "source-over";
    context.clearRect(0, 0, width, height);

    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#C4A882");
    gradient.addColorStop(1, "#B8997A");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < imageData.data.length; index += 4) {
      const noise = (Math.random() - 0.5) * 12;
      imageData.data[index] = Math.max(0, Math.min(255, imageData.data[index] + noise));
      imageData.data[index + 1] = Math.max(
        0,
        Math.min(255, imageData.data[index + 1] + noise)
      );
      imageData.data[index + 2] = Math.max(
        0,
        Math.min(255, imageData.data[index + 2] + noise)
      );
    }
    context.putImageData(imageData, 0, 0);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sheen = context.createLinearGradient(0, 0, width, height);
    sheen.addColorStop(0, "rgba(255, 250, 243, 0.32)");
    sheen.addColorStop(0.45, "rgba(255, 250, 243, 0.08)");
    sheen.addColorStop(1, "rgba(139, 115, 85, 0.18)");
    context.fillStyle = sheen;
    context.fillRect(0, 0, width, height);

    context.fillStyle = "rgba(255, 250, 243, 0.78)";
    context.font = "600 15px system-ui, sans-serif";
    context.textAlign = "center";
    context.fillText("刮一刮", width / 2, height / 2 - 6);
    context.font = "12px system-ui, sans-serif";
    context.fillText("揭开新的味觉勋章", width / 2, height / 2 + 20);
  }, [height, width]);

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

  const eraseAt = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context || hasRevealedRef.current) return;

    context.globalCompositeOperation = "destination-out";
    const gradient = context.createRadialGradient(x, y, 0, x, y, BRUSH_RADIUS);
    gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    gradient.addColorStop(0.72, "rgba(0, 0, 0, 0.85)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    context.fill();
  }, []);

  const calculateErasedRatio = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !context) return 0;

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let transparent = 0;
    let total = 0;
    for (let index = 3; index < pixels.length; index += 16) {
      total += 1;
      if (pixels[index] < 20) transparent += 1;
    }
    return total === 0 ? 0 : transparent / total;
  }, []);

  const reveal = useCallback(() => {
    if (hasRevealedRef.current) return;
    hasRevealedRef.current = true;
    setIsRevealed(true);
    onReveal?.();
  }, [onReveal]);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    isDrawingRef.current = true;
    const point = getPoint(event);
    eraseAt(point.x, point.y);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    event.preventDefault();
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
      <motion.div
        animate={isRevealed ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute inset-0 grid place-items-center"
      >
        {children}
      </motion.div>

      <AnimatePresence>
        {!isRevealed && (
          <motion.canvas
            ref={canvasRef}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrawing}
            onPointerCancel={stopDrawing}
            onPointerLeave={stopDrawing}
            aria-label="刮开成就卡"
          />
        )}
      </AnimatePresence>

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
