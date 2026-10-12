import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { Pricing, DemoInbox, Integrations, SectorCards } from "@/components/site";
import { openDemoChat } from "@/components/chat-widget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gnistrabot — Atendimento ao cliente com inteligência artificial" },
      { name: "description", content: "Gnistrabot combina inteligência artificial e atendimento humano para organizar conversas e apoiar a sua equipa no WhatsApp, Instagram e site." },
      { property: "og:title", content: "Gnistrabot — Atendimento ao cliente com inteligência artificial" },
      { property: "og:description", content: "Gnistrabot: inteligência artificial e equipas humanas, juntas num atendimento mais ágil e pessoal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useT();
  return (
    <>
      <section className="relative overflow-hidden">
        {/* textura subtil com as cores existentes */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_50%_at_85%_0%,var(--accent),transparent_70%)]" />
        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24 md:grid md:grid-cols-2 md:gap-12 lg:gap-16 md:items-center">
          <div>
            <p className="eyebrow mb-5">{t.hero.eyebrow}</p>
            <h1 className="font-display font-extrabold leading-[1.02] text-[2.5rem] md:text-[3.75rem] tracking-tight">
              <span className="klyntia-slide text-ember">Gnistrabot</span>
              <span className="block mt-3 text-[1.7rem] md:text-[2.5rem] leading-[1.15] text-balance">{t.hero.a} {t.hero.b}</span>
            </h1>
            <p className="mt-6 text-[15px] md:text-lg text-sage leading-relaxed max-w-[38ch]">{t.hero.sub}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-2.5">
              <Link to="/auth" search={{ mode: "up" }} className="btn-ember inline-flex items-center justify-center">{t.hero.cta}</Link>
              <button onClick={openDemoChat} className="btn-line inline-flex items-center justify-center">{t.hero.demo}</button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono text-sage">
              <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-ember" aria-hidden="true" />{t.hero.stat1}</span>
              <span aria-hidden="true">·</span><span>{t.hero.stat2}</span>
            </div>
          </div>
          <div className="hidden md:block klyntia-rise" style={{ animationDelay: ".15s" }}><DemoInbox /></div>
        </div>
      </section>

      <section className="bg-ink text-paper py-12 md:hidden">
        <div className="max-w-md mx-auto px-4">
          <p className="eyebrow mb-4">{t.demo.label}</p>
          <DemoInbox />
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight" data-reveal>{t.how.title}</h2>
          <ol className="mt-8 grid md:grid-cols-3 gap-3 md:gap-4">
            {t.how.items.map(([h, p], i) => (
              <li key={h} className="card-line p-6" data-reveal style={{ "--reveal-i": i } as React.CSSProperties}>
                <span className="font-display font-extrabold text-3xl text-ember" aria-hidden="true">{i + 1}</span>
                <p className="font-semibold mt-3">{h}</p>
                <p className="text-[13px] leading-relaxed text-sage mt-1.5">{p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-muted/40">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight" data-reveal>{t.feat.title}</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-3 md:gap-4">
            {t.feat.items.map(([h, p], i) => (
              <div key={h} className="card-line p-5 md:p-6 flex gap-4 items-start" data-reveal style={{ "--reveal-i": i } as React.CSSProperties}>
                <span className="size-10 shrink-0 bg-accent rounded-xl grid place-items-center font-mono text-ember text-[11px] shadow-[0_0_0_1px_var(--accent)]">0{i + 1}</span>
                <div><p className="font-semibold text-sm">{h}</p><p className="text-[13px] leading-relaxed text-sage mt-1">{p}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Integrations />
      <SectorCards />
      <Pricing />

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="card-flat p-6 md:p-10 md:grid md:grid-cols-2 md:gap-10 md:items-center" data-reveal>
            <div>
              <p className="eyebrow mb-4">{t.launch.label}</p>
              <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight">{t.launch.title}</h2>
              <p className="mt-3 text-[14px] leading-relaxed text-sage">{t.launch.sub}</p>
            </div>
            <div className="mt-6 md:mt-0">
              <ul className="space-y-3">
                {t.launch.perks.map((p) => (
                  <li key={p} className="flex gap-3 text-[14px] leading-relaxed">
                    <span className="mt-0.5 size-5 shrink-0 bg-accent shadow-[0_0_0_1px_var(--accent)] rounded-full grid place-items-center text-ember text-[10px] font-bold" aria-hidden="true">{"✓"}</span>
                    {p}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="mt-7 inline-flex btn-ember">{t.launch.cta}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight" data-reveal>{t.faq.title}</h2>
          <div className="mt-6 space-y-2 max-w-2xl">
            {t.faq.items.map(([q, a]) => (
              <details key={q} className="card-flat !rounded-xl group" data-reveal>
                <summary className="font-semibold text-sm cursor-pointer list-none flex items-center justify-between gap-4 px-4 py-3.5 select-none transition-colors group-hover:text-ember">{q}<span className="text-ember text-lg leading-none transition-transform duration-200 group-open:rotate-45" aria-hidden="true">+</span></summary>
                <p className="text-[13px] leading-relaxed text-sage px-4 pb-4">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ember text-paper py-14 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display font-extrabold text-[2.2rem] md:text-6xl leading-[0.95] tracking-tight" data-reveal>{t.cta.a}<br />{t.cta.b}</h2>
          <Link to="/auth" search={{ mode: "up" }} className="mt-8 inline-flex btn-ink" data-reveal>{t.cta.btn}</Link>
        </div>
      </section>
    </>
  );
}
