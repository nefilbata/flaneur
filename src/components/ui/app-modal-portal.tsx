"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type AppModalPortalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: "sheet" | "dialog";
  contentClassName?: string;
  overlayClassName?: string;
};

const baseContentClass =
  "relative z-10 max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1.5rem)] overflow-y-auto bg-surface shadow-[0_20px_70px_rgba(44,44,44,0.18)]";

const variantClass = {
  sheet:
    "w-full rounded-t-3xl md:mt-24 md:w-[min(680px,calc(100vw-4rem))] md:rounded-3xl",
  dialog:
    "mx-4 w-[min(680px,calc(100vw-2rem))] rounded-3xl",
};

export function AppModalPortal({
  isOpen,
  onClose,
  children,
  variant = "dialog",
  contentClassName = "",
  overlayClassName = "",
}: AppModalPortalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  const alignment =
    variant === "sheet"
      ? "items-end justify-center md:items-start"
      : "items-center justify-center";
  const initial =
    variant === "sheet"
      ? { y: "100%", opacity: 0.96 }
      : { y: 40, opacity: 0.96, scale: 0.98 };
  const animate =
    variant === "sheet"
      ? { y: 0, opacity: 1 }
      : { y: 0, opacity: 1, scale: 1 };
  const exit =
    variant === "sheet"
      ? { y: "100%", opacity: 0.96 }
      : { y: 40, opacity: 0.96, scale: 0.98 };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 z-[999] flex h-[100dvh] overflow-hidden px-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] ${alignment}`}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 bg-charcoal/35 backdrop-blur-sm ${overlayClassName}`}
            onClick={onClose}
          />
          <motion.div
            initial={initial}
            animate={animate}
            exit={exit}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`${baseContentClass} ${variantClass[variant]} ${contentClassName}`}
            onClick={(event) => event.stopPropagation()}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
