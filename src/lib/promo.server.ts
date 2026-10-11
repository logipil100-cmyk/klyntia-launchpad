import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const MODEL = "gemini-2.5-flash";

export class PromoError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function generatePromo(input: { product: string; channel: string; tone: string; lang: "pt" | "en" }) {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) throw new PromoError(500, "AI not configured");
  const provider = createGoogleGenerativeAI({ apiKey });
  const language = input.lang === "pt" ? "Portuguese" : "English";
  const result = streamText({
    model: provider(MODEL),
    instructions: `You are a senior affiliate marketing copywriter for Gnistrabot, a premium customer-support SaaS combining AI-assisted replies with human expertise. Use a modern, clear, professional brand voice. Write in ${language}. Produce 3 distinct promotional texts tailored to the given channel's format and length norms (e.g. short hooks + hashtags for Instagram/TikTok, subject line + body for email, conversational for WhatsApp). Number them "1.", "2.", "3.", separate with a blank line. Each must include a clear call to action with the placeholder [SEU LINK] (or [YOUR LINK] in English). No markdown headings, no invented statistics. Keep the whole answer under 300 words.`,
    messages: [{ role: "user", content: `Product / offer:\n${input.product}\n\nChannel:\n${input.channel}\n\nTone: ${input.tone}` }],
  });
  try {
    const text = (await result.text).trim();
    if (!text) throw new PromoError(422, "empty");
    return text;
  } catch (e: unknown) {
    if (e instanceof PromoError) throw e;
    const status = (e as { statusCode?: number })?.statusCode ?? 500;
    throw new PromoError(status, (e as Error)?.message ?? "error");
  }
}
