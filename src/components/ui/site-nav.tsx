"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Map,
  Radar,
  ScrollText,
  Trophy,
  UserRound,
} from "lucide-react";

const navItems = [
  { href: "/", label: "日历", icon: CalendarDays },
  { href: "/map", label: "地图", icon: Map },
  { href: "/flavor", label: "风味", icon: Radar },
  { href: "/seasons", label: "季节", icon: ScrollText },
  { href: "/achievements", label: "成就", icon: Trophy },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-background)_88%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-serif text-2xl text-[var(--color-charcoal)]"
          aria-label="Flaneur home"
        >
          Flaneur
        </Link>

        <nav className="flex flex-1 justify-end overflow-x-auto">
          <div className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex h-10 items-center gap-2 rounded-full px-3 text-sm transition",
                    isActive
                      ? "bg-[var(--color-primary)] text-white shadow-sm"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-soft)] hover:text-[var(--color-charcoal)]",
                  ].join(" ")}
                >
                  <Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <button
          type="button"
          className="grid size-10 shrink-0 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] shadow-sm transition hover:text-[var(--color-charcoal)]"
          aria-label="User profile"
        >
          <UserRound aria-hidden="true" className="size-5" strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
