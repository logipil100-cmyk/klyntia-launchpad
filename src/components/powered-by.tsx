import { useEffect, useState } from "react";
import { isValidUrl, loadPublished, publicProviders, type Provider } from "@/lib/providers";

export function PoweredByStrip({ providers }: { providers: Provider[] }) {
  const list = publicProviders(providers);
  if (list.length === 0) {
    return <p className="text-[11px] text-sage">Built with modern web technology.</p>;
  }
  const items = list.length > 3 ? [...list, ...list] : list;
  return (
    <div>
      <p className="text-[11px] font-mono text-sage mb-2">Powered by Modern Technology</p>
      <div className="powered-viewport overflow-hidden" tabIndex={0} aria-label="Technologies used by Gnistrabot">
        <ul className={`flex gap-6 w-max ${list.length > 3 ? "powered-track" : "flex-wrap"}`}>
          {items.map((x, i) => {
            const inner = (
              <span className="flex items-center gap-2 text-[13px] text-ink opacity-80 hover:opacity-100 transition-opacity">
                {x.logoUrl && <img src={x.logoUrl} alt="" width={18} height={18} loading="lazy" className="rounded-sm" />}
                {x.name}
              </span>
            );
            return (
              <li key={`${x.id}-${i}`} aria-hidden={i >= list.length || undefined}>
                {isValidUrl(x.website)
                  ? <a href={x.website} target="_blank" rel="noopener noreferrer" tabIndex={i >= list.length ? -1 : undefined}>{inner}</a>
                  : inner}
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mt-2 text-[10px] text-sage">Names and logos belong to their owners and do not imply endorsement or partnership.</p>
    </div>
  );
}

export function PoweredByFooter() {
  const [providers, setProviders] = useState<Provider[]>([]);
  useEffect(() => { setProviders(loadPublished()); }, []);
  return <div className="mt-6"><PoweredByStrip providers={providers} /></div>;
}
