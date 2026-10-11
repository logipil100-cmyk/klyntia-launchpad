import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const DEMO_MAX_USER_TURNS = 6;

const schema = z.object({
  lang: z.enum(["pt", "en"]),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(600) }))
    .min(1)
    .max(DEMO_MAX_USER_TURNS * 2),
});

export type DemoChatResult = { ok: true; text: string } | { ok: false; code: "limit" | "error" };

export const sendDemoMessage = createServerFn({ method: "POST" })
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }): Promise<DemoChatResult> => {
    if (data.messages.filter((m) => m.role === "user").length > DEMO_MAX_USER_TURNS) return { ok: false, code: "limit" };
    const { generateDemoReply } = await import("./chat.server");
    try {
      return { ok: true, text: await generateDemoReply(data) };
    } catch (e) {
      console.error("demo chat error", e);
      return { ok: false, code: "error" };
    }
  });
