import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, type LegalContent } from "@/components/legal-page";

const content: LegalContent = {
  pt: {
    title: "Política de Privacidade",
    updated: "Última atualização: outubro de 2026",
    sections: [
      ["Quem somos", "A Klyntia AI é responsável pelo tratamento dos dados pessoais recolhidos neste site. Para qualquer questão sobre privacidade, contacte support@klyntia.com."],
      ["Que dados recolhemos", "Nome e e-mail quando cria conta ou nos contacta; o conteúdo das mensagens que nos envia; e mensagens trocadas com a demonstração de IA, que não são guardadas após a resposta."],
      ["Para que usamos os dados", "Para gerir a sua conta, responder aos seus pedidos e prestar o serviço contratado. Não vendemos dados pessoais nem os usamos para publicidade."],
      ["Armazenamento local", "Usamos apenas armazenamento essencial no navegador para manter a sessão iniciada e a preferência de idioma. Não usamos cookies de publicidade nem de rastreio de terceiros."],
      ["Subcontratantes", "Recorremos a fornecedores de alojamento, base de dados e modelos de IA que tratam dados em nosso nome, com garantias adequadas nos termos do RGPD."],
      ["Os seus direitos", "Pode pedir acesso, retificação, apagamento, limitação ou portabilidade dos seus dados, e opor-se ao seu tratamento, escrevendo para support@klyntia.com. Pode também apresentar reclamação à CNPD."],
      ["Conservação", "Guardamos os dados apenas enquanto forem necessários para as finalidades indicadas ou enquanto a lei o exigir."],
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: "Last updated: October 2026",
    sections: [
      ["Who we are", "Klyntia AI is the controller of personal data collected on this site. For any privacy question, contact support@klyntia.com."],
      ["What we collect", "Name and email when you sign up or contact us; the content of messages you send us; and messages exchanged with the AI demo, which are not stored after the reply."],
      ["How we use data", "To manage your account, answer your requests and provide the contracted service. We do not sell personal data or use it for advertising."],
      ["Local storage", "We only use essential browser storage to keep you signed in and remember your language. We do not use advertising or third-party tracking cookies."],
      ["Processors", "We rely on hosting, database and AI model providers that process data on our behalf, with appropriate safeguards under the GDPR."],
      ["Your rights", "You can request access, rectification, erasure, restriction or portability of your data, and object to its processing, by emailing support@klyntia.com. You may also lodge a complaint with your data protection authority."],
      ["Retention", "We keep data only as long as needed for the stated purposes or as required by law."],
    ],
  },
};

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — Klyntia AI" },
      { name: "description", content: "Como a Klyntia AI recolhe, usa e protege os seus dados pessoais." },
    ],
  }),
  component: () => <LegalPage content={content} />,
});
