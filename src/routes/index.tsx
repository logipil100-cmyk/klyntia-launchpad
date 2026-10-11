import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { Pricing, DemoInbox, Integrations, SectorCards } from "@/components/site";
import { openDemoChat } from "@/components/chat-widget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Klyntia AI — Atendimento ao cliente com inteligência artificial" },
      { name: "description", content: "Klyntia AI combina inteligência artificial e atendimento humano para organizar conversas e apoiar a sua equipa no WhatsApp, Instagram e site." },
      { property: "og:title", content: "Klyntia AI — Atendimento ao cliente com inteligência artificial" },
      { property: "og:description", content: "Klyntia AI: inteligência artificial e equipas humanas, juntas num atendimento mais ágil e pessoal." },
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
      <section className="overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-14 md:pt-20 md:pb-16 md:grid md:grid-cols-2 md:gap-12 md:items-center">
          <div>
            <p className="eyebrow mb-5">{t.hero.eyebrow}</p>
            <h1 className="font-display font-extrabold leading-tight text-[2.5rem] md:text-[4rem]">
              <span className="klyntia-slide text-ember">Klyntia AI</span>
              <span className="block mt-3 text-[1.75rem] md:text-[2.75rem] leading-tight">{t.hero.a} {t.hero.b}</span>
            </h1>
            <p className="mt-6 text-[15px] md:text-lg text-sage leading-relaxed max-w-[34ch]">{t.hero.sub}</p>
            <div className="mt-7 flex flex-col sm:flex-row gap-2.5">
              <Link to="/auth" search={{ mode: "up" }} className="btn-ember">{t.hero.cta}</Link>
              <button onClick={openDemoChat} className="btn-line">{t.hero.demo}</button>
            </div>
            <div className="mt-7 flex items-center gap-4 text-[11px] font-mono text-sage">
              <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-ember" />{t.hero.stat1}</span>
              <span>·</span><span>{t.hero.stat2}</span>
            </div>
          </div>
          <div className="hidden md:block"><DemoInbox /></div>
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
          <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight">{t.how.title}</h2>
          <ol className="mt-6 grid md:grid-cols-3 gap-3">
            {t.how.items.map(([h, p], i) => (
              <li key={h} className="card-line p-5">
                <span className="font-display font-extrabold text-3xl text-ember">{i + 1}</span>
                <p className="font-semibold mt-2">{h}</p>
                <p className="text-[13px] text-sage mt-1">{p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight">{t.feat.title}</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-3">
            {t.feat.items.map(([h, p], i) => (
              <div key={h} className="card-line p-4 flex gap-3 items-start">
                <span className="size-9 shrink-0 bg-accent rounded-lg grid place-items-center font-mono text-ember text-[11px] shadow-[0_0_0_1px_var(--accent)]">0{i + 1}</span>
                <div><p className="font-semibold text-sm">{h}</p><p className="text-[13px] text-sage mt-0.5">{p}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Integrations />
      <SectorCards />
      <Pricing />

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="card-line p-6 md:p-10 md:grid md:grid-cols-2 md:gap-10 md:items-center">
            <div>
              <p className="eyebrow mb-4">{t.launch.label}</p>
              <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight">{t.launch.title}</h2>
              <p className="mt-3 text-[14px] text-sage leading-relaxed">{t.launch.sub}</p>
            </div>
            <div className="mt-6 md:mt-0">
              <ul className="space-y-3">
                {t.launch.perks.map((p) => (
                  <li key={p} className="flex gap-3 text-[14px]">
                    <span className="text-ember font-bold" aria-hidden="true">{"✓"}</span>
                    {p}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="mt-6 inline-flex btn-ember">{t.launch.cta}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight">{t.faq.title}</h2>
          <div className="mt-6 space-y-2 max-w-2xl">
            {t.faq.items.map(([q, a]) => (
              <details key={q} className="card-line p-4 group">
                <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between">{q}<span className="text-ember group-open:rotate-45 transition-transform">+</span></summary>
                <p className="text-[13px] text-sage mt-2">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ember text-paper py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display font-extrabold text-[2.2rem] md:text-6xl leading-[0.95]">{t.cta.a}<br />{t.cta.b}</h2>
          <Link to="/auth" search={{ mode: "up" }} className="mt-6 inline-flex btn-ink">{t.cta.btn}</Link>
        </div>
      </section>
    </>
  );
}
