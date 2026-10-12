import { useEffect } from "react";

/**
 * Scroll-reveal progressivo: adiciona a classe `is-in` aos elementos [data-reveal]
 * quando entram no viewport. Sem JS/reduced-motion o conteúdo permanece visível
 * (o CSS só esconde quando <html> tem a classe `js-reveal`).
 */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("js-reveal")) root.classList.add("js-reveal");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduce || typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => {
      // re-observa elementos montados tardiamente (mudança de rota/lang)
      if (!el.dataset["revealBound"]) {
        io.observe(el);
        el.dataset["revealBound"] = "1";
      }
    });
    return () => io.disconnect();
  });
}
