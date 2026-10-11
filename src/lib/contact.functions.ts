import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  msg: z.string().trim().min(1).max(2000),
  website: z.string().max(0).optional(),
  lang: z.enum(["pt", "en"]),
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d) => contactSchema.parse(d))
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contact_messages")
      .insert({ name: data.name, email: data.email, message: data.msg, lang: data.lang });
    if (error) {
      console.error("contact insert error", error.message);
      return { ok: false };
    }
    return { ok: true };
  });
