import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  lang: z.enum(["pt", "en"]),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(600) })).min(1).max(30),
});

export const testMyAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data, context }): Promise<{ ok: true; text: string } | { ok: false }> => {
    const { data: s } = await context.supabase.from("assistant_settings").select("*").eq("user_id", context.userId).maybeSingle();
    const { streamText } = await import("ai");
    const { getGeminiModel } = await import("./ai-model.server");
    const model = getGeminiModel();
    if (!model) return { ok: false };
    const language = data.lang === "pt" ? "European Portuguese (pt-PT)" : "English";
    try {
      const r = streamText({
        model,
        instructions: `You are "${s?.bot_name || "Assistente"}", the customer-support assistant of a business. Tone: ${s?.tone || "friendly"}. Reply in ${language} unless the customer writes in another language. Max 80 words, plain text.
Business hours: ${s?.business_hours || "not provided"}.
FAQ / business knowledge (only source of facts; if the answer is not here, say a human colleague will follow up):
${s?.faq || "(empty)"}`,
        messages: data.messages,
      });
      const text = (await r.text).trim();
      return text ? { ok: true, text } : { ok: false };
    } catch (e) {
      console.error("assistant test error", e);
      return { ok: false };
    }
  });
