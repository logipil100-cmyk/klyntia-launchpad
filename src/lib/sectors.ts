import type { Lang } from "./i18n";

type SectorCopy = {
  name: string;
  title: string;
  sub: string;
  pains: [string, string][];
  example: { customer: string; ai: string };
};

export type Sector = { slug: string; copy: Record<Lang, SectorCopy> };

export const SECTORS: Sector[] = [
  {
    slug: "clinicas",
    copy: {
      pt: {
        name: "Clínicas e consultórios",
        title: "Marcações e dúvidas de pacientes, respondidas a qualquer hora.",
        sub: "A Klyntia AI responde a perguntas sobre horários, preços e preparação para consultas no WhatsApp e no site, e passa à receção os casos clínicos.",
        pains: [
          ["Receção sobrecarregada", "A IA trata das perguntas repetitivas e liberta a equipa para quem está na clínica."],
          ["Mensagens fora de horas", "Pacientes recebem resposta imediata, mesmo à noite e ao fim de semana."],
          ["Faltas a consultas", "Lembretes e confirmações automáticas reduzem as faltas."],
        ],
        example: { customer: "Olá, quanto custa uma consulta de dermatologia e têm vaga esta semana?", ai: "Olá! A consulta de dermatologia custa 60 €. Esta semana temos vagas na quinta às 10h e na sexta às 15h. Quer que reserve uma delas?" },
      },
      en: {
        name: "Clinics and practices",
        title: "Patient bookings and questions, answered around the clock.",
        sub: "Klyntia AI answers questions about hours, prices and appointment prep on WhatsApp and your website, and hands clinical cases to your front desk.",
        pains: [
          ["Overloaded front desk", "The AI handles repetitive questions so your team can focus on patients in the clinic."],
          ["After-hours messages", "Patients get an instant reply, even at night and on weekends."],
          ["Missed appointments", "Automatic reminders and confirmations reduce no-shows."],
        ],
        example: { customer: "Hi, how much is a dermatology appointment and do you have openings this week?", ai: "Hi! A dermatology appointment is €60. This week we have Thursday at 10am and Friday at 3pm. Shall I book one for you?" },
      },
    },
  },
  {
    slug: "lojas-online",
    copy: {
      pt: {
        name: "Lojas online",
        title: "Venda mais respondendo no momento em que o cliente pergunta.",
        sub: "A IA consulta o catálogo, acompanha encomendas e recupera carrinhos abandonados no WhatsApp, Instagram e no site.",
        pains: [
          ["Perguntas sobre encomendas", "“Onde está a minha encomenda?” respondido em segundos, sem intervenção da equipa."],
          ["Vendas perdidas por demora", "Respostas imediatas sobre tamanhos, stock e portes no momento da decisão."],
          ["Carrinhos abandonados", "Follow-ups automáticos e personalizados para recuperar vendas."],
        ],
        example: { customer: "Este casaco tem tamanho M em preto?", ai: "Tem sim! O casaco em preto, tamanho M, está disponível e o envio é grátis acima de 50 €. Quer que lhe envie o link para finalizar?" },
      },
      en: {
        name: "Online stores",
        title: "Sell more by replying the moment a customer asks.",
        sub: "The AI checks your catalog, tracks orders and recovers abandoned carts on WhatsApp, Instagram and your website.",
        pains: [
          ["Order status questions", "“Where is my order?” answered in seconds, with no team involvement."],
          ["Sales lost to slow replies", "Instant answers about sizes, stock and shipping right at decision time."],
          ["Abandoned carts", "Automatic, personalized follow-ups to win back sales."],
        ],
        example: { customer: "Does this coat come in size M in black?", ai: "It does! The black coat in size M is in stock and shipping is free over €50. Shall I send you the checkout link?" },
      },
    },
  },
  {
    slug: "imobiliarias",
    copy: {
      pt: {
        name: "Imobiliárias",
        title: "Qualifique contactos e marque visitas sem perder nenhum lead.",
        sub: "A IA responde a perguntas sobre imóveis, qualifica o interessado e agenda visitas, entregando ao consultor apenas os leads prontos.",
        pains: [
          ["Leads que esfriam", "Cada contacto recebe resposta imediata, mesmo quando o consultor está numa visita."],
          ["Tempo gasto a qualificar", "A IA pergunta orçamento, zona e prazo antes de passar o lead."],
          ["Agenda desorganizada", "Visitas marcadas e confirmadas automaticamente."],
        ],
        example: { customer: "O T2 em Arroios ainda está disponível?", ai: "Ainda está! O T2 em Arroios custa 1.200 €/mês. Para avançar, procura para quando e quantas pessoas vão viver no imóvel?" },
      },
      en: {
        name: "Real estate agencies",
        title: "Qualify contacts and book viewings without losing a single lead.",
        sub: "The AI answers questions about listings, qualifies the prospect and books viewings, passing agents only the leads that are ready.",
        pains: [
          ["Leads going cold", "Every contact gets an instant reply, even while the agent is at a viewing."],
          ["Time spent qualifying", "The AI asks about budget, area and timeline before handing over."],
          ["Messy calendars", "Viewings booked and confirmed automatically."],
        ],
        example: { customer: "Is the 2-bedroom in Arroios still available?", ai: "It is! The 2-bedroom in Arroios is €1,200/month. To move forward, when are you looking to move in and how many people will live there?" },
      },
    },
  },
];

export const getSector = (slug: string) => SECTORS.find((s) => s.slug === slug);
