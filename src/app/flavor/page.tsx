export default function FlavorPage() {
  return (
    <section className="mx-auto max-w-lg animate-fade-in-up">
      <header className="mb-8 text-center">
        <h1 className="font-serif text-4xl text-charcoal">风味档案</h1>
        <p className="mt-2 text-sm text-muted">你的味觉人格画像</p>
      </header>

      <div className="card p-8">
        <div className="mx-auto grid size-56 place-items-center">
          <div className="relative size-48">
            <div className="absolute inset-0 clip-hexagon border border-dashed border-muted/40 bg-soft/40" />
            <div className="absolute inset-6 clip-hexagon border border-dashed border-muted/30" />
            <div className="absolute inset-12 clip-hexagon border border-dashed border-muted/20" />
            <div className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
          </div>
        </div>
        <p className="text-center text-sm text-muted">记录更多美食后生成雷达图</p>
      </div>

      <div className="card mt-5 grid grid-cols-2 gap-4 p-5 text-center">
        <div>
          <p className="text-sm text-muted">总记录</p>
          <p className="mt-1 font-serif text-3xl text-charcoal">0 条</p>
        </div>
        <div>
          <p className="text-sm text-muted">涉及菜系</p>
          <p className="mt-1 font-serif text-3xl text-charcoal">0 种</p>
        </div>
      </div>
    </section>
  );
}
