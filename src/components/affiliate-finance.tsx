import { useEffect, useState, type FormEvent } from "react";
import { getAffiliateStats, requestPayout, type AffiliateStats } from "@/lib/affiliate.functions";
import { useT } from "@/lib/i18n";

const usd = (c: number) => `$${(c / 100).toFixed(2)}`;

export function AffiliateFinance() {
  const { lang } = useT();
  const pt = lang === "pt";
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState("PayPal");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function load() {
    try { setStats(await getAffiliateStats()); setErr(false); } catch { setErr(true); }
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  if (loading) return <div className="mt-3 card-line rounded-[14px] p-5 text-[13px] text-sage">…</div>;
  if (err || !stats) return <div className="mt-3 card-line rounded-[14px] p-5 text-[13px] text-destructive">{pt ? "Não foi possível carregar os dados." : "Could not load data."}</div>;

  const link = `${window.location.origin}/?ref=${stats.code}`;
  const canRequest = stats.pendingCents >= stats.minPayoutCents;

  async function copy() {
    await navigator.clipboard.writeText(link);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (details.trim().length < 3) { setMsg({ ok: false, text: pt ? "Indique os dados para receber." : "Enter your payout details." }); return; }
    setBusy(true);
    const r = await requestPayout({ data: { method, details } }).catch(() => ({ ok: false, reason: "error" }));
    setBusy(false);
    if (r.ok) { setMsg({ ok: true, text: pt ? "Pedido enviado. Será analisado em breve." : "Request sent. It will be reviewed soon." }); setOpen(false); setDetails(""); load(); }
    else setMsg({ ok: false, text: r.reason === "min" ? (pt ? "Saldo insuficiente." : "Insufficient balance.") : (pt ? "Não foi possível enviar o pedido." : "Could not send request.") });
  }

  const cards: [string, string][] = [
    [pt ? "Cliques" : "Clicks", String(stats.clicks)],
    [pt ? "Conversões" : "Conversions", String(stats.conversions)],
    [pt ? "Comissões pendentes" : "Pending commissions", usd(stats.pendingCents)],
    [pt ? "Em levantamento" : "Being paid out", usd(stats.requestedCents)],
  ];
  const statusLabel = (s: string) => ({ requested: pt ? "Pedido" : "Requested", paid: pt ? "Pago" : "Paid", rejected: pt ? "Recusado" : "Rejected" } as Record<string, string>)[s] ?? s;
  const input = "w-full rounded-[10px] px-3 py-2.5 text-sm bg-paper shadow-[0_0_0_1px_var(--input)] outline-none focus:shadow-[0_0_0_2px_var(--ember)]";

  return (
    <div className="mt-3 space-y-3">
      <div className="card-line rounded-[14px] p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-mono text-sage">{pt ? "O seu link exclusivo" : "Your unique link"}</p>
          <p className="text-[14px] font-semibold truncate">{link}</p>
        </div>
        <button onClick={copy} className="btn-line text-[12px]">{copied ? (pt ? "Copiado" : "Copied") : (pt ? "Copiar link" : "Copy link")}</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map(([l, v]) => (
          <div key={l} className="card-line rounded-[14px] p-4">
            <p className="text-[11px] font-mono text-sage">{l}</p>
            <p className="font-display font-bold text-2xl mt-1">{v}</p>
          </div>
        ))}
      </div>

      <div className="card-line rounded-[14px] p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[13px] text-sage">
            {pt ? `Total já pago: ${usd(stats.paidCents)} · Mínimo para levantar: ${usd(stats.minPayoutCents)}` : `Paid so far: ${usd(stats.paidCents)} · Minimum payout: ${usd(stats.minPayoutCents)}`}
          </p>
          <button disabled={!canRequest} onClick={() => setOpen((o) => !o)} className="btn-ember text-[13px] disabled:opacity-50">
            {pt ? "Solicitar levantamento" : "Request payout"}
          </button>
        </div>
        {open && (
          <form onSubmit={submit} className="mt-4 grid sm:grid-cols-[160px_1fr_auto] gap-3">
            <select value={method} onChange={(e) => setMethod(e.target.value)} className={input}>
              {["PayPal", "Wise", pt ? "Transferência bancária" : "Bank transfer"].map((m) => <option key={m}>{m}</option>)}
            </select>
            <input value={details} maxLength={300} onChange={(e) => setDetails(e.target.value)} placeholder={pt ? "Email PayPal/Wise ou IBAN" : "PayPal/Wise email or IBAN"} className={input} />
            <button disabled={busy} className="btn-ember text-[13px] disabled:opacity-60">{busy ? "…" : (pt ? `Pedir ${usd(stats.pendingCents)}` : `Request ${usd(stats.pendingCents)}`)}</button>
          </form>
        )}
        {msg && <p className={`mt-3 text-[13px] ${msg.ok ? "text-ink" : "text-destructive"}`}>{msg.text}</p>}
        {stats.payouts.length > 0 && (
          <ul className="mt-4 divide-y divide-border text-[13px]">
            {stats.payouts.map((p) => (
              <li key={p.id} className="py-2 flex justify-between gap-3">
                <span>{new Date(p.created_at).toLocaleDateString(pt ? "pt-PT" : "en-US")} · {p.method}</span>
                <span className="font-mono">{usd(p.amount_cents)} · {statusLabel(p.status)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
