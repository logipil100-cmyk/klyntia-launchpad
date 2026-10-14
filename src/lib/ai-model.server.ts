import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Each route needs a different model name: Google direct vs the Lovable AI Gateway.
export const GOOGLE_DIRECT_MODEL = "gemini-2.0-flash";
export const GATEWAY_MODEL = "google/gemini-2.5-flash";

/** GEMINI_API_KEY (e.g. on Vercel) → Google direct; else LOVABLE_API_KEY → gateway; else null. */
export function getGeminiModel() {
  const gemini = process.env["GEMINI_API_KEY"];
  if (gemini) return createGoogleGenerativeAI({ apiKey: gemini })(GOOGLE_DIRECT_MODEL);
  const lovable = process.env["LOVABLE_API_KEY"];
  if (!lovable) return null;
  const provider = createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": lovable, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  return provider(GATEWAY_MODEL);
}
