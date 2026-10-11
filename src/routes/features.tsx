import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { DemoInbox, Integrations } from "@/components/site";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Recursos — Klyntia AI" },
      { name: "description", content: "Agente de IA, CRM automático, automação de vendas, base de conhecimento e relatórios." },
      { property: "og:title", content: "Recursos — Klyntia AI" },
      { property: "og:description", content: "Tudo o que a Klyntia AI faz pela sua equipa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Features,
});

function Features() {
  const { t } = useT();
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 md:grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow mb-4">{t.nav.features}</p>
          <h1 className="font-display font-extrabold text-[2.6rem] md:text-6xl leading-[0.95]">{t.feat.title}</h1>
        </div>
        <div className="mt-8 md:mt-0"><DemoInbox /></div>
      </section>
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="font-display font-bold text-[1.7rem] md:text-4xl">{t.more.title}</h2>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[...t.feat.items, ...t.more.items].map(([h, p], i) => (
            <div key={h} className="card-line p-5">
              <span className="font-mono text-ember text-[11px]">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-semibold mt-2">{h}</p>
              <p className="text-[13px] text-sage mt-1">{p}</p>
            </div>
          ))}
        </div>
      </section>
      <Integrations />
    </>
  );
}
