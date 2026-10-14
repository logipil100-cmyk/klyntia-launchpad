export type SocialLink = {
  id: "facebook" | "instagram" | "whatsapp" | "tiktok" | "youtube" | "phone";
  label: string;
  href: string;
};

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { id: "facebook", label: "Facebook", href: "" },
  { id: "instagram", label: "Instagram", href: "" },
  { id: "whatsapp", label: "WhatsApp", href: "" },
  { id: "tiktok", label: "TikTok", href: "" },
  { id: "youtube", label: "YouTube", href: "" },
  { id: "phone", label: "Telefone", href: "" },
];

const DRAFT_KEY = "gnistrabot-social-links-draft";
const PUBLISHED_KEY = "gnistrabot-social-links-published";

function read(key: string): SocialLink[] | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as SocialLink[]) : null;
  } catch {
    return null;
  }
}

export const loadSocialDraft = () => read(DRAFT_KEY) ?? read(PUBLISHED_KEY) ?? DEFAULT_SOCIAL_LINKS;
export const loadPublishedSocialLinks = () => read(PUBLISHED_KEY) ?? DEFAULT_SOCIAL_LINKS;
export const saveSocialDraft = (links: SocialLink[]) => localStorage.setItem(DRAFT_KEY, JSON.stringify(links));
export const publishSocialLinks = (links: SocialLink[]) => {
  localStorage.setItem(PUBLISHED_KEY, JSON.stringify(links));
  saveSocialDraft(links);
};

export function isSocialUrlValid(link: SocialLink) {
  if (!link.href.trim()) return true;
  if (link.id === "phone") return /^tel:\+?[0-9 ()-]+$/.test(link.href.trim());
  try {
    const url = new URL(link.href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export const visibleSocialLinks = (links: SocialLink[]) => links.filter((link) => link.href.trim());

export const socialIconLabel = (id: SocialLink["id"]) => ({
  facebook: "f",
  instagram: "ig",
  whatsapp: "wa",
  tiktok: "tk",
  youtube: "yt",
  phone: "tel",
}[id]);
