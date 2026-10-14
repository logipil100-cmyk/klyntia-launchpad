import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { Pricing, DemoInbox, Integrations, SectorCards } from "@/components/site";
import { openDemoChat } from "@/components/chat-widget";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gnistrabot — Atendimento ao cliente com inteligência artificial" },
      {
        name: "description",
        content:
          "Gnistrabot combina inteligência artificial e atendimento humano para organizar conversas e apoiar a sua equipa no WhatsApp, Instagram e site.",
      },
      {
        property: "og:title",
        content: "Gnistrabot — Atendimento ao cliente com inteligência artificial",
      },
      {
        property: "og:description",
        content:
          "Gnistrabot: inteligência artificial e equipas humanas, juntas num atendimento mais ágil e pessoal.",
      },
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
      <section className="section-frame overflow-hidden border-b border-border/60">
        <div className="pointer-events-none absolute inset-0 hairline-grid" aria-hidden="true" />
        <div className="section-shell relative pt-16 pb-20 md:grid md:grid-cols-[.9fr_1.1fr] md:gap-16 md:items-center md:pt-28 md:pb-28">
          <div>
            <p className="eyebrow mb-5">{t.hero.eyebrow}</p>
            <h1 className="hero-title max-w-[10ch] font-display font-extrabold">
              <span className="gnistrabot-slide text-ember">Gnistrabot</span>
              <span className="hero-subtitle block mt-4">
                {t.hero.a} {t.hero.b}
              </span>
            </h1>
            <p className="mt-7 max-w-[37ch] text-[15px] leading-7 text-sage md:text-lg">
              {t.hero.sub}
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-2.5">
              <Link to="/auth" search={{ mode: "up" }} className="btn-ember">
                {t.hero.cta}
              </Link>
              <button onClick={openDemoChat} className="btn-line">
                {t.hero.demo}
              </button>
            </div>
            <div className="mt-7 flex items-center gap-4 text-[11px] font-mono text-sage">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-ember" />
                {t.hero.stat1}
              </span>
              <span>·</span>
              <span>{t.hero.stat2}</span>
            </div>
            <div className="relative mt-8 max-w-[37rem] overflow-hidden rounded-[18px] border border-border/70 bg-ink shadow-[0_24px_70px_-34px_var(--ink)]">
              <img
                src="/ai-human-contact.webp"
                alt="Uma inteligência artificial a tocar num dedo humano"
                width={1280}
                height={714}
                className="gnistrabot-contact-motion aspect-[16/9] w-full object-cover opacity-90"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <DemoInbox />
          </div>
        </div>
      </section>

      <section className="proof-strip border-y border-border/60" aria-label="Gnistrabot highlights">
        <div className="max-w-6xl mx-auto px-4 py-5 md:py-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="proof-item">
            <span className="proof-value">24/7</span>
            <span className="proof-label">{t.hero.stat1}</span>
          </div>
          <div className="proof-item">
            <span className="proof-value">AI +</span>
            <span className="proof-label">{t.hero.stat2}</span>
          </div>
          <div className="proof-item hidden md:flex">
            <span className="proof-value">01</span>
            <span className="proof-label">{t.integ.items[0][0]}</span>
          </div>
          <div className="proof-item hidden md:flex">
            <span className="proof-value">∞</span>
            <span className="proof-label">{t.integ.items[1][0]}</span>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight">
            {t.how.title}
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {t.how.items.map(([h, p], i) => (
              <li key={h} className="card-line surface-lift min-h-52 p-6 md:p-7">
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
          <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight">
            {t.feat.title}
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {t.feat.items.map(([h, p], i) => (
              <div key={h} className="card-line surface-lift min-h-32 p-5 flex gap-3 items-start">
                <span className="size-9 shrink-0 bg-accent rounded-lg grid place-items-center font-mono text-ember text-[11px] shadow-[0_0_0_1px_var(--accent)]">
                  0{i + 1}
                </span>
                <div>
                  <p className="font-semibold text-sm">{h}</p>
                  <p className="text-[13px] text-sage mt-0.5">{p}</p>
                </div>
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
          <div className="card-line surface-lift p-7 md:p-12 md:grid md:grid-cols-2 md:gap-12 md:items-center">
            <div>
              <p className="eyebrow mb-4">{t.launch.label}</p>
              <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight">
                {t.launch.title}
              </h2>
              <p className="mt-3 text-[14px] text-sage leading-relaxed">{t.launch.sub}</p>
            </div>
            <div className="mt-6 md:mt-0">
              <ul className="space-y-3">
                {t.launch.perks.map((p) => (
                  <li key={p} className="flex gap-3 text-[14px]">
                    <span className="text-ember font-bold" aria-hidden="true">
                      {"✓"}
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="mt-6 inline-flex btn-ember">
                {t.launch.cta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight">
            {t.faq.title}
          </h2>
          <div className="mt-6 space-y-2 max-w-2xl">
            {t.faq.items.map(([q, a]) => (
              <details key={q} className="card-line p-4 group">
                <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between">
                  {q}
                  <span className="text-ember group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-[13px] text-sage mt-2">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-frame overflow-hidden bg-ember text-paper py-16 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display font-extrabold text-[2.2rem] md:text-6xl leading-[0.95]">
            {t.cta.a}
            <br />
            {t.cta.b}
          </h2>
          <Link to="/auth" search={{ mode: "up" }} className="mt-6 inline-flex btn-ink">
            {t.cta.btn}
          </Link>
        </div>
      </section>
    </>
  );
}
