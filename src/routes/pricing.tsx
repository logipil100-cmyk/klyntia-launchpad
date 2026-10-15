import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/components/site";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Preços — Gnistrabot" },
      { name: "description", content: "Planos Starter, Pro e Scale. Teste grátis por 5 dias, sem cartão. Reembolso disponível apenas nos primeiros 5 dias." },
      { property: "og:title", content: "Preços — Gnistrabot" },
      { property: "og:description", content: "Planos simples para atendimento e vendas com IA." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <div className="py-6 md:py-12"><Pricing /></div>,
});
