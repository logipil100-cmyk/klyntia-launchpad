import { useEffect, useState } from "react";
import {
  DEFAULT_SOCIAL_LINKS,
  isSocialUrlValid,
  loadSocialDraft,
  publishSocialLinks,
  saveSocialDraft,
  type SocialLink,
} from "@/lib/socials";

const input = "w-full rounded-[10px] px-3 py-2 text-sm bg-paper shadow-[0_0_0_1px_var(--input)] outline-none focus:shadow-[0_0_0_2px_var(--ember)]";

export function SocialLinksAdmin() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => setLinks(loadSocialDraft()), []);
  function update(next: SocialLink[]) {
    setLinks(next);
    saveSocialDraft(next);
    setNotice("Rascunho guardado neste navegador.");
  }
  function patch(id: SocialLink["id"], href: string) {
    update(links.map((link) => (link.id === id ? { ...link, href } : link)));
    setError("");
  }
  function publish() {
    const invalid = links.find((link) => !isSocialUrlValid(link));
    if (invalid) {
      setError(`Verifica o link de ${invalid.label}. Usa https:// ou tel:+351...`);
      return;
    }
    publishSocialLinks(links);
    setNotice("Redes publicadas no rodapé deste navegador.");
  }

  return (
    <div className="space-y-5 text-[13px]">
      <div role="note" className="rounded-[10px] p-3 bg-secondary text-[12px]">
        Define aqui os links oficiais que aparecem no rodapé. Por agora, esta configuração segue o mesmo modo de demonstração dos serviços: fica guardada neste navegador.
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <label key={link.id} className="text-[12px] text-sage">
            <span className="flex items-center gap-2 font-semibold text-ink"><span className="font-mono text-ember">{link.id === "phone" ? "tel" : socialLabel(link.id)}</span>{link.label}</span>
            <input className={`${input} mt-1`} value={link.href} onChange={(event) => patch(link.id, event.target.value)} placeholder={link.id === "phone" ? "tel:+351 900 000 000" : "https://..."} />
          </label>
        ))}
      </div>
      {error && <p className="text-[12px] text-destructive" role="alert">{error}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={publish} className="btn-ember text-[12px]">Publicar no rodapé</button>
        <button onClick={() => update(DEFAULT_SOCIAL_LINKS)} className="btn-line text-[12px]">Limpar links</button>
        {notice && <span className="text-[12px] text-sage" role="status">{notice}</span>}
      </div>
    </div>
  );
}

function socialLabel(id: SocialLink["id"]) {
  return id === "facebook" ? "fb" : id.slice(0, 2);
}

void socialLabel;
