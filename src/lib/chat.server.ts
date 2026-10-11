import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

const MODEL = "openai/gpt-6-astra";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export async function generateDemoReply(input: { messages: ChatTurn[]; lang: "pt" | "en" }) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI not configured");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  const language = input.lang === "pt" ? "European Portuguese (pt-PT)" : "English";
  const result = streamText({
    model: provider.responses(MODEL),
    instructions: `You are the live demo assistant on the Klyntia AI website. Klyntia AI is a customer-support SaaS that combines AI-assisted replies with human teams in one inbox for WhatsApp, Instagram and website chat. It includes an AI agent, a CRM that fills itself, sales automations, a knowledge base, human handoff, reports, multi-team permissions and an API. Plans (launch pricing, VAT excluded): Starter €29/month, Pro €89/month, Scale €199/month; yearly billing saves 20%; 14-day free trial with no card.
Reply in ${language} unless the visitor writes in another language. Be warm, concise (max 80 words) and professional. If the visitor role-plays as a customer of their own business, answer as a helpful support agent would, to showcase the product. Never invent customer numbers, statistics or features not listed. If asked something you cannot answer, suggest contacting support@klyntia.com. Plain text only, no markdown.`,
    messages: input.messages,
    providerOptions: { openai: { reasoningEffort: "low", store: false } },
  });
  const text = (await result.text).trim();
  if (!text) throw new Error("empty");
  return text;
}
