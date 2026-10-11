import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generatePromoText } from "@/lib/promo.functions";
import { useT } from "@/lib/i18n";

export function PromoGenerator() {
  const { lang } = useT();
  const pt = lang === "pt";
  const run = useServerFn(generatePromoText);
  const [product, setProduct] = useState("");
  const [channel, setChannel] = useState("");
  const [tone, setTone] = useState(pt ? "Amigável" : "Friendly");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const input = "w-full rounded-[10px] px-3 py-2.5 text-sm bg-paper shadow-[0_0_0_1px_var(--input)] outline-none focus:shadow-[0_0_0_2px_var(--ember)]";
  const tones = pt ? ["Amigável", "Profissional", "Entusiasmado", "Direto"] : ["Friendly", "Professional", "Excited", "Direct"];

  function errText(code: number) {
    if (code === 429) return pt ? "Muitos pedidos. Aguarde um momento e tente de novo." : "Too many requests. Wait a moment and try again.";
    if (code === 402 || code === 403) return pt ? "Os créditos de IA esgotaram. Contacte o administrador." : "AI credits are exhausted. Contact the administrator.";
    return pt ? "Não foi possível gerar os textos. Tente novamente." : "Couldn't generate texts. Please try again.";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (product.trim().length < 5 || channel.trim().length < 2) {
      setErr(pt ? "Descreva o produto e o canal." : "Describe the product and channel."); return;
    }
    setBusy(true); setErr(null); setOut(""); setCopied(false);
    try {
      const r = await run({ data: { product, channel, tone, lang } });
      if (r.ok) setOut(r.text); else setErr(errText(r.code));
    } catch { setErr(errText(500)); }
    setBusy(false);
  }

  return (
    <div className="mt-3 grid md:grid-cols-2 gap-3">
      <form onSubmit={submit} className="card-line rounded-[14px] p-5 space-y-3">
        <label className="block text-[12px] text-sage">{pt ? "Produto ou oferta" : "Product or offer"}
          <textarea rows={4} maxLength={1500} value={product} onChange={(e) => setProduct(e.target.value)} placeholder={pt ? "Ex.: Klyntia AI Pro — atendimento automático no WhatsApp para lojas online, 14 dias grátis" : "E.g. Klyntia AI Pro — automated WhatsApp support for online stores, 14-day trial"} className={`${input} mt-1`} />
        </label>
        <label className="block text-[12px] text-sage">{pt ? "Canal de divulgação" : "Promotion channel"}
          <input maxLength={300} value={channel} onChange={(e) => setChannel(e.target.value)} placeholder={pt ? "Ex.: Instagram, email, grupo de WhatsApp" : "E.g. Instagram, email, WhatsApp group"} className={`${input} mt-1`} />
        </label>
        <div className="flex flex-wrap gap-2">
          {tones.map((t) => (
            <button type="button" key={t} onClick={() => setTone(t)} className={`px-3 py-1.5 rounded-full text-[11px] font-mono ${tone === t ? "bg-ink text-paper" : "shadow-[0_0_0_1px_var(--input)] text-sage"}`}>{t}</button>
          ))}
        </div>
        <button disabled={busy} className="btn-ember w-full disabled:opacity-60">{busy ? (pt ? "A gerar…" : "Generating…") : (pt ? "Gerar textos com IA" : "Generate with AI")}</button>
        {err && <p role="alert" className="text-[13px] text-destructive">{err}</p>}
      </form>
      <div className="card-line rounded-[14px] p-5 min-h-[220px]">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-[14px]">{pt ? "Textos gerados" : "Generated texts"}</p>
          {out && <button onClick={() => { navigator.clipboard.writeText(out); setCopied(true); }} className="btn-line text-[11px]">{copied ? (pt ? "Copiado" : "Copied") : (pt ? "Copiar" : "Copy")}</button>}
        </div>
        {busy && <p className="mt-4 text-[12px] font-mono text-sage klyntia-blink">{pt ? "A escrever…" : "Writing…"}</p>}
        {!busy && !out && <p className="mt-4 text-[12px] text-sage">{pt ? "Descreva o produto e o canal para receber 3 textos prontos a publicar." : "Describe the product and channel to get 3 ready-to-post texts."}</p>}
        {out && <p className="mt-4 text-[13px] whitespace-pre-wrap leading-relaxed">{out}</p>}
      </div>
    </div>
  );
}
