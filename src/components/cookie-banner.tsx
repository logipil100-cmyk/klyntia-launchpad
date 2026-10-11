import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";

const KEY = "klyntia-storage-notice";

export function CookieBanner() {
  const { t } = useT();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div role="region" aria-label="Cookies" className="fixed bottom-4 left-4 right-20 md:right-auto md:max-w-md z-40 bg-ink text-paper rounded-xl p-4 shadow-[0_20px_50px_-20px_var(--ink)]">
      <p className="text-[12px] leading-relaxed">
        {t.cookies.text}{" "}
        <Link to="/privacy" className="underline underline-offset-2 text-paper/80 hover:text-paper">{t.cookies.more}</Link>
      </p>
      <button
        onClick={() => { localStorage.setItem(KEY, "1"); setShow(false); }}
        className="mt-3 bg-paper text-ink text-[12px] font-semibold px-3 py-1.5 rounded-full"
      >
        {t.cookies.ok}
      </button>
    </div>
  );
}
