"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Leaf, Map, Radar, Trophy } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navItems = [
  { href: "/", label: "\u9996\u9875", icon: CalendarDays },
  { href: "/map", label: "\u5730\u56fe", icon: Map },
  { href: "/flavor", label: "\u98ce\u5473", icon: Radar },
  { href: "/seasons", label: "\u5b63\u8282", icon: Leaf },
  { href: "/achievements", label: "\u6210\u5c31", icon: Trophy },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 hidden border-b border-border bg-background/90 backdrop-blur-xl md:block">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-8 px-8">
          <Link href="/" className="font-serif text-2xl text-charcoal">
            Fl{"\u00e2"}neur
          </Link>

          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 rounded-full border border-border bg-surface p-1 shadow-card">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  variant="desktop"
                />
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_rgba(44,44,44,0.08)] backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              pathname={pathname}
              variant="mobile"
            />
          ))}
        </div>
      </nav>
    </>
  );
}

function NavLink({
  item,
  pathname,
  variant,
}: {
  item: (typeof navItems)[number];
  pathname: string;
  variant: "desktop" | "mobile";
}) {
  const Icon = item.icon;
  const isActive =
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  if (variant === "mobile") {
    return (
      <Link
        href={item.href}
        className={[
          "flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] transition",
          isActive
            ? "bg-primary-strong text-surface shadow-sm"
            : "text-muted hover:bg-soft hover:text-charcoal",
        ].join(" ")}
      >
        <Icon aria-hidden="true" className="size-5" strokeWidth={1.5} />
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      className={[
        "flex h-10 items-center gap-2 rounded-full px-4 text-sm transition",
        isActive
          ? "bg-primary-strong text-surface shadow-sm"
          : "text-muted hover:bg-soft hover:text-charcoal",
      ].join(" ")}
    >
      <Icon aria-hidden="true" className="size-4" strokeWidth={1.5} />
      <span>{item.label}</span>
    </Link>
  );
}
