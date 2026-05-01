"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { FoodRecord } from "@/types/food-record";

interface DayCellProps {
  day: number | null;
  isToday: boolean;
  record?: FoodRecord;
  onClick?: () => void;
}

export function DayCell({ day, isToday, record, onClick }: DayCellProps) {
  if (day === null) {
    return <div className="aspect-square min-h-9 sm:min-h-11" />;
  }

  const hasRecord = Boolean(record);
  const cover = record?.photos?.[0];

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={[
        "relative flex aspect-square min-h-9 cursor-pointer items-center justify-center overflow-hidden rounded-xl transition-all duration-200 sm:min-h-11 sm:rounded-2xl",
        isToday
          ? "ring-1 ring-primary-strong ring-offset-1 ring-offset-background sm:ring-2 sm:ring-offset-2"
          : "",
        hasRecord
          ? "shadow-md hover:shadow-lg"
          : "border border-dashed border-border hover:border-primary/50 hover:bg-soft/50 sm:border-2",
      ].join(" ")}
    >
      {cover ? (
        <>
          <Image
            src={cover.url}
            alt={record?.dishName ?? "美食记录"}
            fill
            sizes="(max-width: 480px) 42px, 80px"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/45 via-transparent to-transparent" />
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[11px] font-medium text-surface drop-shadow-sm sm:bottom-1 sm:text-xs">
            {day}
          </span>
        </>
      ) : hasRecord ? (
        <div className="flex size-full flex-col items-center justify-center gap-0.5 bg-primary/15">
          <span className="text-base sm:text-lg">🍳</span>
          <span className="text-[11px] text-muted sm:text-xs">{day}</span>
        </div>
      ) : (
        <span
          className={`text-[13px] sm:text-sm ${
            isToday ? "font-semibold text-primary-strong" : "text-muted"
          }`}
        >
          {day}
        </span>
      )}

      {isToday && !hasRecord && (
        <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary-strong sm:bottom-1.5 sm:size-1.5" />
      )}
    </motion.button>
  );
}
