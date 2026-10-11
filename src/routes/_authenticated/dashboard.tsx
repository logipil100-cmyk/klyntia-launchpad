import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { checkIsAdmin } from "@/lib/admin.functions";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";
import { PromoGenerator } from "@/components/promo-generator";
import { AffiliateFinance } from "@/components/affiliate-finance";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Painel — Klyntia AI" },
      { name: "description", content: "Gerir o seu perfil e aceder às ferramentas da Klyntia AI." },
      { property: "og:title", content: "Painel — Klyntia AI" },
      { property: "og:description", content: "O seu painel Klyntia AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const profileSchema = z.object({ display_name: z.string().trim().max(80), company: z.string().trim().max(120) });

function Dashboard() {
  const { user } = Route.useRouteContext();
  const { lang } = useT();
  const pt = lang === "pt";
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [affiliate, setAffiliate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => { checkIsAdmin().then(setIsAdmin).catch(() => {}); }, []);



  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setName(data.display_name ?? ""); setCompany(data.company ?? ""); setAffiliate(data.is_affiliate);
      } else {
        const meta = user.user_metadata ?? {};
        const isAff = meta["affiliate"] === true || (sessionStorage.getItem("klyntia-affiliate") ?? sessionStorage.getItem("cd_affiliate")) === "1";
        const display = (meta["full_name"] || meta["name"] || (user.email ?? "").split("@")[0]) as string;
        await supabase.from("profiles").insert({ id: user.id, display_name: display, is_affiliate: isAff });
        sessionStorage.removeItem("klyntia-affiliate");
        sessionStorage.removeItem("cd_affiliate");
        setName(display); setAffiliate(isAff);
      }
      setLoading(false);
    })();
  }, [user]);

  async function save(e: FormEvent) {
    e.preventDefault();
    const parsed = profileSchema.safeParse({ display_name: name, company });
    if (!parsed.success) { setMsg({ ok: false, text: pt ? "Dados demasiado longos." : "Values too long." }); return; }
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ ...parsed.data, updated_at: new Date().toISOString() }).eq("id", user.id);
    setSaving(false);
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: pt ? "Perfil guardado." : "Profile saved." });
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const tools: [string, string][] = pt
    ? [["Caixa de entrada", "Todas as conversas num só lugar."], ["Agente de IA", "Configure respostas automáticas."], ["CRM", "Contactos e funil de vendas."], ["Integrações", "WhatsApp, Instagram e site."], ["Relatórios", "Desempenho da equipa e da IA."], ["Equipa", "Convide e gira utilizadores."]]
    : [["Inbox", "All conversations in one place."], ["AI agent", "Configure automatic replies."], ["CRM", "Contacts and sales pipeline."], ["Integrations", "WhatsApp, Instagram and web."], ["Reports", "Team and AI performance."], ["Team", "Invite and manage users."]];

  const input = "w-full rounded-[10px] px-3 py-2.5 text-sm bg-paper shadow-[0_0_0_1px_var(--input)] outline-none focus:shadow-[0_0_0_2px_var(--ember)]";
  return (
    <section className="py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">{pt ? "Painel" : "Dashboard"}{affiliate ? (pt ? " · Afiliado" : " · Affiliate") : ""}</p>
            <h1 className="font-display font-bold text-3xl md:text-4xl leading-tight">{pt ? "Olá" : "Hi"}{name ? `, ${name}` : ""}.</h1>
          </div>
          <div className="flex gap-2">
            {isAdmin && <Link to="/admin" className="btn-ink text-[12px]">Super Admin</Link>}
            <button onClick={logout} className="btn-line text-[12px]">{pt ? "Sair" : "Log out"}</button>
          </div>
        </div>

        <h2 className="mt-10 font-semibold">{pt ? "Ferramentas" : "Tools"}</h2>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
          {tools.map(([h, p]) => (
            <div key={h} className="card-line rounded-[14px] p-4">
              <p className="font-semibold text-[14px]">{h}</p>
              <p className="text-[12px] text-sage mt-1">{p}</p>
              <p className="mt-3 text-[10px] font-mono text-ember">{pt ? "Em breve" : "Coming soon"}</p>
            </div>
          ))}
        </div>

        {affiliate && (
          <>
            <h2 className="mt-10 font-semibold">{pt ? "Financeiro de afiliado" : "Affiliate finance"}</h2>
            <AffiliateFinance />
            <h2 className="mt-10 font-semibold">{pt ? "Gerador de textos promocionais" : "Promo text generator"}</h2>
            <PromoGenerator />
          </>
        )}

        <h2 className="mt-10 font-semibold">{pt ? "Perfil" : "Profile"}</h2>
        <form onSubmit={save} className="mt-3 card-line rounded-[14px] p-5 max-w-md space-y-3">
          <label className="block text-[12px] text-sage">Email<input disabled value={user.email ?? ""} className={`${input} mt-1 opacity-70`} /></label>
          <label className="block text-[12px] text-sage">{pt ? "Nome" : "Name"}<input disabled={loading} value={name} onChange={(e) => setName(e.target.value)} className={`${input} mt-1`} /></label>
          <label className="block text-[12px] text-sage">{pt ? "Empresa" : "Company"}<input disabled={loading} value={company} onChange={(e) => setCompany(e.target.value)} className={`${input} mt-1`} /></label>
          <button disabled={saving || loading} className="btn-ember w-full disabled:opacity-60">{saving ? "…" : pt ? "Guardar perfil" : "Save profile"}</button>
          {msg && <p className={`text-[13px] ${msg.ok ? "text-ink" : "text-destructive"}`}>{msg.text}</p>}
        </form>
      </div>
    </section>
  );
}
