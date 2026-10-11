import { useT } from "@/lib/i18n";

export type LegalContent = Record<"pt" | "en", { title: string; updated: string; sections: [string, string][] }>;

export function LegalPage({ content }: { content: LegalContent }) {
  const { lang } = useT();
  const c = content[lang];
  return (
    <article className="max-w-2xl mx-auto px-4 py-12 md:py-20">
      <h1 className="font-display font-extrabold text-[2.2rem] md:text-5xl leading-tight">{c.title}</h1>
      <p className="mt-2 text-[12px] font-mono text-sage">{c.updated}</p>
      <div className="mt-8 space-y-6">
        {c.sections.map(([h, p]) => (
          <section key={h}>
            <h2 className="font-semibold text-lg">{h}</h2>
            <p className="mt-2 text-[14px] text-sage leading-relaxed">{p}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
