import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Modelo configurável via GEMINI_MODEL; por omissão usa o Flash estável mais recente.
const DEFAULT_MODEL = "gemini-3.8-flash";

export function getGeminiModel() {
  const apiKey = process.env["GEMINI_API_KEY"] || process.env["GOOGLE_GENERATIVE_AI_API_KEY"];
  if (!apiKey) throw new Error("AI not configured: define GEMINI_API_KEY nas variáveis de ambiente");
  const google = createGoogleGenerativeAI({ apiKey });
  return google(process.env["GEMINI_MODEL"] || DEFAULT_MODEL);
}
