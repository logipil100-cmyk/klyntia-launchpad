import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, type LegalContent } from "@/components/legal-page";

const content: LegalContent = {
  pt: {
    title: "Termos de Serviço",
    updated: "Última atualização: outubro de 2026",
    sections: [
      ["Aceitação", "Ao criar uma conta ou usar a Klyntia AI, aceita estes termos. Se usar o serviço em nome de uma empresa, declara ter poderes para a vincular."],
      ["Período de teste", "Todos os planos incluem 14 dias de teste gratuito sem cartão. No fim do teste, a conta só passa a pago se escolher um plano."],
      ["Planos e pagamento", "Os preços são apresentados sem IVA. A faturação é mensal ou anual, conforme o plano escolhido, e pode cancelar a qualquer momento sem penalização; o cancelamento produz efeito no fim do período pago."],
      ["Utilização aceitável", "Não pode usar o serviço para enviar spam, conteúdo ilegal ou enganoso, nem para violar os termos do WhatsApp, Instagram ou de outros canais ligados."],
      ["Respostas de IA", "As respostas geradas por IA podem conter erros. É responsável por rever as configurações e o conhecimento fornecido à IA e por supervisionar o seu uso junto dos seus clientes."],
      ["Os seus dados", "Os dados e conversas dos seus clientes pertencem-lhe. Tratamo-los apenas para prestar o serviço, conforme a nossa Política de Privacidade."],
      ["Contacto", "Para questões sobre estes termos, escreva para support@klyntia.com."],
    ],
  },
  en: {
    title: "Terms of Service",
    updated: "Last updated: October 2026",
    sections: [
      ["Acceptance", "By creating an account or using Klyntia AI, you accept these terms. If you use the service on behalf of a company, you confirm you are authorized to bind it."],
      ["Free trial", "Every plan includes a 14-day free trial with no card. At the end of the trial, your account only becomes paid if you choose a plan."],
      ["Plans and billing", "Prices exclude VAT. Billing is monthly or yearly depending on your plan, and you can cancel anytime with no penalty; cancellation takes effect at the end of the paid period."],
      ["Acceptable use", "You may not use the service to send spam or illegal or misleading content, or to breach the terms of WhatsApp, Instagram or other connected channels."],
      ["AI replies", "AI-generated replies may contain mistakes. You are responsible for reviewing the settings and knowledge given to the AI and supervising its use with your customers."],
      ["Your data", "Your data and your customers' conversations belong to you. We process them only to provide the service, as described in our Privacy Policy."],
      ["Contact", "For questions about these terms, email support@klyntia.com."],
    ],
  },
};

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Termos de Serviço — Klyntia AI" },
      { name: "description", content: "Termos de utilização da plataforma Klyntia AI." },
    ],
  }),
  component: () => <LegalPage content={content} />,
});
