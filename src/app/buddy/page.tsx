"use client";

import { useState } from "react";
import { Heart, Map, Trophy, UsersRound, Utensils, BarChart3 } from "lucide-react";

const FEATURES = [
  {
    icon: Utensils,
    title: "\u5171\u540c\u8bb0\u5f55",
    text: "\u4e00\u8d77\u6253\u5361\u540c\u4e00\u672c\u7f8e\u98df\u65e5\u8bb0",
  },
  {
    icon: Map,
    title: "\u5171\u540c\u5730\u56fe",
    text: "\u70b9\u4eae\u540c\u4e00\u5f20\u57ce\u5e02\u5473\u89c9\u5730\u56fe",
  },
  {
    icon: BarChart3,
    title: "\u5473\u89c9\u5bf9\u6bd4",
    text: "\u770b\u770b\u4f60\u4eec\u7684\u53e3\u5473\u6709\u591a\u50cf",
  },
  {
    icon: Trophy,
    title: "\u5171\u540c\u6210\u5c31",
    text: "\u4e24\u4e2a\u4eba\u7684\u63a2\u7d22\u91cc\u7a0b\u7891",
  },
];

export default function BuddyPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="mx-auto max-w-3xl animate-fade-in-up pb-24">
      <header className="mb-8 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-soft text-primary-strong">
          <UsersRound className="size-8" strokeWidth={1.5} />
        </div>
        <h1 className="mt-4 font-serif text-4xl text-charcoal md:text-5xl">
          {"\u6f2b\u6e38\u642d\u6863"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          {"\u548c\u670b\u53cb\u4e00\u8d77\uff0c\u8bb0\u5f55\u5171\u540c\u7684\u5473\u89c9\u65c5\u7a0b"}
        </p>
      </header>

      <div className="card overflow-hidden p-6">
        <BuddyIllustration />
      </div>

      <div className="mt-6">
        <h2 className="font-serif text-2xl text-charcoal">
          {"\u5373\u5c06\u5f00\u653e\u7684\u529f\u80fd"}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-card bg-soft p-4">
              <Icon className="size-6 text-primary-strong" strokeWidth={1.5} />
              <h3 className="mt-3 font-serif text-xl text-charcoal">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="card mt-6 p-5">
        <h2 className="font-serif text-2xl text-charcoal">
          {"\u7559\u4e0b\u4f60\u7684\u671f\u5f85"}
        </h2>
        {submitted ? (
          <p className="mt-4 rounded-2xl bg-soft p-4 text-sm text-primary-strong">
            {"\u5df2\u6536\u5230\u4f60\u7684\u671f\u5f85 \ud83d\udc8c"}
          </p>
        ) : (
          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <input
              className="min-h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm text-charcoal placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder={"\u60f3\u548c\u8c01\u4e00\u8d77\u5403\uff1f"}
            />
            <button
              type="submit"
              className="min-h-11 rounded-xl bg-primary-strong px-5 text-sm font-medium text-surface"
            >
              {"\u63d0\u4ea4"}
            </button>
          </form>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        {"\u529f\u80fd\u5f00\u53d1\u4e2d\uff0c\u656c\u8bf7\u671f\u5f85"}
      </p>
    </section>
  );
}

function BuddyIllustration() {
  return (
    <svg viewBox="0 0 520 240" className="h-56 w-full" role="img" aria-label="Buddy illustration">
      <rect width="520" height="240" rx="24" fill="var(--color-background)" />
      <circle cx="205" cy="112" r="58" fill="#E8D5C4" />
      <circle cx="315" cy="112" r="58" fill="#C4CCD8" />
      <circle cx="205" cy="96" r="26" fill="var(--color-surface)" />
      <circle cx="315" cy="96" r="26" fill="var(--color-surface)" />
      <path
        d="M164 176c10-31 27-48 41-48s31 17 41 48"
        fill="none"
        stroke="var(--color-primary-strong)"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <path
        d="M274 176c10-31 27-48 41-48s31 17 41 48"
        fill="none"
        stroke="var(--color-primary-strong)"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <Heart
        x="242"
        y="95"
        width="36"
        height="36"
        fill="var(--color-primary-strong)"
        stroke="var(--color-primary-strong)"
      />
      <path
        d="M190 158 330 72M330 158 190 72"
        stroke="var(--color-muted)"
        strokeLinecap="round"
        strokeWidth="5"
        opacity="0.5"
      />
    </svg>
  );
}
