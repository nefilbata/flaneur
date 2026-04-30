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
    return <div className="aspect-square" />;
  }

  const hasRecord = Boolean(record);
  const cover = record?.photos?.[0];

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={[
        "relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-2xl transition-all duration-200",
        isToday ? "ring-2 ring-primary-strong ring-offset-2 ring-offset-background" : "",
        hasRecord
          ? "shadow-md hover:shadow-lg"
          : "border-2 border-dashed border-border hover:border-primary/50 hover:bg-soft/50",
      ].join(" ")}
    >
      {cover ? (
        <>
          <Image
            src={cover.url}
            alt={record?.dishName ?? "美食记录"}
            fill
            sizes="80px"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-medium text-white drop-shadow-sm">
            {day}
          </span>
        </>
      ) : hasRecord ? (
        <div className="flex size-full flex-col items-center justify-center gap-0.5 bg-primary/15">
          <span className="text-lg">🍜</span>
          <span className="text-xs text-muted">{day}</span>
        </div>
      ) : (
        <span
          className={`text-sm ${isToday ? "font-semibold text-primary-strong" : "text-muted"}`}
        >
          {day}
        </span>
      )}

      {isToday && !hasRecord && (
        <span className="absolute bottom-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary-strong" />
      )}
    </motion.button>
  );
}
