import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Uses the user's own Google key when GEMINI_API_KEY is set (e.g. on Vercel);
// otherwise routes the same Gemini model through the Lovable AI Gateway.
export function getGeminiModel(model = "gemini-2.5-flash") {
  const gemini = process.env["GEMINI_API_KEY"];
  if (gemini) return createGoogleGenerativeAI({ apiKey: gemini })(model);
  const lovable = process.env["LOVABLE_API_KEY"];
  if (!lovable) return null;
  const provider = createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": lovable, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
  });
  return provider(`google/${model}`);
}
