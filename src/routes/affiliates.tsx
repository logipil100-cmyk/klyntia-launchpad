import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useT } from "@/lib/i18n";
import { GoogleIcon } from "@/components/google-icon";

export const Route = createFileRoute("/affiliates")({
  head: () => ({
    meta: [
      { title: "Programa de afiliados — Klyntia AI" },
      { name: "description", content: "Torne-se afiliado da Klyntia AI: ganhe na primeira assinatura e a cada 3 meses com o cliente ativo." },
      { property: "og:title", content: "Programa de afiliados — Klyntia AI" },
      { property: "og:description", content: "Indique a Klyntia AI e ganhe comissões. Cadastro gratuito." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AffiliatesPage,
});

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
  channel: z.string().trim().max(200).optional(),
});

function AffiliatesPage() {
  const { lang } = useT();
  const pt = lang === "pt";
  const [form, setForm] = useState({ name: "", email: "", password: "", channel: "" });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const r = schema.safeParse(form);
    if (!r.success) { setErr(pt ? "Verifique os campos (senha com 6+ caracteres)." : "Check the fields (password 6+ chars)."); return; }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: r.data.email,
      password: r.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { affiliate: true, display_name: r.data.name, channel: r.data.channel ?? "" },
      },
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setSent(true);
  }

  async function google() {
    sessionStorage.setItem("klyntia-affiliate", "1");
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (res.error) setErr(res.error.message);
  }

  const perks = pt
    ? [["Comissão garantida", "Ganhe na primeira assinatura do cliente indicado e volte a ganhar a cada 3 meses em que ele se mantiver ativo."], ["Link exclusivo", "Partilhe o seu link nas redes, blog ou com clientes."], ["Painel próprio", "Acompanhe a sua conta no painel da Klyntia AI."]]
    : [["Guaranteed commission", "Earn on your referred customer's first subscription, and earn again every 3 months they stay active."], ["Unique link", "Share it on social, your blog or with clients."], ["Own dashboard", "Track your account in the Klyntia AI dashboard."]];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
      <section>
        <p className="eyebrow mb-2">{pt ? "Programa de afiliados" : "Affiliate program"}</p>
        <h1 className="font-display font-bold text-[2rem] md:text-5xl leading-tight">
          {pt ? "Indique a Klyntia AI e ganhe comissões." : "Refer Klyntia AI and earn commissions."}
        </h1>
        <ul className="mt-8 space-y-4">
          {perks.map(([t, d]) => (
            <li key={t} className="card-line rounded-[14px] p-4">
              <p className="font-semibold text-[14px]">{t}</p>
              <p className="text-[13px] text-sage mt-1">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-line rounded-[14px] p-6 self-start">
        {sent ? (
          <div role="status">
            <h2 className="font-display font-bold text-2xl">{pt ? "Verifique o seu email" : "Check your email"}</h2>
            <p className="text-[13px] text-sage mt-2">
              {pt ? `Enviámos um link de confirmação para ${form.email}. Depois de confirmar, entra no painel como afiliado.` : `We sent a confirmation link to ${form.email}. After confirming, you'll land in your affiliate dashboard.`}
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <h2 className="font-display font-bold text-2xl">{pt ? "Criar conta de afiliado" : "Create affiliate account"}</h2>
            {([
              ["name", pt ? "Nome" : "Name", "text"],
              ["email", "Email", "email"],
              ["password", pt ? "Palavra-passe" : "Password", "password"],
              ["channel", pt ? "Onde vai divulgar? (opcional)" : "Where will you promote? (optional)", "text"],
            ] as const).map(([k, label, type]) => (
              <label key={k} className="block text-[12px]">
                <span className="text-sage">{label}</span>
                <input
                  type={type}
                  value={form[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  className="mt-1 w-full rounded-[10px] bg-transparent px-3 py-2 text-[14px] shadow-[0_0_0_1px_var(--input)] focus:outline-none focus:shadow-[0_0_0_2px_var(--ember)]"
                />
              </label>
            ))}
            {err && <p className="text-[12px] text-destructive" role="alert">{err}</p>}
            <button disabled={busy} className="btn-ember w-full text-[13px]">{busy ? "…" : pt ? "Criar conta de afiliado" : "Create affiliate account"}</button>
            <button type="button" onClick={google} className="btn-line w-full text-[13px] flex items-center justify-center gap-2"><GoogleIcon /> {pt ? "Continuar com o Google" : "Continue with Google"}</button>
            <p className="text-[12px] text-sage text-center">
              {pt ? "Já tem conta?" : "Have an account?"} <Link to="/auth" className="underline">{pt ? "Entrar" : "Sign in"}</Link>
            </p>
          </form>
        )}
      </section>
    </main>
  );
}
