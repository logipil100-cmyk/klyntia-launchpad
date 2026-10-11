import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";

const dict = {
  pt: {
    nav: { features: "Recursos", solutions: "Soluções", pricing: "Preços", contact: "Contacto", login: "Entrar" },
    hero: { eyebrow: "Inteligência artificial. Conexão humana.", a: "Atendimento ao cliente com", b: "inteligência artificial.", sub: "A Klyntia AI reúne respostas assistidas por IA e a experiência da sua equipa para um atendimento mais ágil, pessoal e consistente.", cta: "Começar grátis", demo: "Experimentar a IA agora", stat1: "14 dias grátis", stat2: "Sem cartão de crédito" },
    demo: { label: "Caixa de entrada · demo", ch: "Suporte · WhatsApp", m1: "Olá! A minha encomenda #4821 chegou danificada.", m2: "Lamento imenso! Já enviei a etiqueta de troca — chega em 48h. Posso emitir já um reembolso parcial de 30 €?", m3: "Sim, pode reembolsar, obrigado.", m4: "Reembolso confirmado", foot: "Conversa ilustrativa · Equipa + IA", ai: "Klyntia AI", live: "Falar com a IA ao vivo" },
    how: { title: "Pronto a funcionar em 3 passos.", items: [["Ligue os seus canais", "WhatsApp, Instagram e o widget do site numa só caixa de entrada."], ["Treine a IA", "Carregue o seu site, PDFs e perguntas frequentes. A IA aprende o seu negócio."], ["Atenda em escala", "A IA responde de imediato e passa à equipa os casos que precisam de uma pessoa."]] },
    feat: { title: "Tudo numa caixa de entrada.", items: [["Agente IA que resolve", "Responde, consulta o catálogo e executa ações no CRM sem escalar."], ["CRM que se preenche", "Cada conversa vira contacto, histórico e oportunidade automaticamente."], ["Automação de vendas", "Follow-ups, orçamentos e recuperação de carrinho a correr sozinhos."]] },
    more: { title: "Feito para equipas que crescem.", items: [["Base de conhecimento", "Treine a IA com PDFs, site e FAQs em minutos."], ["Passagem para humano", "Quando o caso é difícil, a IA passa a conversa com contexto completo."], ["Relatórios", "Veja o que foi resolvido, convertido e onde a IA precisou de ajuda."], ["Multi-equipa", "Permissões, filas e atribuição automática por canal."], ["Segurança", "Dados encriptados, registos de auditoria e controlo de acesso."], ["API e webhooks", "Ligue a Klyntia a qualquer sistema."]] },
    integ: { label: "Integrações", items: [["WhatsApp", "API oficial"], ["Instagram", "DMs + comentários"], ["Website", "widget leve"]] },
    sectors: { label: "Soluções por setor", title: "Feito para o seu negócio.", more: "Ver solução" },
    price: { title: "Escolha o seu plano.", note: "Preços de lançamento · 14 dias grátis em todos os planos, sem cartão.", monthly: "Mensal", yearly: "Anual −20%", per: "/mês", popular: "Popular", choose: "Começar com", sales: "Falar com vendas", vat: "Valores sem IVA.", plans: [["Starter", 29, "1 caixa · 500 respostas IA/mês", ["1 agente de IA", "Website + e-mail", "CRM básico"]], ["Pro", 89, "3 caixas · CRM · automações ilimitadas", ["3 agentes de IA", "WhatsApp + Instagram", "Automações ilimitadas", "Relatórios"]], ["Scale", 199, "Multi-filial · SLA · SSO", ["Agentes ilimitados", "API dedicada", "SLA 99,9% · SSO", "Gestor dedicado"]]] as [string, number, string, string[]][] },
    faq: { title: "Perguntas frequentes", items: [["Preciso de cartão para testar?", "Não. O teste de 14 dias é grátis e sem cartão."], ["Posso cancelar quando quiser?", "Sim, sem multa e sem burocracia."], ["Em que idiomas a IA responde?", "Português, inglês e os principais idiomas europeus, detetados automaticamente."], ["A IA substitui a minha equipa?", "Não. A IA trata das perguntas repetitivas e passa à equipa, com todo o contexto, os casos que precisam de uma pessoa."], ["Os meus dados estão seguros?", "Sim. Os dados são encriptados e tratados de acordo com o RGPD. Consulte a nossa Política de Privacidade."], ["Funciona com o WhatsApp oficial?", "Sim, ligamos à API oficial do WhatsApp Business."]] },
    launch: { label: "Programa de fundadores", title: "Seja um dos primeiros clientes.", sub: "Estamos a abrir a Klyntia AI a um grupo restrito de empresas. Os clientes fundadores recebem condições que não voltarão a existir.", perks: ["Preço de lançamento bloqueado enquanto mantiver a conta", "Configuração inicial feita connosco, sem custo", "Linha direta com a equipa de produto"], cta: "Quero ser cliente fundador" },
    cta: { a: "Pare de perder", b: "vendas no vácuo.", btn: "Criar a minha conta" },
    contact: { title: "Fale connosco.", sub: "Um especialista responde em menos de um dia útil.", name: "Nome completo", email: "E-mail profissional", msg: "Conte-nos o que precisa de automatizar…", send: "Enviar mensagem", sending: "A enviar…", ok: "Mensagem recebida! Respondemos em breve.", err: "Preencha nome, e-mail válido e mensagem.", fail: "Não foi possível enviar agora. Escreva-nos para" },
    chat: { title: "Klyntia AI", status: "Demonstração ao vivo", hello: "Olá! Sou a assistente da Klyntia AI. Pergunte-me o que quiser sobre a plataforma — ou finja que é um cliente da sua loja para ver como respondo.", placeholder: "Escreva a sua mensagem…", send: "Enviar", open: "Abrir chat de demonstração", close: "Fechar chat", error: "A IA está indisponível neste momento. Tente novamente mais tarde.", limit: "Chegou ao limite da demonstração. Crie uma conta grátis para continuar.", disclaimer: "Demonstração · as respostas são geradas por IA" },
    cookies: { text: "Usamos apenas armazenamento essencial para manter a sessão e a preferência de idioma. Sem cookies de publicidade.", more: "Saber mais", ok: "Entendi" },
    legal: { privacy: "Privacidade", terms: "Termos" },
    soon: "Login chega na próxima fase.",
  },
  en: {
    nav: { features: "Features", solutions: "Solutions", pricing: "Pricing", contact: "Contact", login: "Log in" },
    hero: { eyebrow: "Artificial intelligence. Human connection.", a: "Customer support with", b: "artificial intelligence.", sub: "Klyntia AI brings AI-assisted replies and your team’s expertise together for faster, more personal and consistent customer support.", cta: "Start free", demo: "Try the AI now", stat1: "14-day free trial", stat2: "No credit card" },
    demo: { label: "Inbox · demo", ch: "Support · WhatsApp", m1: "Hi! My order #4821 arrived damaged.", m2: "So sorry! I've sent a return label — arrives in 48h. Shall I issue a €30 partial refund now?", m3: "Yes, please refund, thanks.", m4: "Refund confirmed", foot: "Illustrative conversation · Team + AI", ai: "Klyntia AI", live: "Chat with the AI live" },
    how: { title: "Up and running in 3 steps.", items: [["Connect your channels", "WhatsApp, Instagram and your website widget in a single inbox."], ["Train the AI", "Upload your site, PDFs and FAQs. The AI learns your business."], ["Support at scale", "The AI replies instantly and hands the team the cases that need a person."]] },
    feat: { title: "Everything in one inbox.", items: [["An AI agent that resolves", "Answers, checks your catalog and takes CRM actions without escalating."], ["A CRM that fills itself", "Every conversation becomes a contact, history and deal automatically."], ["Sales automation", "Follow-ups, quotes and cart recovery running on their own."]] },
    more: { title: "Built for growing teams.", items: [["Knowledge base", "Train the AI on PDFs, your site and FAQs in minutes."], ["Human handoff", "For tough cases, the AI hands over with full context."], ["Reports", "See what was resolved, converted and where the AI needed help."], ["Multi-team", "Permissions, queues and auto-assignment per channel."], ["Security", "Encrypted data, audit logs and access control."], ["API & webhooks", "Connect Klyntia to any system."]] },
    integ: { label: "Integrations", items: [["WhatsApp", "Official API"], ["Instagram", "DMs + comments"], ["Website", "lightweight widget"]] },
    sectors: { label: "Solutions by industry", title: "Built for your business.", more: "See solution" },
    price: { title: "Pick your plan.", note: "Launch pricing · 14-day free trial on every plan, no card.", monthly: "Monthly", yearly: "Yearly −20%", per: "/mo", popular: "Popular", choose: "Start with", sales: "Talk to sales", vat: "Prices exclude VAT.", plans: [["Starter", 29, "1 inbox · 500 AI replies/mo", ["1 AI agent", "Website + email", "Basic CRM"]], ["Pro", 89, "3 inboxes · CRM · unlimited automations", ["3 AI agents", "WhatsApp + Instagram", "Unlimited automations", "Reports"]], ["Scale", 199, "Multi-branch · SLA · SSO", ["Unlimited agents", "Dedicated API", "99.9% SLA · SSO", "Dedicated manager"]]] as [string, number, string, string[]][] },
    faq: { title: "FAQ", items: [["Do I need a card to try?", "No. The 14-day trial is free, no card required."], ["Can I cancel anytime?", "Yes, no fees, no hassle."], ["Which languages does the AI speak?", "Portuguese, English and the main European languages, auto-detected."], ["Does the AI replace my team?", "No. The AI handles repetitive questions and hands your team the cases that need a person, with full context."], ["Is my data safe?", "Yes. Data is encrypted and handled in line with GDPR. See our Privacy Policy."], ["Does it work with official WhatsApp?", "Yes, we connect to the official WhatsApp Business API."]] },
    launch: { label: "Founders program", title: "Be one of our first customers.", sub: "We're opening Klyntia AI to a limited group of companies. Founding customers get terms we won't offer again.", perks: ["Launch price locked for as long as you keep your account", "Initial setup done with us, free of charge", "Direct line to the product team"], cta: "Become a founding customer" },
    cta: { a: "Stop losing", b: "sales to silence.", btn: "Create my account" },
    contact: { title: "Talk to us.", sub: "A specialist replies within one business day.", name: "Full name", email: "Work email", msg: "Tell us what you want to automate…", send: "Send message", sending: "Sending…", ok: "Message received! We'll reply soon.", err: "Please enter a name, valid email and message.", fail: "We couldn't send it right now. Email us at" },
    chat: { title: "Klyntia AI", status: "Live demo", hello: "Hi! I'm the Klyntia AI assistant. Ask me anything about the platform — or pretend to be one of your customers to see how I reply.", placeholder: "Type your message…", send: "Send", open: "Open demo chat", close: "Close chat", error: "The AI is unavailable right now. Please try again later.", limit: "You've reached the demo limit. Create a free account to keep going.", disclaimer: "Demo · replies are AI-generated" },
    cookies: { text: "We only use essential storage to keep your session and language preference. No advertising cookies.", more: "Learn more", ok: "Got it" },
    legal: { privacy: "Privacy", terms: "Terms" },
    soon: "Login arrives in the next phase.",
  },
};

export type Dict = (typeof dict)["pt"];
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({ lang: "pt", setLang: () => {}, t: dict.pt });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");
  useEffect(() => {
    const s = localStorage.getItem("klyntia-lang") ?? localStorage.getItem("cd-lang");
    if (s === "en" || s === "pt") { localStorage.setItem("klyntia-lang", s); localStorage.removeItem("cd-lang"); document.documentElement.lang = s; }
    if (s === "en" || s === "pt") setLangState(s);
  }, []);
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem("klyntia-lang", l); document.documentElement.lang = l; };
  return <Ctx.Provider value={{ lang, setLang, t: dict[lang] as Dict }}>{children}</Ctx.Provider>;
}
export const useT = () => useContext(Ctx);
