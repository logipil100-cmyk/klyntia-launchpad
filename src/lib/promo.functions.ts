import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  product: z.string().trim().min(5).max(1500),
  channel: z.string().trim().min(2).max(300),
  tone: z.string().trim().min(2).max(40),
  lang: z.enum(["pt", "en"]),
});

export type PromoResult = { ok: true; text: string } | { ok: false; code: number };

export const generatePromoText = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }): Promise<PromoResult> => {
    const { generatePromo, PromoError } = await import("./promo.server");
    try {
      return { ok: true, text: await generatePromo(data) };
    } catch (e) {
      const code = e instanceof PromoError ? e.status : 500;
      console.error("promo error", e);
      return { ok: false, code };
    }
  });
