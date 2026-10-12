import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { getSector } from "@/lib/sectors";
import { openDemoChat } from "@/components/chat-widget";

export const Route = createFileRoute("/solucoes/$sector")({
  loader: ({ params }) => {
    const sector = getSector(params.sector);
    if (!sector) throw notFound();
    return { slug: sector.slug };
  },
  head: ({ params }) => {
    const s = getSector(params.sector)?.copy.pt;
    const title = s ? `${s.name} — Gnistrabot` : "Gnistrabot";
    return {
      meta: [
        { title },
        { name: "description", content: s?.sub ?? "" },
        { property: "og:title", content: title },
        { property: "og:description", content: s?.sub ?? "" },
        { property: "og:type", content: "website" },
      ],
    };
  },
  component: SectorPage,
});

function SectorPage() {
  const { slug } = Route.useLoaderData();
  const { t, lang } = useT();
  const s = getSector(slug)!.copy[lang];
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 md:grid md:grid-cols-2 md:gap-12 md:items-center">
        <div>
          <p className="eyebrow mb-4">{s.name}</p>
          <h1 className="font-display font-extrabold text-[2.2rem] md:text-5xl leading-[1.02] text-balance">{s.title}</h1>
          <p className="mt-5 text-[15px] md:text-lg text-sage leading-relaxed max-w-[46ch]">{s.sub}</p>
          <div className="mt-7 flex flex-col sm:flex-row gap-2.5">
            <Link to="/auth" search={{ mode: "up" }} className="btn-ember inline-flex items-center justify-center">{t.hero.cta}</Link>
            <button onClick={openDemoChat} className="btn-line inline-flex items-center justify-center">{t.hero.demo}</button>
          </div>
        </div>
        <div className="mt-10 md:mt-0 card-flat p-5 space-y-2.5 text-[13px]" data-reveal>
          <p className="text-[11px] font-mono text-sage">{t.demo.label}</p>
          <p className="bg-muted rounded-xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%] leading-relaxed">{s.example.customer}</p>
          <p className="bg-ink text-paper rounded-xl rounded-tr-sm px-3.5 py-2.5 max-w-[85%] ml-auto w-fit leading-relaxed">{s.example.ai}</p>
          <p className="text-[10px] font-mono text-ember text-right">{t.demo.ai}</p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 pb-16 md:pb-24">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {s.pains.map(([h, p], i) => (
            <div key={h} className="card-line p-5 md:p-6" data-reveal style={{ "--reveal-i": i % 3 } as React.CSSProperties}>
              <span className="font-mono text-ember text-[11px]">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-semibold mt-2">{h}</p>
              <p className="text-[13px] leading-relaxed text-sage mt-1">{p}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
