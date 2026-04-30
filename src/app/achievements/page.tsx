const lockedBadges = Array.from({ length: 9 }, (_, index) => index + 1);

export default function AchievementsPage() {
  return (
    <section className="mx-auto max-w-lg animate-fade-in-up">
      <header className="mb-8 text-center">
        <h1 className="font-serif text-4xl text-charcoal">成就殿堂</h1>
        <p className="mt-2 text-sm text-muted">每一次品尝都是一枚勋章</p>
      </header>

      <div className="card grid grid-cols-3 gap-3 p-5">
        {lockedBadges.map((badge) => (
          <div
            key={badge}
            className="flex aspect-square flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-soft/60 text-muted"
          >
            <span className="font-serif text-3xl">?</span>
            <span className="mt-1 text-xs">未解锁</span>
          </div>
        ))}
      </div>

      <div className="card mt-5 p-5 text-center">
        <p className="text-sm text-muted">成就进度</p>
        <p className="mt-1 font-serif text-3xl text-charcoal">
          已解锁 0 / 15 枚徽章
        </p>
      </div>
    </section>
  );
}
