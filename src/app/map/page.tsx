import { MapPin } from "lucide-react";

export default function MapPage() {
  return (
    <section className="mx-auto max-w-lg animate-fade-in-up">
      <header className="mb-8 text-center">
        <h1 className="font-serif text-4xl text-charcoal">美食地图</h1>
        <p className="mt-2 text-sm text-muted">点亮你的城市味觉版图</p>
      </header>

      <div className="card p-8 text-center">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-soft text-primary-strong">
          <MapPin className="size-7" strokeWidth={1.5} />
        </div>
        <h2 className="font-serif text-2xl text-charcoal">地图功能开发中</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          去过的餐厅和区域会在这里慢慢亮起，敬请期待。
        </p>
      </div>

      <div className="card mt-5 p-5">
        <p className="text-sm text-muted">探索进度</p>
        <p className="mt-1 font-serif text-3xl text-charcoal">
          已探索 0 个区域
        </p>
      </div>
    </section>
  );
}
