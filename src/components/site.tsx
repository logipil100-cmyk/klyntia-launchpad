import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useSessionUser } from "@/hooks/use-session";
import { SECTORS } from "@/lib/sectors";
import { openDemoChat } from "@/components/chat-widget";

export function SectorCards() {
  const { t, lang } = useT();
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <p className="eyebrow mb-4">{t.sectors.label}</p>
        <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight">{t.sectors.title}</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-3">
          {SECTORS.map((s) => (
            <Link key={s.slug} to="/solucoes/$sector" params={{ sector: s.slug }} className="card-line p-5 flex flex-col gap-2 transition-shadow hover:shadow-[0_0_0_1px_var(--ember)]">
              <p className="font-semibold">{s.copy[lang].name}</p>
              <p className="text-[13px] text-sage flex-1">{s.copy[lang].title}</p>
              <span className="text-[12px] font-semibold text-ember">{t.sectors.more} {"→"}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="size-6 bg-ember rounded-[6px] grid place-items-center text-paper font-bold text-[11px] leading-none" aria-hidden="true">K</span>
      <span className="font-display font-bold text-[15px] ">Klyntia</span>
    </Link>
  );
}

export function SiteHeader() {
  const { t, lang, setLang } = useT();
  const user = useSessionUser();
  const navigate = useNavigate();
  const link = "text-sm text-sage hover:text-ink transition-colors";
  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur shadow-[0_1px_0_var(--border)]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7">
          <Link to="/features" className={link} activeProps={{ className: "text-ink" }}>{t.nav.features}</Link>
          <Link to="/pricing" className={link} activeProps={{ className: "text-ink" }}>{t.nav.pricing}</Link>
          <Link to="/contact" className={link} activeProps={{ className: "text-ink" }}>{t.nav.contact}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-full overflow-hidden text-[11px] font-medium shadow-[0_0_0_1px_var(--input)]">
            {(["pt", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-2.5 py-1 uppercase ${lang === l ? "bg-ink text-paper" : "text-sage"}`}>{l}</button>
            ))}
          </div>
          {user ? (
            <>
              <Link to="/dashboard" className="bg-ink text-paper text-[11px] font-semibold px-3 py-1.5 rounded-full">{lang === "pt" ? "Painel" : "Dashboard"}</Link>
              <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/", replace: true }); }} title={user.email ?? ""} className="text-[11px] text-sage px-1">{lang === "pt" ? "Sair" : "Log out"}</button>
            </>
          ) : (
            <Link to="/auth" className="bg-ink text-paper text-[11px] font-semibold px-3 py-1.5 rounded-full">{t.nav.login}</Link>
          )}
        </div>
      </div>
      <nav className="md:hidden flex gap-5 px-4 pb-2 text-xs">
        <Link to="/features" className={link}>{t.nav.features}</Link>
        <Link to="/pricing" className={link}>{t.nav.pricing}</Link>
        <Link to="/contact" className={link}>{t.nav.contact}</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const { t, lang } = useT();
  return (
    <footer className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <Logo />
        <div className="mt-5 card-line rounded-[14px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-[14px]">{lang === "pt" ? "Programa de afiliados" : "Affiliate program"}</p>
            <p className="text-[12px] text-sage">{lang === "pt" ? "Indique a Klyntia AI e ganhe comissões." : "Refer Klyntia AI and earn commissions."}</p>
          </div>
          <Link to="/affiliates" className="btn-ember text-[12px] text-center">{lang === "pt" ? "Criar conta de afiliado" : "Create affiliate account"}</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 md:flex md:gap-8 gap-y-2 text-[12px] text-sage">
          <Link to="/features">{t.nav.features}</Link>
          <Link to="/pricing">{t.nav.pricing}</Link>
          <Link to="/contact">{t.nav.contact}</Link>
          {SECTORS.map((s) => (
            <Link key={s.slug} to="/solucoes/$sector" params={{ sector: s.slug }}>{s.copy[lang].name}</Link>
          ))}
          <Link to="/privacy">{t.legal.privacy}</Link>
          <Link to="/terms">{t.legal.terms}</Link>
        </div>
        <p className="mt-6 text-[11px] font-mono text-sage">{lang === "pt" ? "© 2026 Klyntia. Todos os direitos reservados." : "© 2026 Klyntia. All rights reserved."}</p>
        <a href="mailto:support@klyntia.com" className="mt-2 inline-block text-[12px] text-sage">support@klyntia.com</a>
      </div>
    </footer>
  );
}

export function Pricing() {
  const { t } = useT();
  const [yearly, setYearly] = useState(false);
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-display font-bold text-[1.7rem] md:text-4xl leading-tight">{t.price.title}</h2>
        <p className="mt-2 text-[13px] text-sage">{t.price.note}</p>
        <div className="mt-4 flex items-center gap-2 text-[11px] font-mono">
          <button onClick={() => setYearly(false)} className={`px-3 py-1.5 rounded-full ${!yearly ? "bg-ink text-paper" : "shadow-[0_0_0_1px_var(--input)] text-sage"}`}>{t.price.monthly}</button>
          <button onClick={() => setYearly(true)} className={`px-3 py-1.5 rounded-full ${yearly ? "bg-ink text-paper" : "shadow-[0_0_0_1px_var(--input)] text-sage"}`}>{t.price.yearly}</button>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-3">
          {t.price.plans.map(([name, p, desc, feats], i) => {
            const pop = i === 1;
            const price = yearly ? Math.round(p * 0.8) : p;
            return (
              <div key={name} className={`relative rounded-[14px] p-5 ${pop ? "bg-ink text-paper" : "card-line"}`}>
                {pop && <span className="absolute -top-2 left-4 bg-ember text-paper text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{t.price.popular}</span>}
                <div className="flex items-center justify-between"><p className="font-semibold">{name}</p><p className="font-mono">{price} €<span className="text-sage text-[11px]">{t.price.per}</span></p></div>
                <p className="text-[12px] text-sage mt-1">{desc}</p>
                <ul className="mt-4 space-y-1.5 text-[13px]">
                  {feats.map((f) => <li key={f} className="flex gap-2"><span className="text-ember">—</span>{f}</li>)}
                </ul>
                {i === 2 ? (
                  <Link to="/contact" className="mt-5 block btn-line">{t.price.sales}</Link>
                ) : (
                  <Link to="/auth" search={{ mode: "up" }} className={`mt-5 block ${pop ? "btn-ember" : "btn-line"}`}>{`${t.price.choose} ${name}`}</Link>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-[11px] font-mono text-sage">{t.price.vat}</p>
      </div>
    </section>
  );
}

export function DemoInbox() {
  const { t } = useT();
  return (
    <div className="bg-paper text-ink rounded-2xl shadow-[0_0_0_1px_var(--border),0_20px_50px_-20px_var(--ink)] p-3 md:p-5">
      <div className="flex items-center justify-between border-b pb-2 mb-3">
        <span className="text-[11px] font-semibold">Klyntia AI · {t.demo.ch}</span>
        <span className="text-[10px] font-mono text-sage">online</span>
      </div>
      <div className="space-y-2 text-[12px] md:text-sm">
        <div className="bg-muted rounded-lg rounded-tl-sm px-3 py-2 max-w-[80%]">{t.demo.m1}</div>
        <div className="bg-accent shadow-[0_0_0_1px_var(--accent)] rounded-lg rounded-tr-sm px-3 py-2 max-w-[85%] ml-auto">{t.demo.m2}</div>
        <div className="bg-muted rounded-lg rounded-tl-sm px-3 py-2 max-w-[70%]">{t.demo.m3}</div>
        <div className="bg-accent rounded-lg rounded-tr-sm px-3 py-2 w-fit ml-auto flex items-center gap-1.5">{t.demo.m4} <span className="klyntia-blink text-ember">▍</span></div>
      </div>
      <div className="mt-3 pt-2 border-t flex items-center justify-between">
        <span className="text-[10px] font-mono text-sage">{t.demo.foot}</span>
        <span className="text-[10px] font-mono text-ember">{t.demo.ai}</span>
      </div>
      <button onClick={openDemoChat} className="mt-3 w-full btn-ink text-[12px] py-2">{t.demo.live}</button>
    </div>
  );
}

export function Integrations() {
  const { t } = useT();
  return (
    <section className="bg-ink text-paper py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <p className="eyebrow mb-4">{t.integ.label}</p>
        <div className="grid grid-cols-3 gap-2.5">
          {t.integ.items.map(([h, p]) => (
            <div key={h} className="bg-paper/5 shadow-[0_0_0_1px_oklch(1_0_0/10%)] rounded-[12px] p-3 md:p-6 text-center">
              <p className="font-semibold text-xs md:text-base">{h}</p><p className="text-[10px] md:text-xs text-sage mt-1">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
