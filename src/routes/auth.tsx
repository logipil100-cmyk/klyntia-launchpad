import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useT } from "@/lib/i18n";
import { useSessionUser } from "@/hooks/use-session";
import { GoogleIcon } from "@/components/google-icon";

type Mode = "in" | "up" | "forgot";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): { mode?: Mode; affiliate?: boolean } => {
    const m = s["mode"];
    const a = s["affiliate"];
    const out: { mode?: Mode; affiliate?: boolean } = {};
    if (m === "up" || m === "forgot") out.mode = m;
    if (a === "1" || a === 1 || a === true) out.affiliate = true;
    return out;
  },
  head: () => ({
    meta: [
      { title: "Entrar — Klyntia AI" },
      { name: "description", content: "Entre ou crie a sua conta Klyntia AI com email ou Google." },
      { property: "og:title", content: "Entrar — Klyntia AI" },
      { property: "og:description", content: "Entre ou crie a sua conta Klyntia AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email().max(255);
const schema = z.object({ email: emailSchema, password: z.string().min(6).max(72) });

function AuthPage() {
  const { lang } = useT();
  const pt = lang === "pt";
  const navigate = useNavigate();
  const search = Route.useSearch();
  const affiliate = !!search.affiliate;
  const user = useSessionUser();
  const [mode, setMode] = useState<Mode>(search.mode ?? "in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => { setMode(search.mode ?? "in"); }, [search.mode]);
  useEffect(() => { if (user) navigate({ to: "/dashboard", replace: true }); }, [user, navigate]);

  function switchMode(m: Mode) { setMode(m); setMsg(null); setSent(false); }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (mode === "forgot") {
      const parsed = emailSchema.safeParse(email);
      if (!parsed.success) { setMsg({ ok: false, text: pt ? "Introduza um email válido." : "Enter a valid email." }); return; }
      setBusy(true);
      const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, { redirectTo: `${window.location.origin}/reset-password` });
      setBusy(false);
      if (error) setMsg({ ok: false, text: error.message });
      else setSent(true);
      return;
    }
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setMsg({ ok: false, text: pt ? "Email válido e palavra-passe com 6+ caracteres." : "Valid email and a 6+ character password." });
      return;
    }
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword(parsed.data);
      if (error) setMsg({ ok: false, text: pt ? "Email ou palavra-passe incorretos." : "Wrong email or password." });
    } else {
      const { error } = await supabase.auth.signUp({
        ...parsed.data,
        options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: affiliate ? { affiliate: true } : {} },
      });
      if (error) setMsg({ ok: false, text: error.message });
      else setMsg({ ok: true, text: pt ? "Conta criada! Confirme pelo link enviado ao seu email." : "Account created! Confirm via the link sent to your email." });
    }
    setBusy(false);
  }

  async function google() {
    setMsg(null);
    if (affiliate) sessionStorage.setItem("klyntia-affiliate", "1");
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth` });
    if (r.error) setMsg({ ok: false, text: pt ? "Não foi possível entrar com o Google." : "Google sign-in failed." });
  }

  const input = "w-full rounded-[10px] px-3 py-2.5 text-sm bg-paper shadow-[0_0_0_1px_var(--input)] outline-none focus:shadow-[0_0_0_2px_var(--ember)]";
  const title =
    mode === "forgot" ? (pt ? "Recuperar palavra-passe." : "Reset your password.")
    : mode === "in" ? (pt ? "Bem-vindo de volta." : "Welcome back.")
    : affiliate ? (pt ? "Conta de afiliado." : "Affiliate account.")
    : (pt ? "Crie a sua conta." : "Create your account.");

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-sm mx-auto px-4">
        {affiliate && mode === "up" && <p className="eyebrow mb-2">{pt ? "Programa de afiliados" : "Affiliate program"}</p>}
        <h1 className="font-display font-bold text-3xl leading-tight">{title}</h1>

        {mode === "forgot" ? (
          sent ? (
            <div className="mt-6 card-line rounded-[12px] p-4 text-[14px]">
              <p className="font-semibold">{pt ? "Verifique o seu email." : "Check your email."}</p>
              <p className="text-sage mt-1">{pt ? `Se existir uma conta para ${email}, enviámos um link para definir uma nova palavra-passe.` : `If an account exists for ${email}, we sent a link to set a new password.`}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-3 mt-6">
              <p className="text-[13px] text-sage">{pt ? "Enviaremos um link para o seu email." : "We'll email you a reset link."}</p>
              <input type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
              <button disabled={busy} className="btn-ember w-full disabled:opacity-60">{busy ? "…" : pt ? "Enviar link" : "Send link"}</button>
            </form>
          )
        ) : (
          <>
            <button onClick={google} className="btn-line mt-6 w-full flex items-center justify-center gap-2">
              <GoogleIcon /> {pt ? "Continuar com o Google" : "Continue with Google"}
            </button>
            <div className="my-5 flex items-center gap-3 text-[11px] font-mono text-sage"><span className="h-px flex-1 bg-border" />{pt ? "ou" : "or"}<span className="h-px flex-1 bg-border" /></div>
            <form onSubmit={submit} className="space-y-3">
              <input type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
              <input type="password" autoComplete={mode === "in" ? "current-password" : "new-password"} placeholder={pt ? "Palavra-passe" : "Password"} value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
              {mode === "in" && (
                <button type="button" onClick={() => switchMode("forgot")} className="text-[12px] text-sage underline">{pt ? "Esqueceu a palavra-passe?" : "Forgot password?"}</button>
              )}
              <button disabled={busy} className="btn-ember w-full disabled:opacity-60">
                {busy ? "…" : mode === "in" ? (pt ? "Entrar" : "Log in") : (pt ? "Criar conta" : "Sign up")}
              </button>
            </form>
          </>
        )}
        {msg && <p className={`mt-3 text-[13px] ${msg.ok ? "text-ink" : "text-destructive"}`}>{msg.text}</p>}
        <p className="mt-6 text-[13px] text-sage">
          {mode === "up" ? (pt ? "Já tem conta?" : "Already have an account?") : mode === "forgot" ? (pt ? "Lembrou-se?" : "Remembered it?") : (pt ? "Ainda não tem conta?" : "No account yet?")}{" "}
          <button onClick={() => switchMode(mode === "in" ? "up" : "in")} className="text-ink font-semibold underline">
            {mode === "in" ? (pt ? "Criar conta" : "Sign up") : (pt ? "Entrar" : "Log in")}
          </button>
        </p>
      </div>
    </section>
  );
}
