import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { testMyAssistant } from "@/lib/assistant.functions";
import { useT } from "@/lib/i18n";

const schema = z.object({
  bot_name: z.string().trim().max(60),
  business_hours: z.string().trim().max(300),
  faq: z.string().trim().max(4000),
  tone: z.string().trim().max(60),
});

type Msg = { role: "user" | "assistant"; content: string };

export function AssistantSettings({ userId }: { userId: string }) {
  const { lang } = useT();
  const pt = lang === "pt";
  const test = useServerFn(testMyAssistant);
  const [f, setF] = useState({ bot_name: "", business_hours: "", faq: "", tone: "amigável" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("assistant_settings").select("*").eq("user_id", userId).maybeSingle().then(({ data }) => {
      if (data) setF({ bot_name: data.bot_name, business_hours: data.business_hours, faq: data.faq, tone: data.tone });
      setLoading(false);
    });
  }, [userId]);

  async function save(e: FormEvent) {
    e.preventDefault();
    const p = schema.safeParse(f);
    if (!p.success) { setNote({ ok: false, text: pt ? "Algum campo é demasiado longo." : "A field is too long." }); return; }
    setSaving(true);
    const { error } = await supabase.from("assistant_settings").upsert({ user_id: userId, ...p.data, updated_at: new Date().toISOString() });
    setSaving(false);
    setNote(error ? { ok: false, text: pt ? "Não foi possível guardar." : "Could not save." } : { ok: true, text: pt ? "Assistente guardado." : "Assistant saved." });
  }

  async function ask(e: FormEvent) {
    e.preventDefault();
    const content = q.trim();
    if (!content || busy) return;
    const next = [...msgs, { role: "user" as const, content }].slice(-20);
    setMsgs(next); setQ(""); setBusy(true);
    const r = await test({ data: { lang, messages: next } }).catch(() => ({ ok: false as const }));
    setMsgs([...next, { role: "assistant", content: r.ok ? r.text : pt ? "O assistente não respondeu. Tente de novo." : "No reply. Try again." }]);
    setBusy(false);
  }

  const input = "w-full rounded-[10px] px-3 py-2.5 text-sm bg-paper shadow-[0_0_0_1px_var(--input)] outline-none focus:shadow-[0_0_0_2px_var(--ember)]";
  const tones = pt ? ["amigável", "profissional", "descontraído", "formal"] : ["friendly", "professional", "casual", "formal"];

  return (
    <div className="mt-3 grid md:grid-cols-2 gap-4">
      <form onSubmit={save} className="card-line glow-card rounded-[14px] p-5 space-y-3">
        <label className="block text-[12px] text-sage">{pt ? "Nome do assistente" : "Assistant name"}
          <input disabled={loading} value={f.bot_name} onChange={(e) => setF({ ...f, bot_name: e.target.value })} placeholder="Ex.: Sofia" className={`${input} mt-1`} /></label>
        <label className="block text-[12px] text-sage">{pt ? "Horário de atendimento" : "Business hours"}
          <input disabled={loading} value={f.business_hours} onChange={(e) => setF({ ...f, business_hours: e.target.value })} placeholder={pt ? "Seg–Sex, 9h–18h" : "Mon–Fri, 9am–6pm"} className={`${input} mt-1`} /></label>
        <label className="block text-[12px] text-sage">{pt ? "Tom de voz" : "Tone of voice"}
          <select disabled={loading} value={f.tone} onChange={(e) => setF({ ...f, tone: e.target.value })} className={`${input} mt-1`}>
            {[...new Set([f.tone, ...tones])].map((t) => <option key={t} value={t}>{t}</option>)}
          </select></label>
        <label className="block text-[12px] text-sage">{pt ? "Perguntas frequentes e informação do negócio" : "FAQ and business info"}
          <textarea disabled={loading} rows={7} value={f.faq} onChange={(e) => setF({ ...f, faq: e.target.value })} placeholder={pt ? "P: Fazem entregas?\nR: Sim, em 24h na cidade." : "Q: Do you deliver?\nA: Yes, within 24h."} className={`${input} mt-1 resize-y`} /></label>
        <button disabled={saving || loading} className="btn-ember w-full disabled:opacity-60">{saving ? "…" : pt ? "Guardar assistente" : "Save assistant"}</button>
        {note && <p className={`text-[13px] ${note.ok ? "text-ink" : "text-destructive"}`}>{note.text}</p>}
      </form>
      <div className="card-line glow-card rounded-[14px] p-5 flex flex-col min-h-[22rem]">
        <p className="font-semibold text-[14px]">{pt ? "Testar o assistente" : "Test the assistant"}</p>
        <p className="text-[12px] text-sage">{pt ? "Guarde primeiro e depois escreva como se fosse um cliente." : "Save first, then write as a customer."}</p>
        <div className="mt-3 flex-1 space-y-2 overflow-y-auto max-h-72">
          {msgs.map((m, i) => (
            <p key={i} className={`text-[13px] rounded-[10px] px-3 py-2 max-w-[85%] ${m.role === "user" ? "ml-auto bg-ink text-paper" : "bg-paper shadow-[0_0_0_1px_var(--border)]"}`}>{m.content}</p>
          ))}
          {busy && <p className="text-[13px] text-sage">…</p>}
        </div>
        <form onSubmit={ask} className="mt-3 flex gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={600} placeholder={pt ? "Pergunta de cliente…" : "Customer question…"} className={input} />
          <button disabled={busy} className="btn-ember disabled:opacity-60">{pt ? "Enviar" : "Send"}</button>
        </form>
      </div>
    </div>
  );
}
