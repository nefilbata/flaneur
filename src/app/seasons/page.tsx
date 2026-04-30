const seasons = [
  { name: "春", tone: "bg-[#f6d7da]", text: "粉色调" },
  { name: "夏", tone: "bg-[#d7eee4]", text: "蓝绿色调" },
  { name: "秋", tone: "bg-[#efd2a7]", text: "橙棕色调" },
  { name: "冬", tone: "bg-[#d9e4ef]", text: "蓝灰色调" },
];

export default function SeasonsPage() {
  return (
    <section className="mx-auto max-w-lg animate-fade-in-up">
      <header className="mb-8 text-center">
        <h1 className="font-serif text-4xl text-charcoal">季节卷轴</h1>
        <p className="mt-2 text-sm text-muted">四季流转，美味不息</p>
      </header>

      <div className="card p-5">
        <div className="grid grid-cols-4 gap-2">
          {seasons.map((season) => (
            <button
              key={season.name}
              type="button"
              className={`${season.tone} rounded-2xl px-3 py-4 text-center transition hover:-translate-y-0.5`}
            >
              <span className="block font-serif text-2xl text-charcoal">
                {season.name}
              </span>
              <span className="mt-1 block text-[11px] text-muted">{season.text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card mt-5 p-8 text-center">
        <h2 className="font-serif text-2xl text-charcoal">暂无季节记录</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          当美食记录累积后，这里会按春夏秋冬展开成一卷横向画轴。
        </p>
      </div>
    </section>
  );
}
