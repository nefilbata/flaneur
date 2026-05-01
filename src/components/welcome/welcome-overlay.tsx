"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function WelcomeOverlay() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("flaneur_welcomed")) return;

    const showTimer = window.setTimeout(() => setShow(true), 0);
    const timers = [
      showTimer,
      window.setTimeout(() => setStep(1), 800),
      window.setTimeout(() => setStep(2), 2200),
      window.setTimeout(() => setStep(3), 3400),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const handleEnter = () => {
    localStorage.setItem("flaneur_welcomed", "true");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-6 text-center"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="font-serif text-6xl text-charcoal md:text-8xl"
          >
            Fl{"\u00e2"}neur
          </motion.h1>

          {step >= 1 && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-4 text-lg tracking-widest text-muted"
            >
              {"\u7528\u5473\u857e\u6f2b\u6e38\u57ce\u5e02"}
            </motion.p>
          )}

          {step >= 2 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="mt-8 text-sm text-primary-strong"
            >
              {"\u5473\u89c9\u662f\u4f60\u7684\u8d85\u80fd\u529b"}
            </motion.p>
          )}

          {step >= 3 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onClick={handleEnter}
              className="mt-12 rounded-full bg-primary-strong px-8 py-3 text-surface shadow-lg transition hover:shadow-xl"
            >
              {"\u5f00\u59cb\u63a2\u7d22"} →
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
