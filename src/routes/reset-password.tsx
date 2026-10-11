import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova palavra-passe — Klyntia AI" },
      { name: "description", content: "Defina uma nova palavra-passe para a sua conta Klyntia AI." },
      { property: "og:title", content: "Nova palavra-passe — Klyntia AI" },
      { property: "og:description", content: "Defina uma nova palavra-passe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPage,
});

function ResetPage() {
  const { lang } = useT();
  const pt = lang === "pt";
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((e, s) => { if (e === "PASSWORD_RECOVERY" || s) setReady(true); });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (pw.length < 6 || pw.length > 72) { setMsg({ ok: false, text: pt ? "Use 6 ou mais caracteres." : "Use 6 or more characters." }); return; }
    if (pw !== pw2) { setMsg({ ok: false, text: pt ? "As palavras-passe não coincidem." : "Passwords don't match." }); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) { setMsg({ ok: false, text: error.message }); return; }
    setMsg({ ok: true, text: pt ? "Palavra-passe atualizada!" : "Password updated!" });
    setTimeout(() => navigate({ to: "/dashboard", replace: true }), 1200);
  }

  const input = "w-full rounded-[10px] px-3 py-2.5 text-sm bg-paper shadow-[0_0_0_1px_var(--input)] outline-none focus:shadow-[0_0_0_2px_var(--ember)]";
  return (
    <section className="py-12 md:py-20">
      <div className="max-w-sm mx-auto px-4">
        <h1 className="font-display font-bold text-3xl leading-tight">{pt ? "Nova palavra-passe." : "New password."}</h1>
        {!ready ? (
          <p className="mt-6 text-[14px] text-sage">
            {pt ? "Abra esta página pelo link enviado ao seu email." : "Open this page from the link sent to your email."}{" "}
            <Link to="/auth" search={{ mode: "forgot" }} className="text-ink underline">{pt ? "Pedir novo link" : "Request a new link"}</Link>
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-3 mt-6">
            <input type="password" autoComplete="new-password" placeholder={pt ? "Nova palavra-passe" : "New password"} value={pw} onChange={(e) => setPw(e.target.value)} className={input} />
            <input type="password" autoComplete="new-password" placeholder={pt ? "Confirmar palavra-passe" : "Confirm password"} value={pw2} onChange={(e) => setPw2(e.target.value)} className={input} />
            <button disabled={busy} className="btn-ember w-full disabled:opacity-60">{busy ? "…" : pt ? "Guardar" : "Save"}</button>
          </form>
        )}
        {msg && <p className={`mt-3 text-[13px] ${msg.ok ? "text-ink" : "text-destructive"}`}>{msg.text}</p>}
      </div>
    </section>
  );
}
