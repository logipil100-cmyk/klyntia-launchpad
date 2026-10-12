// Technology providers listing. No database table exists for this, so the
// configuration is stored in this browser's localStorage only (demonstration).
// Public visibility is independent from technical integration status.

export type IntegrationStatus = "not_verified" | "pending_verification" | "connected" | "disconnected" | "requires_configuration" | "error";

export type Provider = {
  id: string;
  name: string;
  description: string;
  website: string;
  category: string;
  logoUrl: string;
  visible: boolean;
  integration: IntegrationStatus;
  evidence: string;
  order: number;
  verifiedAt: string | null;
};

export const STATUS_LABEL: Record<IntegrationStatus, string> = {
  not_verified: "Not verified",
  pending_verification: "Pending verification",
  connected: "Connected",
  disconnected: "Disconnected",
  requires_configuration: "Requires configuration",
  error: "Error",
};

const p = (id: string, name: string, description: string, website: string, category: string, order: number): Provider => ({
  id, name, description, website, category, order,
  logoUrl: `https://www.google.com/s2/favicons?domain=${new URL(website).hostname}&sz=64`,
  visible: false, integration: "not_verified", evidence: "", verifiedAt: null,
});

export const DEFAULT_PROVIDERS: Provider[] = [
  p("google", "Google", "Gemini models and Google sign-in.", "https://ai.google.dev", "AI & authentication", 1),
  p("openai", "OpenAI", "Large language models.", "https://openai.com", "AI", 2),
  p("anthropic", "Anthropic (Claude)", "Claude language models.", "https://www.anthropic.com", "AI", 3),
  p("vercel", "Vercel", "Web hosting and deployment.", "https://vercel.com", "Hosting", 4),
  p("netlify", "Netlify", "Web hosting and deployment.", "https://www.netlify.com", "Hosting", 5),
  p("supabase", "Supabase", "Database and authentication.", "https://supabase.com", "Backend", 6),
];

const DRAFT_KEY = "gnistrabot-providers-draft";
const PUB_KEY = "gnistrabot-providers-published";

function read(key: string): Provider[] | null {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as Provider[]) : null; } catch { return null; }
}
export const loadDraft = () => read(DRAFT_KEY) ?? read(PUB_KEY) ?? DEFAULT_PROVIDERS;
export const loadPublished = () => read(PUB_KEY) ?? [];
export const saveDraft = (list: Provider[]) => localStorage.setItem(DRAFT_KEY, JSON.stringify(list));
export const publish = (list: Provider[]) => { localStorage.setItem(PUB_KEY, JSON.stringify(list)); saveDraft(list); };

export function isValidUrl(u: string) {
  try { const x = new URL(u); return x.protocol === "https:" || x.protocol === "http:"; } catch { return false; }
}

/** Only providers shown publicly: visible AND verified (connected with evidence). */
export const publicProviders = (list: Provider[]) =>
  list.filter((x) => x.visible && x.integration === "connected" && x.evidence.trim()).sort((a, b) => a.order - b.order);
