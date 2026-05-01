"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { DEMO_RECORDS } from "@/lib/demo-records";
import type { FoodRecord } from "@/types/food-record";
import { SpinWheel } from "@/components/spin-wheel/spin-wheel";

interface SpinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SpinModal({ isOpen, onClose }: SpinModalProps) {
  const labels = useMemo(() => getCuisineLabels(DEMO_RECORDS), []);
  const [result, setResult] = useState<string | null>(null);
  const recommendation = result
    ? getTopRecordByCuisine(DEMO_RECORDS, result)
    : undefined;

  const handleClose = () => {
    setResult(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-charcoal/45 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute inset-x-4 top-1/2 mx-auto max-w-md -translate-y-1/2 rounded-card border border-border bg-surface p-5 shadow-card-hover"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-soft text-muted transition hover:bg-border"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>

            <div className="mb-5 pr-10 text-center">
              <h2 className="font-serif text-3xl text-charcoal">
                {"\u4eca\u5929\u5403\u4ec0\u4e48\uff1f"}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {"\u8ba9\u5473\u857e\u6765\u62cd\u677f"}
              </p>
            </div>

            <SpinWheel
              labels={labels}
              onResult={(label) => {
                setResult(label);
              }}
            />

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="mt-5 rounded-2xl bg-background p-4 text-center"
                >
                  <p className="font-serif text-2xl text-charcoal">
                    {"\u4eca\u5929\u8bd5\u8bd5"} {result} {"\u5427"}
                  </p>
                  {recommendation && (
                    <p className="mt-2 text-sm leading-6 text-muted">
                      {"\u63a8\u8350\uff1a"}
                      <span className="text-charcoal">{recommendation.dishName}</span>
                      {" @ "}
                      {recommendation.restaurantName}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function getCuisineLabels(records: FoodRecord[]) {
  return [...new Set(records.flatMap((record) => record.cuisineTags))].slice(0, 8);
}

function getTopRecordByCuisine(records: FoodRecord[], cuisine: string) {
  return [...records]
    .filter((record) => record.cuisineTags.includes(cuisine))
    .sort((a, b) => (b.overallRating ?? 0) - (a.overallRating ?? 0))[0];
}
