import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAdminOverview, updatePlan, decidePayout, type AdminOverview } from "@/lib/admin.functions";
import { useT } from "@/lib/i18n";
import { ProvidersAdmin } from "@/components/providers-admin";
import { SocialLinksAdmin } from "@/components/social-links-admin";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Super Admin — Gnistrabot" },
      { name: "description", content: "Centro de controlo da plataforma Gnistrabot." },
      { property: "og:title", content: "Super Admin — Gnistrabot" },
      { property: "og:description", content: "Planos, afiliados, levantamentos e auditoria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const usd = (c: number) => `$${(c / 100).toFixed(2)}`;
type Tab = "plans" | "affiliates" | "payouts" | "audit" | "providers" | "social";

function AdminPage() {
  const { lang } = useT();
  const pt = lang === "pt";
  const [data, setData] = useState<AdminOverview | null>(null);
  const [denied, setDenied] = useState(false);
  const [tab, setTab] = useState<Tab>("payouts");
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    try { setData(await getAdminOverview()); } catch { setDenied(true); }
  }
  useEffect(() => { load(); }, []);

  if (denied) return (
    <section className="py-20 max-w-md mx-auto px-4 text-center">
      <h1 className="font-display font-bold text-2xl">{pt ? "Acesso reservado" : "Restricted access"}</h1>
      <p className="text-sage text-[13px] mt-2">{pt ? "Esta área é só para administradores." : "This area is for administrators only."}</p>
      <Link to="/dashboard" className="btn-line mt-6 inline-block text-[13px]">{pt ? "Voltar ao painel" : "Back to dashboard"}</Link>
    </section>
  );
  if (!data) return <section className="py-20 text-center text-sage">…</section>;

  async function decide(id: string, decision: "paid" | "rejected") {
    setBusy(id); await decidePayout({ data: { id, decision } }); await load(); setBusy(null);
  }

  const tabs: [Tab, string][] = [["payouts", pt ? "Levantamentos" : "Payouts"], ["plans", pt ? "Planos" : "Plans"], ["affiliates", pt ? "Afiliados" : "Affiliates"], ["audit", pt ? "Auditoria" : "Audit"], ["providers", "Technology Providers"], ["social", pt ? "Redes sociais" : "Social links"]];
  const requested = data.payouts.filter((p) => p.status === "requested");
  const kpis: [string, string][] = [
    ["MRR", usd(data.mrrCents)],
    [pt ? "Assinaturas ativas" : "Active subscriptions", String(data.activeSubs)],
    [pt ? "Afiliados" : "Affiliates", String(data.affiliates.length)],
    [pt ? "Levantamentos pendentes" : "Pending payouts", `${requested.length} · ${usd(requested.reduce((a, p) => a + p.amount_cents, 0))}`],
  ];
  const statusLabel: Record<string, string> = { requested: pt ? "Pedido" : "Requested", paid: pt ? "Pago" : "Paid", rejected: pt ? "Recusado" : "Rejected" };

  return (
    <section className="py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        <p className="eyebrow mb-2">Super Admin</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl">{pt ? "Centro de controlo" : "Control center"}</h1>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map(([l, v]) => (
            <div key={l} className="card-line rounded-[14px] p-4">
              <p className="text-[11px] font-mono text-sage">{l}</p>
              <p className="font-display font-bold text-2xl mt-1">{v}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-sage">{pt ? "MRR calculado a partir das assinaturas ativas registadas. Ainda não há pagamentos ligados." : "MRR is computed from recorded active subscriptions. No payments connected yet."}</p>

        <div className="mt-8 flex gap-2 overflow-x-auto">
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`${tab === k ? "btn-ink" : "btn-line"} text-[12px] whitespace-nowrap`}>{l}</button>
          ))}
        </div>

        <div className="mt-4 card-line rounded-[14px] p-4 overflow-x-auto">
          {tab === "payouts" && (data.payouts.length === 0 ? <Empty pt={pt} /> : (
            <ul className="divide-y divide-border text-[13px] min-w-[560px]">
              {data.payouts.map((p) => (
                <li key={p.id} className="py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{p.affiliate} · {usd(p.amount_cents)}</p>
                    <p className="text-sage text-[12px] truncate">{p.method} — {p.details} · {new Date(p.created_at).toLocaleDateString(pt ? "pt-PT" : "en-US")}</p>
                  </div>
                  {p.status === "requested" ? (
                    <div className="flex gap-2">
                      <button disabled={busy === p.id} onClick={() => decide(p.id, "paid")} className="btn-ember text-[12px] disabled:opacity-60">{pt ? "Aprovar e marcar pago" : "Approve & mark paid"}</button>
                      <button disabled={busy === p.id} onClick={() => decide(p.id, "rejected")} className="btn-line text-[12px] disabled:opacity-60">{pt ? "Recusar" : "Reject"}</button>
                    </div>
                  ) : <span className="font-mono text-[12px]">{statusLabel[p.status] ?? p.status}</span>}
                </li>
              ))}
            </ul>
          ))}

          {tab === "providers" && <ProvidersAdmin />}

          {tab === "social" && <SocialLinksAdmin />}

          {tab === "plans" && <div className="space-y-3">{data.plans.map((p) => <PlanRow key={p.id} plan={p} pt={pt} onSaved={load} />)}</div>}

          {tab === "affiliates" && (data.affiliates.length === 0 ? <Empty pt={pt} /> : (
            <table className="w-full text-[13px] min-w-[560px]">
              <thead className="text-left text-sage text-[11px] font-mono"><tr><th className="py-2">{pt ? "Nome" : "Name"}</th><th>{pt ? "Código" : "Code"}</th><th>{pt ? "Cliques" : "Clicks"}</th><th>{pt ? "Conversões" : "Conversions"}</th><th>{pt ? "A pagar" : "Owed"}</th><th>{pt ? "Pago" : "Paid"}</th></tr></thead>
              <tbody className="divide-y divide-border">
                {data.affiliates.map((a) => <tr key={a.user_id}><td className="py-2">{a.name}</td><td className="font-mono">{a.code ?? "—"}</td><td>{a.clicks}</td><td>{a.conversions}</td><td>{usd(a.pendingCents)}</td><td>{usd(a.paidCents)}</td></tr>)}
              </tbody>
            </table>
          ))}

          {tab === "audit" && (data.audit.length === 0 ? <Empty pt={pt} /> : (
            <ul className="divide-y divide-border text-[13px]">
              {data.audit.map((a) => (
                <li key={a.id} className="py-2 flex justify-between gap-3">
                  <span><span className="font-mono">{a.action}</span> {a.target ? `· ${a.target.slice(0, 12)}` : ""}</span>
                  <span className="text-sage text-[12px]">{new Date(a.created_at).toLocaleString(pt ? "pt-PT" : "en-US")}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

function Empty({ pt }: { pt: boolean }) {
  return <p className="text-[13px] text-sage py-6 text-center">{pt ? "Ainda não há registos." : "Nothing here yet."}</p>;
}

function PlanRow({ plan, pt, onSaved }: { plan: AdminOverview["plans"][number]; pt: boolean; onSaved: () => void }) {
  const [name, setName] = useState(plan.name);
  const [price, setPrice] = useState((plan.price_monthly_cents / 100).toString());
  const [active, setActive] = useState(plan.active);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const input = "rounded-[10px] px-3 py-2 text-sm bg-paper shadow-[0_0_0_1px_var(--input)] outline-none focus:shadow-[0_0_0_2px_var(--ember)]";

  async function save() {
    const cents = Math.round(parseFloat(price) * 100);
    if (!name.trim() || !Number.isFinite(cents) || cents < 0) { setState("error"); return; }
    setState("saving");
    const r = await updatePlan({ data: { id: plan.id, name, price_monthly_cents: cents, active } }).catch(() => ({ ok: false }));
    setState(r.ok ? "saved" : "error");
    if (r.ok) onSaved();
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-[13px]">
      <input value={name} onChange={(e) => setName(e.target.value)} className={`${input} w-36`} aria-label={pt ? "Nome do plano" : "Plan name"} />
      <label className="flex items-center gap-1">$<input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" className={`${input} w-24`} aria-label={pt ? "Preço mensal" : "Monthly price"} />/{pt ? "mês" : "mo"}</label>
      <label className="flex items-center gap-1"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> {pt ? "Ativo" : "Active"}</label>
      <span className="text-sage">{plan.subscribers} {pt ? "assinantes" : "subscribers"}</span>
      <button onClick={save} disabled={state === "saving"} className="btn-ember text-[12px] disabled:opacity-60">{state === "saving" ? "…" : pt ? "Guardar" : "Save"}</button>
      {state === "saved" && <span className="text-[12px]">{pt ? "Guardado" : "Saved"}</span>}
      {state === "error" && <span className="text-[12px] text-destructive">{pt ? "Erro" : "Error"}</span>}
    </div>
  );
}
