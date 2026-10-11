import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/components/site";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Preços — Klyntia AI" },
      { name: "description", content: "Planos Starter, Pro e Scale. Teste grátis por 14 dias, sem cartão." },
      { property: "og:title", content: "Preços — Klyntia AI" },
      { property: "og:description", content: "Planos simples para atendimento e vendas com IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <div className="py-6 md:py-12"><Pricing /></div>,
});
