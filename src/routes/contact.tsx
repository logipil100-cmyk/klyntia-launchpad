import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { useT } from "@/lib/i18n";
import { contactSchema, sendContactMessage } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contacto — Klyntia AI" },
      { name: "description", content: "Fale com um especialista da Klyntia AI. Resposta em menos de um dia útil." },
      { property: "og:title", content: "Contacto — Klyntia AI" },
      { property: "og:description", content: "Fale com a equipa Klyntia AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { t, lang } = useT();
  const send = useServerFn(sendContactMessage);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err" | "fail">("idle");
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const r = contactSchema.safeParse({ ...Object.fromEntries(new FormData(form)), lang });
    if (!r.success) return setState("err");
    setState("sending");
    try {
      const res = await send({ data: r.data });
      if (!res.ok) return setState("fail");
      setState("ok");
      form.reset();
    } catch {
      setState("fail");
    }
  };
  const input = "w-full rounded-lg bg-paper px-4 py-3 text-sm shadow-[0_0_0_1px_var(--input)] focus:outline-none focus:shadow-[0_0_0_2px_var(--ember)]";
  return (
    <section className="max-w-xl mx-auto px-4 py-12 md:py-20">
      <p className="eyebrow mb-4">{t.nav.contact}</p>
      <h1 className="font-display font-extrabold text-[2.6rem] md:text-6xl leading-[0.95]">{t.contact.title}</h1>
      <p className="mt-4 text-sage">{t.contact.sub}</p>
      <form onSubmit={submit} className="mt-8 space-y-3" noValidate>
        <label className="sr-only" htmlFor="c-name">{t.contact.name}</label>
        <input id="c-name" name="name" autoComplete="name" placeholder={t.contact.name} className={input} maxLength={100} required />
        <label className="sr-only" htmlFor="c-email">{t.contact.email}</label>
        <input id="c-email" name="email" type="email" autoComplete="email" placeholder={t.contact.email} className={input} maxLength={255} required />
        <label className="sr-only" htmlFor="c-msg">{t.contact.msg}</label>
        <textarea id="c-msg" name="msg" rows={5} placeholder={t.contact.msg} className={input} maxLength={2000} required />
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <div aria-live="polite">
          {state === "ok" && <p className="text-sm text-ember">{t.contact.ok}</p>}
          {state === "err" && <p className="text-sm text-destructive">{t.contact.err}</p>}
          {state === "fail" && (
            <p className="text-sm text-destructive">
              {t.contact.fail} <a href="mailto:support@klyntia.com" className="underline">support@klyntia.com</a>
            </p>
          )}
        </div>
        <button disabled={state === "sending"} className="btn-ember w-full disabled:opacity-60">
          {state === "sending" ? t.contact.sending : t.contact.send}
        </button>
      </form>
    </section>
  );
}
